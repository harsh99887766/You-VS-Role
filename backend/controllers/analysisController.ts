import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import pdfParse from 'pdf-parse';
import Candidate from '../models/Candidate';

const API_KEY = process.env.GEMINI_API_KEY || '';

export const analyzeCandidate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobDescription, providedApiKey } = req.body;
    
    // Check for API key
    const keyToUse = providedApiKey || API_KEY;
    if (!keyToUse) {
      res.status(400).json({ error: 'Gemini API key is required. Please provide it in the frontend settings.' });
      return;
    }

    if (!jobDescription) {
      res.status(400).json({ error: 'Job description is required.' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: 'Resume PDF file is required.' });
      return;
    }

    // 1. Parse PDF
    const parse = typeof pdfParse === 'function' ? pdfParse : (pdfParse as any).default;
    const pdfData = await parse(req.file.buffer);
    const resumeText = pdfData.text;

    // 2. Setup Gemini AI Call
    const ai = new GoogleGenerativeAI(keyToUse);
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are an elite AI Hiring Intelligence System designed to replicate the thinking of a senior hiring manager.
Perform deep semantic analysis between:
1. A Job Description (JD)
2. A Candidate Profile (Resume extracted text)

Job Description:
${jobDescription}

Candidate Resume:
${resumeText}

Analyze and return EXACTLY the following JSON schema:
{
  "match_score": number (0-100),
  "growth_potential": number (0-100),
  "risk_summary": {
    "overall_risk": "Low" | "Medium" | "High" | "Critical",
    "critical_gaps": [string]
  },
  "strengths": [string],
  "weaknesses": [string],
  "hidden_strengths": [string],
  "inconsistencies": [string],
  "skills_analysis": [
    {
      "skill": string,
      "required_level": number (1-5),
      "candidate_level": number (1-5),
      "gap": number,
      "risk": "Low" | "Medium" | "High" | "Critical",
      "reasoning": string
    }
  ],
  "skill_graph": [
    {
      "skill": string,
      "related_skills": [string]
    }
  ],
  "interview_questions": [
    {
      "type": "conceptual" | "scenario",
      "question": string
    }
  ],
  "learning_path": [
    {
      "skill": string,
      "resources": [string],
      "timeline": string,
      "priority": "High" | "Medium" | "Low"
    }
  ],
  "what_if_analysis": {
    "improved_score": number,
    "risk_reduction": string,
    "assumptions": string
  },
  "final_recommendation": "Strong Hire" | "Hire" | "Train and Hire" | "Hold" | "Reject",
  "explanation": string
}

Ensure the output is valid JSON format without any markdown code block wrappers (just raw JSON).
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean response
    const cleanedJson = responseText.replace(/^```json/g, '').replace(/```$/g, '').trim();
    let analysisData;
    try {
      analysisData = JSON.parse(cleanedJson);
    } catch(e) {
      // Fallback if parsing fails
      analysisData = { error: "Failed to parse JSON", raw: cleanedJson };
    }

    // 3. Save to DB (Best Effort)
    try {
      const newCandidate = new Candidate({
        name: "Candidate " + Date.now(),
        jobDescription,
        resumeText: resumeText.substring(0, 1000) + '...',
        analysisResult: analysisData
      });
      await newCandidate.save();
    } catch (dbError) {
      console.log('Could not save to DB (likely no connection), skipping DB save.');
    }

    // 4. Send Response
    res.status(200).json(analysisData);

  } catch (error: any) {
    console.error('Error in analyzeCandidate:', error);
    res.status(500).json({ error: 'Failed to analyze candidate', details: error.message });
  }
};

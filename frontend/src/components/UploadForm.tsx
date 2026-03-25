import { useState } from 'react';
import { Upload, FileText, Send, AlertCircle, Zap } from 'lucide-react';
import axios from 'axios';

interface UploadFormProps {
  apiKey: string;
  onResult: (data: any) => void;
}

export default function UploadForm({ apiKey, onResult }: UploadFormProps) {
  const [jd, setJd] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jd || !file) {
      setError('Please provide both a Job Description and a Resume PDF.');
      return;
    }

    if (!apiKey) {
      // Demo Mode Fallback using the exact prompt schema
      setLoading(true);
      setError('');
      setTimeout(() => {
        onResult({
          match_score: 85,
          growth_potential: 92,
          risk_summary: {
            overall_risk: "Medium",
            critical_gaps: ["Advanced Kubernetes Orchestration", "Microservices Architecture"]
          },
          strengths: ["React JS", "Node.js", "Team Leadership", "Agile Methodologies"],
          weaknesses: ["Cloud Native Deployment", "GraphQL"],
          hidden_strengths: ["Technical Writing", "Mentorship"],
          inconsistencies: ["Claimed expert level Docker but no Docker projects listed"],
          skills_analysis: [
            { skill: "React", required_level: 5, candidate_level: 5, gap: 0, risk: "Low", reasoning: "Extensive experience in multiple roles." },
            { skill: "Node.js", required_level: 4, candidate_level: 4, gap: 0, risk: "Low", reasoning: "Used Express in production." },
            { skill: "Kubernetes", required_level: 4, candidate_level: 1, gap: 3, risk: "High", reasoning: "Only mentions Docker, no K8s experience." }
          ],
          skill_graph: [
            { skill: "React", related_skills: ["Redux", "Hooks", "Next.js"] },
            { skill: "Node.js", related_skills: ["Express", "REST APIs", "Typescript"] }
          ],
          interview_questions: [
            { type: "scenario", question: "How would you handle scaling a Node.js service using container orchestration if you are new to Kubernetes?" },
            { type: "conceptual", question: "What is your approach to handling side-effects in React?" }
          ],
          learning_path: [
            { skill: "Kubernetes", resources: ["CKS Certification path", "Kubernetes up and running book"], timeline: "3 months", priority: "High" }
          ],
          what_if_analysis: {
            improved_score: 95,
            risk_reduction: "Medium risk drops to Low if K8s gap is bridged.",
            assumptions: "Assuming candidate learns K8s orchestration patterns."
          },
          final_recommendation: "Train and Hire",
          explanation: "Candidate has very strong frontend and basic backend skills, but lacks the necessary container orchestration experience required for this DevOps-heavy role. Based on high growth potential, training is recommended."
        });
        setLoading(false);
      }, 3000);
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('jobDescription', jd);
    formData.append('resume', file);
    formData.append('providedApiKey', apiKey);

    try {
      const response = await axios.post('http://localhost:5000/api/analysis/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      onResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to analyze candidate. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-display font-bold mb-4 text-glow">Deep Semantic Candidate Evaluation</h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Upload a candidate's resume and providing the Job Description. Our AI acts as a senior hiring manager to analyze gaps, risks, and true potential.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-8 neon-border">
        {error && (
          <div className="bg-error/10 border border-error/50 text-error px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <FileText className="w-4 h-4 text-primary" />
              Job Description
            </label>
            <textarea 
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the full job description here..."
              className="w-full h-64 bg-black/50 border border-white/10 rounded-xl p-4 text-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
            />
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Upload className="w-4 h-4 text-secondary" />
              Candidate Resume (PDF)
            </label>
            
            <div className={`w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all ${file ? 'border-primary bg-primary/5' : 'border-white/20 hover:border-white/40 bg-black/30 hover:bg-black/50'} relative cursor-pointer`}>
              <input 
                type="file" 
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              {file ? (
                <div className="text-center">
                  <FileText className="w-12 h-12 text-primary mx-auto mb-3" />
                  <p className="font-medium text-white">{file.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <div className="text-center px-6">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="font-medium text-gray-300 mb-1">Click or drag PDF to upload</p>
                  <p className="text-xs text-gray-500">Maximum file size 5MB</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            type="submit"
            disabled={loading}
            className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all ${loading ? 'bg-white/10 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-primary to-secondary text-white hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]'}`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Analyzing Profile...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Generate Deep Analysis
              </>
            )}
          </button>
        </div>
      </form>
      
      {!apiKey && (
        <div className="mt-6 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
          <Zap className="w-4 h-4 text-warning" />
          Running in Demo Mode. To use live AI, add your Gemini API Key in settings.
        </div>
      )}
    </div>
  );
}

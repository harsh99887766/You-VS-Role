import mongoose, { Schema, Document } from 'mongoose';

export interface ICandidate extends Document {
  name: string;
  jobDescription: string;
  resumeText: string;
  analysisResult: any;
  createdAt: Date;
}

const CandidateSchema: Schema = new Schema({
  name: { type: String, required: true },
  jobDescription: { type: String, required: true },
  resumeText: { type: String, required: true },
  analysisResult: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ICandidate>('Candidate', CandidateSchema);

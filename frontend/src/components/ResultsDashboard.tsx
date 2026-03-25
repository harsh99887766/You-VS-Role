import { ArrowLeft, TrendingUp, AlertTriangle, CheckCircle, XCircle, PieChart, Info, Map as MapIcon, HelpCircle, Activity } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface ResultsDashboardProps {
  result: any;
  onReset: () => void;
}

export default function ResultsDashboard({ result, onReset }: ResultsDashboardProps) {
  // Safe default for recharts
  const radarData = result.skills_analysis?.map((item: any) => ({
    subject: item.skill,
    Required: item.required_level,
    Candidate: item.candidate_level,
    fullMark: 5,
  })) || [];

  const getRiskColor = (risk: string) => {
    switch(risk?.toLowerCase()) {
      case 'low': return 'text-accent border-accent/30 bg-accent/10';
      case 'medium': return 'text-orange-400 border-orange-400/30 bg-orange-400/10';
      case 'high': return 'text-red-400 border-red-400/30 bg-red-400/10';
      case 'critical': return 'text-red-500 border-red-500/50 bg-red-500/20 font-bold';
      default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-accent';
    if (score >= 60) return 'text-orange-400';
    return 'text-error';
  };

  const ScoreCircle = ({ score, label, color }: { score: number, label: string, color: string }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="transform -rotate-90 w-32 h-32">
            <circle cx="64" cy="64" r="40" className="stroke-white/10" strokeWidth="8" fill="none" />
            <circle 
              cx="64" cy="64" r="40" 
              className={`stroke-current ${color}`} 
              strokeWidth="8" fill="none" 
              strokeDasharray={circumference} 
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-display font-bold">{score}</span>
          </div>
        </div>
        <span className="text-gray-400 font-medium uppercase tracking-wider text-xs">{label}</span>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex items-center justify-between">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Upload
        </button>
        <div className="px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary font-medium text-sm flex items-center gap-2">
          <Activity className="w-4 h-4" /> AI Analysis Complete
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex flex-col items-center justify-center neon-border">
          <ScoreCircle score={result.match_score || 0} label="Match Score" color={getScoreColor(result.match_score || 0)} />
        </div>
        
        <div className="glass-card p-6 flex flex-col justify-center items-center">
          <ScoreCircle score={result.growth_potential || 0} label="Growth Potential" color="text-secondary" />
        </div>
        
        <div className="glass-card p-6 flex flex-col justify-center items-center">
          <div className="text-center mb-4">
            <h3 className="text-gray-400 uppercase tracking-wide text-xs font-semibold mb-2">Overall Risk</h3>
            <span className={`text-3xl font-bold font-display ${getScoreColor(result.match_score || 0)}`}>
              {result.risk_summary?.overall_risk || "Unknown"}
            </span>
          </div>
          <div className="w-full bg-black/50 rounded-lg p-3 border border-white/5">
            <h4 className="text-xs text-gray-500 mb-2 uppercase">Critical Gaps</h4>
            {result.risk_summary?.critical_gaps?.length > 0 ? (
              <ul className="text-sm text-gray-300 space-y-1">
                {result.risk_summary.critical_gaps.map((gap: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" /> {gap}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-sm text-gray-400">No critical gaps identified.</span>
            )}
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><PieChart className="w-5 h-5 text-primary" /> Profile Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="flex items-center gap-2 text-accent mb-3 font-medium"><CheckCircle className="w-4 h-4" /> Strengths</h4>
              <div className="flex flex-wrap gap-2">
                {result.strengths?.map((s: string, i: number) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="flex items-center gap-2 text-error mb-3 font-medium"><XCircle className="w-4 h-4" /> Weaknesses</h4>
              <div className="flex flex-wrap gap-2">
                {result.weaknesses?.map((w: string, i: number) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-error/10 border border-error/20 text-error text-sm">{w}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="flex items-center gap-2 text-secondary mb-3 font-medium"><TrendingUp className="w-4 h-4" /> Hidden Strengths</h4>
              <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                {result.hidden_strengths?.map((hs: string, i: number) => <li key={i}>{hs}</li>)}
              </ul>
            </div>
            <div className="bg-orange-500/5 rounded-lg border border-orange-500/20 p-4">
              <h4 className="flex items-center gap-2 text-orange-400 mb-2 font-medium"><AlertTriangle className="w-4 h-4" /> Claim Inconsistencies</h4>
              <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                {result.inconsistencies?.length > 0 ? 
                  result.inconsistencies.map((inc: string, i: number) => <li key={i}>{inc}</li>) : 
                  <li className="text-gray-500 list-none">No inconsistencies detected.</li>}
              </ul>
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="glass-card p-6 flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4 w-full text-left">Skill Alignment</h3>
          {radarData.length > 0 ? (
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                  <Radar name="Candidate" dataKey="Candidate" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                  <Radar name="Required" dataKey="Required" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">Not enough data for chart</div>
          )}
        </div>
      </div>

      {/* Skills Analysis Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold flex items-center gap-2"><Info className="w-5 h-5 text-primary" /> Detailed Competency Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Skill</th>
                <th className="p-4 font-medium text-center">Required</th>
                <th className="p-4 font-medium text-center">Candidate</th>
                <th className="p-4 font-medium">Risk Level</th>
                <th className="p-4 font-medium min-w-[300px]">AI Reasoning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {result.skills_analysis?.map((skill: any, idx: number) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium text-white">{skill.skill}</td>
                  <td className="p-4 text-center">
                    <span className="inline-block w-6 h-6 rounded bg-surfaceHighlight border border-white/10 text-gray-300 leading-6">{skill.required_level}</span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-block w-6 h-6 rounded bg-primary/20 border border-primary/30 text-primary leading-6">{skill.candidate_level}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs border ${getRiskColor(skill.risk)}`}>
                      {skill.risk}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-400">{skill.reasoning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><HelpCircle className="w-5 h-5 text-secondary" /> Recommended Interview Questions</h3>
          <div className="space-y-4">
            {result.interview_questions?.map((q: any, i: number) => (
              <div key={i} className="bg-black/40 border border-white/5 rounded-lg p-4">
                <span className="text-xs uppercase tracking-wider text-secondary font-semibold mb-1 block">{q.type}</span>
                <p className="text-gray-200 text-sm leading-relaxed">{q.question}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><MapIcon className="w-5 h-5 text-primary" /> Learning Path & What-If</h3>
          
          <div className="mb-6 space-y-3">
            {result.learning_path?.map((path: any, i: number) => (
              <div key={i} className="flex gap-4 items-start bg-primary/5 border border-primary/20 rounded-lg p-3">
                <div className="w-12 h-12 rounded bg-black/50 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-[10px] text-gray-400 uppercase">PRIORITY</span>
                  <span className={`text-xs font-bold ${path.priority === 'High' ? 'text-red-400' : 'text-primary'}`}>{path.priority}</span>
                </div>
                <div>
                  <h4 className="font-medium text-white text-sm">{path.skill} <span className="text-gray-500 font-normal">({path.timeline})</span></h4>
                  <p className="text-xs text-gray-400 mt-1">Recommended: {path.resources?.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-surfaceHighlight to-black rounded-lg p-5 border border-white/10 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
            <h4 className="font-display font-semibold mb-2 flex items-center gap-2">
              What-If Simulation 
              <span className="px-2.5 py-0.5 rounded-full bg-accent/20 text-accent text-xs">Score: {result.what_if_analysis?.improved_score}</span>
            </h4>
            <p className="text-sm text-gray-300 mb-2">{result.what_if_analysis?.risk_reduction}</p>
            <p className="text-xs text-gray-500 italic">Assumption: {result.what_if_analysis?.assumptions}</p>
          </div>
        </div>
      </div>

      {/* Final Recommendation */}
      <div className="glass-card p-8 flex flex-col items-center text-center relative overflow-hidden mt-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10"></div>
        <div className="relative z-10">
          <h2 className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-2">Final System Recommendation</h2>
          <div className="text-4xl font-display font-bold text-white mb-4 text-glow">
            {result.final_recommendation}
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            {result.explanation}
          </p>
        </div>
      </div>

    </div>
  );
}

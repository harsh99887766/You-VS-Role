import { useState } from 'react';
import { Settings, ShieldAlert, Zap } from 'lucide-react';
import UploadForm from './components/UploadForm';
import ResultsDashboard from './components/ResultsDashboard';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  return (
    <div className="min-h-screen bg-background text-gray-100 flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[150px] -z-10 pointer-events-none"></div>

      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <Zap className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold font-display tracking-tight">AI Hiring Intelligence</h1>
        </div>
        <button 
          onClick={() => setShowSettings(true)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-8">
        {!analysisResult ? (
          <UploadForm apiKey={apiKey} onResult={setAnalysisResult} />
        ) : (
          <ResultsDashboard result={analysisResult} onReset={() => setAnalysisResult(null)} />
        )}
      </main>

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6 relative">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ShieldAlert className="text-primary w-5 h-5" /> Provider Settings
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Enter your Gemini API key to enable live analysis. If left empty, demo mock data will be used.
            </p>
            <input 
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all mb-6"
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-blue-600 transition-colors font-medium text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

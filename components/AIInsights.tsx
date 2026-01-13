
import React, { useState } from 'react';
import { ERPData } from '../types';
import { getDailyBriefing } from '../services/geminiService';

interface AIInsightsProps {
  data: ERPData;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ data }) => {
  const [briefing, setBriefing] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateReport = async () => {
    setIsLoading(true);
    const result = await getDailyBriefing(data);
    setBriefing(result);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-slate-900 rounded-[40px] p-12 text-white overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 p-20 opacity-10 blur-3xl bg-emerald-500 rounded-full" />
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center text-4xl shadow-2xl shadow-emerald-500/20">📈</div>
          <div>
            <h2 className="text-4xl font-black tracking-tight">Executive Intelligence Hub</h2>
            <p className="text-slate-400 mt-2 text-lg">Hyper-speed business analysis powered by Nexus AI Engine</p>
          </div>
          <button 
            onClick={generateReport}
            disabled={isLoading}
            className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-lg hover:bg-emerald-50 transition-all flex items-center shadow-xl shadow-white/5 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                Processing Big Data...
              </span>
            ) : (
              '📊 Generate Daily Executive Briefing'
            )}
          </button>
        </div>
      </div>

      {briefing && (
        <div className="bg-white rounded-[40px] border border-slate-100 p-12 shadow-xl animate-fade-in">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-1.5 h-10 bg-emerald-500 rounded-full" />
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Analysis Complete</h3>
          </div>
          <div className="prose prose-slate max-w-none">
            <div className="whitespace-pre-wrap text-xl text-slate-600 leading-relaxed font-medium">
              {briefing}
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-50 flex justify-between items-center text-slate-400 text-sm italic">
            <span>Verified by Gemini-3 Flash Preview</span>
            <span>Generated: {new Date().toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

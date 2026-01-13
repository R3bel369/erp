
import React, { useState } from 'react';

interface AuthProps {
  onLogin: (email: string, password: string) => void;
  error?: string | null;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, error: externalError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  if (showForgot) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl p-10 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-900">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h2 className="text-2xl font-bold">Password Reset</h2>
          <p className="text-slate-500">For security reasons, please contact your System Administrator to reset your Nexus ERP credentials.</p>
          <button 
            onClick={() => setShowForgot(false)}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 bg-[url('https://picsum.photos/1920/1080?grayscale')] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>
      
      <div className="relative w-full max-w-md bg-white rounded-3xl p-10 shadow-2xl space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 font-bold text-white text-2xl shadow-lg shadow-emerald-500/20">N</div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Nexus Pro Login</h1>
          <p className="text-slate-500">Predefined: admin@erp.com / staff@erp.com</p>
        </div>

        {externalError && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium animate-shake">
            {externalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
              placeholder="admin@erp.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
            <input 
              required
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-500" />
              <span className="text-sm text-slate-500">Keep me signed in</span>
            </label>
            <button 
              type="button"
              onClick={() => setShowForgot(true)}
              className="text-sm font-bold text-emerald-600 hover:text-emerald-700"
            >
              Forgot Password?
            </button>
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
          >
            Authenticate Session
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">Enterprise Security Standard 2026</p>
        </div>
      </div>
    </div>
  );
};

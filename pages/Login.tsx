import React from 'react';
import { Icons } from '../components/Icons';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800" />
        <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        
        <div className="relative z-10 w-full max-w-sm text-center">
            <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/30 transform rotate-3">
                <Icons.Activity size={40} className="text-white" />
            </div>
            
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">GainEngine</h1>
            <p className="text-slate-400 mb-12 text-lg">Automated progressive overload.</p>
            
            <div className="space-y-4">
                <button 
                    onClick={onLogin}
                    className="w-full bg-white text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-100 transition-colors shadow-lg shadow-white/10"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.64 3.98-1.54 2.35.16 3.7.69 4.86 3.03-3.08 1.87-2.6 6.55.98 8.05-.72 2.1-1.74 4.14-3.1 5.31l-.22.28zm-3.13-16.1c1.34 0 2.44-1.09 2.44-2.44 0-.17-.02-.34-.05-.5-1.57.17-2.65 1.56-2.39 2.94z"/>
                    </svg>
                    Continue with Apple
                </button>
                
                <button 
                    onClick={onLogin}
                    className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 border border-slate-700 hover:bg-slate-700 transition-colors"
                >
                    <Icons.User size={20} />
                    Continue as Guest
                </button>
            </div>
            
            <p className="text-xs text-slate-500 mt-8">
                By continuing you agree to lift heavy weights.
            </p>
        </div>
    </div>
  );
};
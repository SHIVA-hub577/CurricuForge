
import React, { useState } from 'react';
import { UserRole } from '../types';

interface AuthProps {
  mode: 'login' | 'signup';
  onAuthSuccess: (email: string, role: UserRole) => void;
  onToggleMode: () => void;
}

const Auth: React.FC<AuthProps> = ({ mode, onAuthSuccess, onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onAuthSuccess(email, role);
    }, 800);
  };

  const isTeacher = role === 'teacher';
  const themeClasses = isTeacher 
    ? "from-indigo-500 to-purple-600" 
    : "from-emerald-500 to-cyan-500";

  const accentColor = isTeacher ? "text-purple-600 dark:text-purple-400" : "text-emerald-600 dark:text-emerald-400";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 transition-colors">
      <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl dark:shadow-none relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${themeClasses}`} />
        
        <div className="text-center mb-10">
          <div className={`w-20 h-20 bg-slate-50 dark:bg-slate-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-200 dark:border-slate-700 shadow-inner`}>
            <svg className={`w-10 h-10 ${accentColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
            {mode === 'login' ? 'Forging Hub' : 'Join the Forge'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Select your identity to continue
          </p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-900/80 p-2 rounded-2xl mb-10 border border-slate-200 dark:border-slate-700 shadow-inner">
          <button 
            type="button"
            onClick={() => setRole('student')}
            className={`flex-1 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${role === 'student' ? 'bg-white dark:bg-emerald-500 text-emerald-600 dark:text-slate-900 shadow-md scale-[1.02]' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Student
          </button>
          <button 
            type="button"
            onClick={() => setRole('teacher')}
            className={`flex-1 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${role === 'teacher' ? 'bg-white dark:bg-purple-500 text-purple-600 dark:text-white shadow-md scale-[1.02]' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Teacher
          </button>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-rose-500 text-sm font-bold mb-8 flex items-center gap-3 animate-in slide-in-from-top-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Email Address</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. smith@forge.ai"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-4 focus:ring-4 focus:ring-slate-500/5 focus:border-slate-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Security Key</label>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-4 focus:ring-4 focus:ring-slate-500/5 focus:border-slate-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-white"
            />
          </div>

          {mode === 'signup' && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Repeat Security Key</label>
              <input 
                required
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-4 focus:ring-4 focus:ring-slate-500/5 focus:border-slate-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-white"
              />
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full group relative overflow-hidden bg-slate-900 dark:bg-emerald-500 hover:dark:bg-emerald-400 text-white dark:text-slate-900 font-black py-6 rounded-2xl transition-all active:scale-[0.98] text-xl flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/10`}
          >
            {isLoading ? (
              <svg className="animate-spin h-7 w-7 text-current" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                {mode === 'login' ? `Login as ${role.charAt(0).toUpperCase() + role.slice(1)}` : 'Initiate Account'}
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-700 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            {mode === 'login' ? "New to the Forge?" : "Already forged an account?"}{' '}
            <button 
              type="button"
              className={`${accentColor} font-black hover:underline transition-colors uppercase text-[10px] tracking-widest ml-1`}
              onClick={onToggleMode}
            >
              {mode === 'login' ? 'Sign up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;

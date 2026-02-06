
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
    ? "from-indigo-500 to-purple-600 shadow-purple-500/10" 
    : "from-emerald-500 to-cyan-500 shadow-emerald-500/10";

  const accentColor = isTeacher ? "text-purple-400" : "text-emerald-400";
  const borderColor = isTeacher ? "border-purple-500/30" : "border-emerald-500/30";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="bg-slate-800/50 border border-slate-700 w-full max-w-md rounded-3xl p-10 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${themeClasses}`} />
        
        <div className="text-center mb-8">
          <div className={`w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border ${borderColor}`}>
            <svg className={`w-8 h-8 ${accentColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-white mb-2">
            {mode === 'login' ? 'Portal Access' : 'Create Account'}
          </h2>
          <p className="text-slate-400">
            Choose your role to begin forging
          </p>
        </div>

        <div className="flex bg-slate-900/80 p-1.5 rounded-2xl mb-8 border border-slate-700">
          <button 
            onClick={() => setRole('student')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${role === 'student' ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Student
          </button>
          <button 
            onClick={() => setRole('teacher')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${role === 'teacher' ? 'bg-purple-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Teacher
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-400 text-sm mb-6 flex items-center gap-3 animate-in slide-in-from-top-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider px-1">Email Address</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-slate-500/50 focus:border-slate-500 outline-none transition-all placeholder:text-slate-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider px-1">Password</label>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-slate-500/50 focus:border-slate-500 outline-none transition-all placeholder:text-slate-600 text-white"
            />
          </div>

          {mode === 'signup' && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-wider px-1">Confirm Password</label>
              <input 
                required
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-slate-500/50 focus:border-slate-500 outline-none transition-all placeholder:text-slate-600 text-white"
              />
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r ${themeClasses} text-white font-black py-4 rounded-xl transition-all active:scale-[0.98] text-lg flex items-center justify-center gap-2`}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              mode === 'login' ? `Login as ${role.charAt(0).toUpperCase() + role.slice(1)}` : 'Create Account'
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-700/50 text-center">
          <p className="text-slate-400 text-sm">
            {mode === 'login' ? "Need an account?" : "Already have an account?"}{' '}
            <button 
              className={`${accentColor} font-bold hover:underline transition-colors`}
              onClick={onToggleMode}
            >
              {mode === 'login' ? 'Sign up here' : 'Login instead'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;

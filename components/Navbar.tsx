
import React, { useState } from 'react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLogout: () => void;
  onNavigate: (page: 'home' | 'about' | 'login' | 'signup' | 'history') => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, theme, onToggleTheme, onLogout, onNavigate }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between transition-colors">
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => onNavigate('home')}
      >
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <svg className="w-5 h-5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <span className="text-xl font-bold text-slate-900 dark:text-white">
          CurricuForge
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => onNavigate('home')}
            className="text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-white transition-colors text-sm font-semibold"
          >
            Generator
          </button>
          {user && (
            <button 
              onClick={() => onNavigate('history')}
              className="text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-white transition-colors text-sm font-semibold"
            >
              History
            </button>
          )}
          <button 
            onClick={() => onNavigate('about')}
            className="text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-white transition-colors text-sm font-semibold"
          >
            About
          </button>
        </div>

        <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 hidden md:block" />

        <button 
          onClick={onToggleTheme}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-white transition-all border border-slate-200 dark:border-slate-700"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
        
        {user ? (
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-full transition-colors border border-slate-200 dark:border-slate-700"
            >
              <div className={`w-6 h-6 ${user.role === 'teacher' ? 'bg-purple-500' : 'bg-emerald-500'} rounded-full flex items-center justify-center text-[10px] uppercase font-black text-white dark:text-slate-900 shadow-sm`}>
                {user.email[0]}
              </div>
              <div className="text-left leading-none hidden sm:block">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[100px]">{user.email}</p>
                <p className="text-[8px] uppercase tracking-tighter text-slate-500">{user.role}</p>
              </div>
              <svg className={`w-4 h-4 text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
                   <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{user.role} Portal</p>
                </div>
                <button 
                  onClick={() => {
                    onLogout();
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                >
                  Logout Session
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('login')}
              className="text-sm font-bold text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              Login
            </button>
            <button 
              onClick={() => onNavigate('signup')}
              className="bg-slate-900 dark:bg-emerald-500 hover:opacity-90 text-white dark:text-slate-950 text-sm font-black px-5 py-2.5 rounded-xl transition-all shadow-lg"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

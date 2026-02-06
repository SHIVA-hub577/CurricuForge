
import React, { useState } from 'react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (page: 'home' | 'about' | 'login' | 'signup' | 'history') => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigate }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => onNavigate('home')}
      >
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <svg className="w-5 h-5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          CurricuForge
        </span>
      </div>

      <div className="flex items-center gap-8">
        <button 
          onClick={() => onNavigate('home')}
          className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
        >
          Generator
        </button>
        {user && (
          <button 
            onClick={() => onNavigate('history')}
            className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
          >
            History
          </button>
        )}
        <button 
          onClick={() => onNavigate('about')}
          className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
        >
          About
        </button>
        
        {user ? (
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full transition-colors border border-slate-700"
            >
              <div className={`w-6 h-6 ${user.role === 'teacher' ? 'bg-purple-500' : 'bg-emerald-500'} rounded-full flex items-center justify-center text-[10px] uppercase font-black text-slate-900`}>
                {user.email[0]}
              </div>
              <div className="text-left leading-none">
                <p className="text-xs font-bold text-white truncate max-w-[120px]">{user.email}</p>
                <p className="text-[8px] uppercase tracking-tighter text-slate-500">{user.role}</p>
              </div>
              <svg className={`w-4 h-4 text-slate-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-1 overflow-hidden">
                <div className="px-4 py-2 border-b border-slate-700">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{user.role} Portal</p>
                </div>
                <button 
                  onClick={() => {
                    onLogout();
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('login')}
              className="text-sm font-medium text-slate-300 hover:text-white"
            >
              Login
            </button>
            <button 
              onClick={() => onNavigate('signup')}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 text-sm font-bold px-4 py-2 rounded-lg transition-all"
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

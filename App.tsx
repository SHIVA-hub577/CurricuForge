
import React, { useState, useEffect } from 'react';
import { DurationType, Curriculum, User, UserRole } from './types';
import { generateCurriculum } from './services/geminiService';
import { exportAllCurriculaToPDF } from './services/pdfService';
import Navbar from './components/Navbar';
import About from './components/About';
import Auth from './components/Auth';
import CurriculumDisplay from './components/CurriculumDisplay';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'login' | 'signup' | 'history'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('curricuforge_theme') as 'light' | 'dark') || 'dark';
  });
  const [title, setTitle] = useState('');
  const [durationValue, setDurationValue] = useState(4);
  const [durationType, setDurationType] = useState<DurationType>(DurationType.WEEKS);
  const [audience, setAudience] = useState('Beginners looking to learn industry basics');
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [history, setHistory] = useState<Curriculum[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('curricuforge_theme', theme);
  }, [theme]);

  useEffect(() => {
    const savedUser = localStorage.getItem('curricuforge_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentPage('home');
    }
    const savedHistory = localStorage.getItem('curricuforge_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    if (history.length > 0) localStorage.setItem('curricuforge_history', JSON.stringify(history));
  }, [history]);

  const handleLogout = () => {
    localStorage.removeItem('curricuforge_user');
    setUser(null);
    setCurriculum(null);
    setCurrentPage('login');
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleAuthSuccess = (email: string, role: UserRole) => {
    const newUser: User = { email, role, isAuthenticated: true };
    setUser(newUser);
    localStorage.setItem('curricuforge_user', JSON.stringify(newUser));
    setCurrentPage('home');
  };

  const handleToggleAuthMode = () => setCurrentPage(currentPage === 'login' ? 'signup' : 'login');

  const handleUpdateCurriculum = (updated: Curriculum) => {
    setCurriculum(updated);
    setHistory(prev => prev.map(item => item.id === updated.id ? updated : item));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsGenerating(true);
    setError(null);
    setCurriculum(null);
    try {
      const result = await generateCurriculum(title, durationType, durationValue, audience);
      const curriculumWithMetadata: Curriculum = {
        ...result,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now()
      };
      setCurriculum(curriculumWithMetadata);
      setHistory(prev => [curriculumWithMetadata, ...prev]);
    } catch (err) {
      setError('The forge ran too hot! Please try again later.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 selection:bg-emerald-500/30">
      <Navbar 
        user={user} 
        theme={theme}
        onToggleTheme={toggleTheme}
        onLogout={handleLogout} 
        onNavigate={setCurrentPage} 
      />
      
      <main className={user ? "pb-24 pt-8" : "pt-8"}>
        {!user ? (
          <Auth mode={currentPage === 'signup' ? 'signup' : 'login'} onAuthSuccess={handleAuthSuccess} onToggleMode={handleToggleAuthMode} />
        ) : (
          currentPage === 'about' ? <About /> :
          currentPage === 'history' ? (
            <div className="max-w-6xl mx-auto py-12 px-6 space-y-8 animate-in fade-in duration-500">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 dark:text-white">Forging <span className="text-emerald-500">Archive</span></h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-2">Your collection of industry-aligned learning pathways.</p>
                </div>
                <button 
                  onClick={() => exportAllCurriculaToPDF(history)} 
                  className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all font-bold"
                >
                  Export All PDF
                </button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.length === 0 ? (
                  <div className="col-span-full py-20 text-center bg-slate-100 dark:bg-slate-800/40 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <p className="text-slate-400">No curricula forged yet.</p>
                  </div>
                ) : (
                  history.map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => { setCurriculum(item); setCurrentPage('home'); }} 
                      className="group bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-6 rounded-3xl cursor-pointer hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded tracking-widest border border-emerald-500/20">
                          {item.durationValue} {item.durationType}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-500 transition-colors line-clamp-1">{item.title}</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed">{item.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto py-12 px-6">
              <div className="text-center mb-16 space-y-4">
                <h1 className="text-6xl font-black text-slate-900 dark:text-white tracking-tight">
                  Forge Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-400">Path</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-xl font-medium">
                  {user.role === 'teacher' ? 'Faculty Innovation Hub' : 'AI-Powered Education Engineering'}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800/50 p-8 md:p-12 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-2xl dark:shadow-none mb-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Program Title</label>
                      <input 
                        required 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        placeholder="e.g. Prompt Engineering & LLM Architecture" 
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-5 text-slate-900 dark:text-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Scale</label>
                        <select 
                          value={durationType} 
                          onChange={(e) => setDurationType(e.target.value as DurationType)} 
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-5 text-slate-900 dark:text-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all cursor-pointer"
                        >
                          {Object.values(DurationType).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Value</label>
                        <input 
                          type="number" 
                          min="1" 
                          value={durationValue} 
                          onChange={(e) => setDurationValue(Number(e.target.value))} 
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-5 text-slate-900 dark:text-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all" 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Audience Archetype</label>
                    <textarea 
                      rows={3} 
                      value={audience} 
                      onChange={(e) => setAudience(e.target.value)} 
                      placeholder="e.g. Beginners looking to learn industry basics and career readiness..." 
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-5 text-slate-900 dark:text-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400" 
                    />
                  </div>
                  
                  {error && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-6 py-4 rounded-2xl text-sm font-bold animate-pulse">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-center pt-4">
                    <button 
                      type="submit" 
                      disabled={isGenerating} 
                      className="group relative bg-slate-900 dark:bg-emerald-500 hover:scale-[1.02] active:scale-[0.98] text-white dark:text-slate-900 font-black px-12 py-5 rounded-2xl text-lg transition-all shadow-xl shadow-emerald-500/10 disabled:opacity-50 disabled:hover:scale-100 overflow-hidden"
                    >
                      <div className="relative z-10 flex items-center gap-3">
                        {isGenerating ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-current" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Forging...
                          </>
                        ) : (
                          <>
                            Generate Curriculum
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </form>
              </div>
              
              {curriculum && (
                <CurriculumDisplay 
                  curriculum={curriculum} 
                  userRole={user.role} 
                  onUpdateCurriculum={handleUpdateCurriculum} 
                />
              )}
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default App;

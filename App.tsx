
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
  const [title, setTitle] = useState('');
  const [durationValue, setDurationValue] = useState(4);
  const [durationType, setDurationType] = useState<DurationType>(DurationType.WEEKS);
  const [audience, setAudience] = useState('Beginners looking to learn industry basics');
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [history, setHistory] = useState<Curriculum[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="min-h-screen selection:bg-emerald-500/30">
      {user && <Navbar user={user} onLogout={handleLogout} onNavigate={setCurrentPage} />}
      <main className={user ? "pb-24" : ""}>
        {!user ? (
          <Auth mode={currentPage === 'signup' ? 'signup' : 'login'} onAuthSuccess={handleAuthSuccess} onToggleMode={handleToggleAuthMode} />
        ) : (
          currentPage === 'about' ? <About /> :
          currentPage === 'history' ? (
            <div className="max-w-6xl mx-auto py-12 px-6 space-y-8 animate-in fade-in">
              <div className="flex justify-between items-center">
                <h1 className="text-4xl font-black text-white">Forging <span className="text-emerald-400">Archive</span></h1>
                <button onClick={() => exportAllCurriculaToPDF(history)} className="bg-slate-800 text-white px-6 py-3 rounded-2xl border border-slate-700">Export All PDF</button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {history.map(item => (
                  <div key={item.id} onClick={() => { setCurriculum(item); setCurrentPage('home'); }} className="bg-slate-800/40 border border-slate-700 p-6 rounded-3xl cursor-pointer">
                    <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-slate-400 text-sm line-clamp-2">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto py-12 px-6">
              <div className="text-center mb-16 space-y-4">
                <h1 className="text-6xl font-black text-white">Forge Your <span className="text-emerald-400">Path</span></h1>
                <p className="text-slate-400 text-xl">{user.role === 'teacher' ? 'Faculty Innovation Hub' : 'AI-Powered Education'}</p>
              </div>
              <div className="bg-slate-800/40 p-8 md:p-12 rounded-[2.5rem] border border-slate-700/50 shadow-2xl mb-16">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Program Title</label>
                      <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Prompt Engineering" className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-5 text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <select value={durationType} onChange={(e) => setDurationType(e.target.value as DurationType)} className="bg-slate-900 border border-slate-700 rounded-2xl px-4 py-5 text-white">
                        {Object.values(DurationType).map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <input type="number" min="1" value={durationValue} onChange={(e) => setDurationValue(Number(e.target.value))} className="bg-slate-900 border border-slate-700 rounded-2xl px-6 py-5 text-white" />
                    </div>
                  </div>
                  <textarea rows={4} value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Target audience..." className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-5 text-white" />
                  <div className="flex justify-center"><button type="submit" disabled={isGenerating} className="bg-emerald-500 text-slate-900 font-black px-16 py-6 rounded-2xl text-xl">{isGenerating ? 'Forging...' : 'Generate Curriculum'}</button></div>
                </form>
              </div>
              {curriculum && <CurriculumDisplay curriculum={curriculum} userRole={user.role} onUpdateCurriculum={handleUpdateCurriculum} />}
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default App;

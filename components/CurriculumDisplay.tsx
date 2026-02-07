
import React, { useState, useMemo } from 'react';
import { Curriculum, Topic, Quiz, UserRole, Resource, DifficultyLevel } from '../types';
import { generateQuizForTopic } from '../services/geminiService';
import { exportToPDF } from '../services/pdfService';
import QuizModal from './QuizModal';

interface CurriculumDisplayProps {
  curriculum: Curriculum;
  userRole: UserRole;
  onUpdateCurriculum: (updated: Curriculum) => void;
}

const CurriculumDisplay: React.FC<CurriculumDisplayProps> = ({ curriculum, userRole, onUpdateCurriculum }) => {
  const [activePeriod, setActivePeriod] = useState<number>(0);
  const [activeCourse, setActiveCourse] = useState<string | null>(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);

  const stats = useMemo(() => {
    let total = 0;
    let completed = 0;
    curriculum.periods.forEach(p => p.courses.forEach(c => c.topics.forEach(t => {
      total++;
      if (t.isCompleted) completed++;
    })));
    return { total, completed, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [curriculum]);

  const toggleTopicCompletion = (periodIdx: number, courseIdx: number, topicIdx: number) => {
    const updatedCurriculum = {
      ...curriculum,
      periods: curriculum.periods.map((period, pIdx) => {
        if (pIdx !== periodIdx) return period;
        return {
          ...period,
          courses: period.courses.map((course, cIdx) => {
            if (cIdx !== courseIdx) return course;
            return {
              ...course,
              topics: course.topics.map((topic, tIdx) => {
                if (tIdx !== topicIdx) return topic;
                return { ...topic, isCompleted: !topic.isCompleted };
              })
            };
          })
        };
      })
    };
    onUpdateCurriculum(updatedCurriculum);
  };

  const resetProgress = () => {
    if (!window.confirm("Forge Alert: Reset all progress tracking for this curriculum?")) return;
    
    const updatedCurriculum = {
      ...curriculum,
      periods: curriculum.periods.map(period => ({
        ...period,
        courses: period.courses.map(course => ({
          ...course,
          topics: course.topics.map(topic => ({ ...topic, isCompleted: false }))
        }))
      }))
    };
    onUpdateCurriculum(updatedCurriculum);
  };

  const handleStartQuiz = async (periodIdx: number, courseIdx: number, topicIdx: number) => {
    const topic = curriculum.periods[periodIdx].courses[courseIdx].topics[topicIdx];
    
    if (topic.quiz) {
      setCurrentQuiz(topic.quiz);
      return;
    }

    setIsGeneratingQuiz(true);
    try {
      const quiz = await generateQuizForTopic(topic.title);
      const updatedCurriculum = {
        ...curriculum,
        periods: curriculum.periods.map((p, pi) => pi !== periodIdx ? p : {
          ...p,
          courses: p.courses.map((c, ci) => ci !== courseIdx ? c : {
            ...c,
            topics: c.topics.map((t, ti) => ti !== topicIdx ? t : { ...t, quiz })
          })
        })
      };
      onUpdateCurriculum(updatedCurriculum);
      setCurrentQuiz(quiz);
    } catch (error) {
      console.error("Failed to generate quiz", error);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const getDifficultyColor = (level: DifficultyLevel) => {
    switch (level) {
      case 'Easy': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Hard': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'video':
        return (
          <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
          </svg>
        );
      case 'article':
        return (
          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2zM14 2v4h4" />
          </svg>
        );
      case 'blog':
        return (
          <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 5c7.18 0 13 5.82 13 13M6 11c3.87 0 7 3.13 7 7M6 15a3 3 0 110 6 3 3 0 010-6z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-8 md:p-10 shadow-xl dark:shadow-none overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 flex flex-col items-end gap-3 z-10">
          <div className="flex gap-2">
            <button 
              onClick={resetProgress}
              title="Reset all progress for this program"
              className="p-2.5 bg-white dark:bg-slate-700 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-2xl border border-slate-200 dark:border-slate-600 transition-all shadow-sm hover:scale-110 active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button 
              onClick={() => exportToPDF(curriculum)}
              className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white px-5 py-2.5 rounded-2xl transition-all text-sm font-bold border border-slate-200 dark:border-slate-600 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export PDF
            </button>
          </div>
        </div>

        <div className="max-w-3xl">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-[0.2em]">Active Pathway</span>
            <div className="flex items-center gap-3">
               <div className="w-32 h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden shadow-inner">
                 <div className="h-full bg-emerald-500 transition-all duration-1000 ease-out" style={{ width: `${stats.percent}%` }} />
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stats.percent}% Processed</span>
            </div>
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 leading-tight">{curriculum.title}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-2xl">{curriculum.description}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-[1.5rem] border border-slate-200 dark:border-slate-700 group transition-all hover:border-emerald-500/30">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Timeframe</p>
            <p className="text-xl font-black text-slate-900 dark:text-emerald-400">{curriculum.durationValue} {curriculum.durationType}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-[1.5rem] border border-slate-200 dark:border-slate-700 group transition-all hover:border-cyan-500/30">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Units</p>
            <p className="text-xl font-black text-slate-900 dark:text-cyan-400">{stats.total} Topics</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-[1.5rem] border border-slate-200 dark:border-slate-700 group transition-all hover:border-blue-500/30">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Method</p>
            <p className="text-xl font-black text-slate-900 dark:text-blue-400">OBE Aligned</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-[1.5rem] border border-slate-200 dark:border-slate-700 group transition-all hover:border-purple-500/30">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Expertise</p>
            <p className="text-xl font-black text-slate-900 dark:text-purple-400">{stats.percent === 100 ? 'Mastered' : 'Growing'}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-4">Milestones</h3>
          <div className="space-y-2">
            {curriculum.periods.map((period, idx) => {
              const pStats = period.courses.reduce((acc, c) => {
                c.topics.forEach(t => { acc.total++; if (t.isCompleted) acc.done++; });
                return acc;
              }, { total: 0, done: 0 });
              const isPComplete = pStats.total > 0 && pStats.total === pStats.done;

              return (
                <button
                  key={idx}
                  onClick={() => setActivePeriod(idx)}
                  className={`w-full text-left px-5 py-4 rounded-[1.25rem] transition-all flex items-center justify-between group ${
                    activePeriod === idx 
                      ? 'bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-900 font-black shadow-xl shadow-emerald-500/10' 
                      : 'text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full transition-colors ${isPComplete ? 'bg-emerald-400' : activePeriod === idx ? 'bg-white dark:bg-slate-900' : 'bg-slate-300 dark:bg-slate-700'}`} />
                    <span className="text-sm font-bold">{period.periodLabel}</span>
                  </div>
                  {isPComplete && (
                    <svg className={`w-4 h-4 ${activePeriod === idx ? 'text-white dark:text-slate-900' : 'text-emerald-500'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-9 space-y-6">
          {curriculum.periods[activePeriod].courses.map((course, cIdx) => (
            <div key={cIdx} className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-[2rem] overflow-hidden group hover:border-emerald-500/30 transition-all duration-300 shadow-sm hover:shadow-xl dark:shadow-none">
              <div 
                className="p-8 cursor-pointer flex items-center justify-between"
                onClick={() => setActiveCourse(activeCourse === course.courseCode ? null : course.courseCode)}
              >
                <div className="flex items-center gap-6">
                  <div className="hidden sm:flex w-14 h-14 bg-slate-100 dark:bg-slate-900 rounded-2xl items-center justify-center font-black text-slate-400 dark:text-slate-600 text-lg border border-slate-200 dark:border-slate-800">
                    {course.courseCode.slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-black bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-2 py-0.5 rounded tracking-widest uppercase">{course.courseCode}</span>
                      <h4 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">{course.courseName}</h4>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-1 max-w-xl">{course.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="hidden md:block text-right">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Mastery</p>
                    <p className="text-sm font-black text-slate-900 dark:text-slate-200">
                      {course.topics.filter(t => t.isCompleted).length} / {course.topics.length}
                    </p>
                  </div>
                  <div className={`p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-transform ${activeCourse === course.courseCode ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {activeCourse === course.courseCode && (
                <div className="px-8 pb-8 pt-2 border-t border-slate-100 dark:border-slate-700 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="space-y-6">
                    {course.topics.map((topic, tIdx) => (
                      <div key={tIdx} className={`bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[1.75rem] border transition-all duration-300 ${topic.isCompleted ? 'border-emerald-500/30 opacity-70 grayscale-[0.3]' : 'border-slate-200 dark:border-slate-700'} space-y-5 shadow-sm`}>
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                          <div className="flex gap-5 items-start">
                            <button 
                              onClick={() => toggleTopicCompletion(activePeriod, cIdx, tIdx)}
                              className={`mt-1 flex-shrink-0 w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
                                topic.isCompleted 
                                  ? 'bg-emerald-500 border-emerald-500 text-white dark:text-slate-900' 
                                  : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-transparent'
                              }`}
                              title={topic.isCompleted ? "Undo completion status" : "Mark as completed"}
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            </button>
                            <div>
                              <div className="flex flex-wrap items-center gap-3 mb-2">
                                 <h5 className={`text-lg font-black flex items-center gap-3 transition-colors ${topic.isCompleted ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-slate-100'}`}>
                                   {topic.title}
                                 </h5>
                                 <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-widest ${getDifficultyColor(topic.difficulty)}`}>
                                   {topic.difficulty}
                                 </span>
                              </div>
                              <p className={`text-base leading-relaxed transition-colors ${topic.isCompleted ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>{topic.description}</p>
                            </div>
                          </div>
                          
                          {userRole === 'teacher' && (
                            <button 
                              onClick={() => handleStartQuiz(activePeriod, cIdx, tIdx)}
                              disabled={isGeneratingQuiz}
                              className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-slate-700 hover:bg-emerald-500 dark:hover:bg-emerald-500 hover:text-white dark:hover:text-slate-900 disabled:opacity-50 text-white dark:text-slate-300 font-black px-6 py-3 rounded-xl transition-all text-xs border border-slate-800 dark:border-slate-600 whitespace-nowrap h-fit self-start md:self-center shadow-lg shadow-emerald-500/5"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                              </svg>
                              {isGeneratingQuiz ? 'Forging...' : topic.quiz ? 'View Key' : '👁️ Generate Quiz'}
                            </button>
                          )}
                        </div>

                        {topic.resources && topic.resources.length > 0 && !topic.isCompleted && (
                          <div className="pt-5 border-t border-slate-200 dark:border-slate-700/50 animate-in fade-in slide-in-from-top-2 duration-300">
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Recommended Learning</p>
                            <div className="grid sm:grid-cols-2 gap-3">
                              {topic.resources.map((res, rIdx) => (
                                <a 
                                  key={rIdx}
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-4 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 transition-all group/res hover:scale-[1.01] hover:shadow-lg dark:hover:shadow-none"
                                >
                                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl group-hover/res:scale-110 transition-transform shadow-sm">
                                    {getResourceIcon(res.type)}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate pr-4">{res.title}</p>
                                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">{res.type}</p>
                                  </div>
                                  <svg className="w-4 h-4 ml-auto text-slate-300 group-hover/res:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-white dark:bg-slate-800/50 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm">
              <h5 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                OBE Goals
              </h5>
              <ul className="space-y-4">
                {curriculum.obe_outcomes.map((o, idx) => (
                  <li key={idx} className="text-base text-slate-500 dark:text-slate-400 flex gap-4">
                    <span className="w-5 h-5 flex-shrink-0 bg-emerald-500/10 text-emerald-500 rounded-md flex items-center justify-center text-[10px] font-black mt-0.5">✓</span>
                    {o}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white dark:bg-slate-800/50 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm">
              <h5 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500/10 text-cyan-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                Job Market
              </h5>
              <div className="flex flex-wrap gap-2 mb-8">
                {curriculum.job_roles.map((role, idx) => (
                  <span key={idx} className="text-xs font-black bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-4 py-2 rounded-full border border-cyan-500/20 uppercase tracking-widest">
                    {role}
                  </span>
                ))}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Final Assessments</p>
                <div className="space-y-3">
                  {curriculum.capstone_projects.map((p, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed group hover:border-cyan-500/30 transition-colors">
                      <span className="text-cyan-500 mr-2 text-lg">✦</span>
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {currentQuiz && (
        <QuizModal 
          quiz={currentQuiz} 
          userRole={userRole}
          onClose={() => setCurrentQuiz(null)} 
        />
      )}
    </div>
  );
};

export default CurriculumDisplay;

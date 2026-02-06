
import React, { useState } from 'react';
import { Curriculum, Topic, Quiz, UserRole } from '../types';
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

  const handleStartQuiz = async (periodIdx: number, courseIdx: number, topicIdx: number) => {
    const topic = curriculum.periods[periodIdx].courses[courseIdx].topics[topicIdx];
    
    // If quiz already exists in the curriculum data, use it
    if (topic.quiz) {
      setCurrentQuiz(topic.quiz);
      return;
    }

    setIsGeneratingQuiz(true);
    try {
      const quiz = await generateQuizForTopic(topic.title);
      
      // Update curriculum object with the new quiz
      const updatedCurriculum = { ...curriculum };
      updatedCurriculum.periods[periodIdx].courses[courseIdx].topics[topicIdx].quiz = quiz;
      
      onUpdateCurriculum(updatedCurriculum);
      setCurrentQuiz(quiz);
    } catch (error) {
      console.error("Failed to generate quiz", error);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-slate-800/40 border border-slate-700 rounded-3xl p-8 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 flex gap-3">
          <button 
            onClick={() => exportToPDF(curriculum)}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl transition-all text-sm font-semibold border border-slate-600 shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export PDF
          </button>
        </div>

        <div className="max-w-3xl">
          <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">{curriculum.title}</h2>
          <p className="text-slate-400 text-lg leading-relaxed">{curriculum.description}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Duration</p>
            <p className="text-xl font-bold text-emerald-400">{curriculum.durationValue} {curriculum.durationType}</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Courses</p>
            <p className="text-xl font-bold text-cyan-400">{curriculum.periods.reduce((acc, p) => acc + p.courses.length, 0)} Total</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status</p>
            <p className="text-xl font-bold text-blue-400">Forged</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Methodology</p>
            <p className="text-xl font-bold text-purple-400">OBE Aligned</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-4">Timeline</h3>
          <div className="space-y-1">
            {curriculum.periods.map((period, idx) => (
              <button
                key={idx}
                onClick={() => setActivePeriod(idx)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between group ${
                  activePeriod === idx 
                    ? 'bg-emerald-500 text-slate-900 font-bold shadow-lg shadow-emerald-500/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{period.periodLabel}</span>
                {activePeriod === idx && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-6">
          {curriculum.periods[activePeriod].courses.map((course, cIdx) => (
            <div key={cIdx} className="bg-slate-800/40 border border-slate-700 rounded-2xl overflow-hidden group hover:border-emerald-500/30 transition-colors">
              <div 
                className="p-6 cursor-pointer flex items-center justify-between"
                onClick={() => setActiveCourse(activeCourse === course.courseCode ? null : course.courseCode)}
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-bold bg-slate-700 text-slate-300 px-2 py-1 rounded">{course.courseCode}</span>
                    <h4 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{course.courseName}</h4>
                  </div>
                  <p className="text-slate-400 text-sm line-clamp-1">{course.description}</p>
                </div>
                <svg className={`w-6 h-6 text-slate-500 transition-transform ${activeCourse === course.courseCode ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {activeCourse === course.courseCode && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-700 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-4">
                    {course.topics.map((topic, tIdx) => (
                      <div key={tIdx} className="bg-slate-900/50 p-5 rounded-xl border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 group/topic">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                             <h5 className="font-bold text-slate-100 flex items-center gap-2">
                               <span className="w-6 h-6 bg-slate-800 text-emerald-400 rounded flex items-center justify-center text-[10px]">{tIdx + 1}</span>
                               {topic.title}
                             </h5>
                             {topic.quiz && <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30 font-black uppercase">Quiz Cached</span>}
                          </div>
                          <p className="text-slate-400 text-sm">{topic.description}</p>
                        </div>
                        <button 
                          onClick={() => handleStartQuiz(activePeriod, cIdx, tIdx)}
                          disabled={isGeneratingQuiz}
                          className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-emerald-500 hover:text-slate-900 disabled:opacity-50 text-slate-300 font-bold px-4 py-2 rounded-lg transition-all text-xs border border-slate-700 whitespace-nowrap"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                          {isGeneratingQuiz ? 'Building...' : topic.quiz ? 'View Assessment' : userRole === 'teacher' ? '👁️ Generate Quiz' : '📝 Take Quiz'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* OBE & Readiness Footer */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700">
              <h5 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                OBE Outcomes
              </h5>
              <ul className="space-y-3">
                {curriculum.obe_outcomes.map((o, idx) => (
                  <li key={idx} className="text-sm text-slate-400 flex gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    {o}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700">
              <h5 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Career Readiness
              </h5>
              <div className="flex flex-wrap gap-2">
                {curriculum.job_roles.map((role, idx) => (
                  <span key={idx} className="text-xs font-semibold bg-cyan-500/10 text-cyan-400 px-3 py-1.5 rounded-full border border-cyan-500/20">
                    {role}
                  </span>
                ))}
              </div>
              <div className="mt-6">
                <p className="text-xs font-bold text-slate-500 uppercase mb-3">Capstone Projects</p>
                <div className="space-y-2">
                  {curriculum.capstone_projects.map((p, idx) => (
                    <div key={idx} className="bg-slate-900/40 p-3 rounded-lg border border-slate-700 text-xs text-slate-300">
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

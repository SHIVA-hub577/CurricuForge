
import React, { useState, useEffect } from 'react';
import { Quiz, UserRole } from '../types';

interface QuizModalProps {
  quiz: Quiz;
  userRole: UserRole;
  onClose: () => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ quiz, userRole, onClose }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const isTeacher = userRole === 'teacher';

  // For teachers, we automatically show results
  useEffect(() => {
    if (isTeacher) {
      setShowResults(true);
    }
  }, [isTeacher]);

  const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
    if (showResults && !isTeacher) return;
    setSelectedAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const calculateScore = () => {
    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) score++;
    });
    return score;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative bg-slate-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 shadow-2xl">
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-8 py-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              {isTeacher ? 'Assessment Reference' : 'Topic Quiz'}
              {isTeacher && <span className="bg-purple-500/20 text-purple-400 text-[10px] uppercase font-black px-2 py-0.5 rounded-full border border-purple-500/30">Teacher Mode</span>}
            </h2>
            <p className="text-slate-400 text-sm mt-1">{quiz.topicTitle}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 space-y-12">
          {quiz.questions.map((q, qIdx) => (
            <div key={qIdx} className="space-y-4">
              <h3 className="text-lg font-medium text-slate-100">
                {qIdx + 1}. {q.question}
              </h3>
              <div className="grid gap-3">
                {q.options.map((opt, oIdx) => {
                  const isSelected = selectedAnswers[qIdx] === oIdx;
                  const isCorrect = oIdx === q.correctAnswer;
                  let buttonStyle = "p-4 rounded-xl border-2 text-left transition-all duration-200 relative ";

                  if (showResults) {
                    if (isCorrect) {
                      buttonStyle += "bg-emerald-500/20 border-emerald-500 text-emerald-400";
                    } else if (isSelected && !isCorrect) {
                      buttonStyle += "bg-red-500/20 border-red-500 text-red-400";
                    } else {
                      buttonStyle += "bg-slate-800 border-transparent text-slate-500";
                    }
                  } else {
                    buttonStyle += isSelected 
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" 
                      : "bg-slate-800 border-slate-700 hover:border-slate-600 text-slate-300";
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleOptionSelect(qIdx, oIdx)}
                      className={buttonStyle}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        {opt}
                      </div>
                      {isTeacher && isCorrect && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">Correct Answer</span>
                      )}
                    </button>
                  );
                })}
              </div>
              {showResults && (
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <p className="text-sm font-bold text-slate-300 mb-1">Pedagogical Explanation:</p>
                  <p className="text-sm text-slate-400">{q.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 bg-slate-900 border-t border-slate-800 p-8 flex items-center justify-between z-10">
          {!showResults ? (
            <>
              <p className="text-sm text-slate-400">
                {Object.keys(selectedAnswers).length} of {quiz.questions.length} answered
              </p>
              <button
                disabled={Object.keys(selectedAnswers).length < quiz.questions.length}
                onClick={() => setShowResults(true)}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-bold px-8 py-3 rounded-xl transition-all shadow-lg"
              >
                Submit Answers
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-4">
                {!isTeacher ? (
                  <>
                    <div className="text-center">
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Score</p>
                      <p className="text-3xl font-bold text-emerald-400">{calculateScore()} / {quiz.questions.length}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 flex items-center justify-center">
                      <span className="text-emerald-400 font-bold">{Math.round((calculateScore() / quiz.questions.length) * 100)}%</span>
                    </div>
                  </>
                ) : (
                  <div className="text-slate-400 text-sm">
                    Answer Key & Explanations provided for educational review.
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-8 py-3 rounded-xl transition-all"
              >
                Done
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;

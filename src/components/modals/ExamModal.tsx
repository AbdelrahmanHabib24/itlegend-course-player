'use strict';
'use client';

import React from 'react';
import { ChevronLeft, Clock, Trophy } from 'lucide-react';
import { ExamData } from '@/types/course';
import { useExamSession } from '@/hooks/useExamSession';

interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  examData?: ExamData;
  onExamComplete: (score: number, total: number) => void;
}

export const ExamModal: React.FC<ExamModalProps> = ({
  isOpen,
  onClose,
  examData,
  onExamComplete,
}) => {
  const {
    currentQuestionIndex,
    currentQuestion,
    totalQuestions,
    selectedAnswers,
    timeLeft,
    isSubmitted,
    score,
    selectOption,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    submitExam,
    formatTimer,
  } = useExamSession({
    isOpen,
    examData,
    onExamComplete,
  });

  if (!isOpen || !examData) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
    >
      <div className="relative w-full max-w-[420px] bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col animate-slide-up">
        {/* Blue Header matching Figma exactly (#3D5CFF) */}
        <div className="bg-exam text-white px-5 pt-5 pb-6">
          <div className="flex items-center justify-between mb-4">
            {/* Back button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Exam"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Yellow Timer Badge matching Figma */}
            <div className="bg-[#FFD028] text-slate-900 font-extrabold px-3 py-1 rounded-md text-xs tracking-wider shadow-xs flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-slate-800" />
              <span>{formatTimer(timeLeft)}</span>
            </div>
          </div>

          {/* Stepper Dots (1 2 3 4 5) */}
          <div className="flex items-center justify-center gap-2.5">
            {examData.questions.map((q, idx) => {
              const isActive = idx === currentQuestionIndex;
              const isAnswered = Boolean(selectedAnswers[q.id]);

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => goToQuestion(idx)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-exam shadow-sm scale-110'
                      : isAnswered
                      ? 'bg-white/40 text-white'
                      : 'bg-white/20 text-white/80 hover:bg-white/30'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between min-h-[360px]">
          {!isSubmitted ? (
            <>
              <div>
                {/* Question Number */}
                <span className="text-xs font-bold text-slate-400 block mb-1">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>

                {/* Question Text */}
                {currentQuestion ? (
                  <>
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 leading-snug mb-5">
                      {currentQuestion.question}
                    </h3>

                    {/* Options List A, B, C, D */}
                    <div className="space-y-2.5">
                      {currentQuestion.options.map((option) => {
                        const isSelected = selectedAnswers[currentQuestion.id] === option.id;

                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => selectOption(currentQuestion.id, option.id)}
                        className={`w-full p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-exam text-white border-exam shadow-sm font-semibold'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? 'bg-white text-exam border-white'
                              : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}
                        >
                          {option.id}
                        </span>
                        <span className="text-xs sm:text-sm">{option.text}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : null}
          </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={prevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
                >
                  Previous
                </button>

                {currentQuestionIndex === totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={submitExam}
                    className="px-5 py-2 rounded-lg text-xs font-bold bg-exam hover:bg-blue-700 text-white shadow-xs transition-all cursor-pointer"
                  >
                    Submit Exam
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={nextQuestion}
                    className="px-5 py-2 rounded-lg text-xs font-bold bg-exam hover:bg-blue-700 text-white shadow-xs transition-all cursor-pointer"
                  >
                    Next Question
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Results Screen */
            <div className="py-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-accent flex items-center justify-center mb-3">
                <Trophy className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Exam Completed!
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Your answers have been evaluated and your progress updated.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 w-full mb-6">
                <div className="text-2xl font-black text-accent">
                  {score} / {totalQuestions}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1">
                  Score: {Math.round((score / totalQuestions) * 100)}%
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-lg text-xs font-semibold bg-accent hover:bg-[#1A9B73] text-white shadow-xs transition-colors cursor-pointer"
              >
                Close & Return to Course
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { X, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AskQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionSubmitted: (question: { subject: string; details: string }) => void;
}

export const AskQuestionModal: React.FC<AskQuestionModalProps> = ({
  isOpen,
  onClose,
  onQuestionSubmitted,
}) => {
  const [subject, setSubject] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Handle auto-close timeout after submission with proper unmount cleanup
  useEffect(() => {
    if (!submitted) return;
    const timer = setTimeout(() => {
      setSubmitted(false);
      setSubject('');
      setDetails('');
      setError('');
      onClose();
    }, 1800);
    return () => clearTimeout(timer);
  }, [submitted, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) {
      setError('Please provide details for your question.');
      return;
    }

    onQuestionSubmitted({
      subject: subject.trim() || 'General Question',
      details: details.trim(),
    });

    setSubmitted(true);
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ask-question-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-100 p-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-accent flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 id="ask-question-title" className="text-base font-bold text-slate-900">
                Ask the Instructor
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-accent flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Question Submitted!
            </h3>
            <p className="text-xs text-slate-500">
              Question submitted successfully.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="question-topic"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Topic / Subject (Optional)
              </label>
              <input
                id="question-topic"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Question regarding Lesson 3 quiz"
                className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-accent focus:bg-white text-slate-800 placeholder:text-slate-400 transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="question-body"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Question Details
              </label>
              <textarea
                id="question-body"
                rows={5}
                value={details}
                onChange={(e) => {
                  setDetails(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Write your question here in detail..."
                className="w-full p-3.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-accent focus:bg-white text-slate-800 placeholder:text-slate-400 transition-colors resize-none"
              />
              {error && (
                <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-accent hover:bg-[#1A9B73] text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Submit Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

'use strict';
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Download, ZoomIn, ZoomOut, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { PdfContent } from '@/types/course';

interface PdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  pdfTitle?: string;
  pdfUrl?: string;
  pdfContent?: PdfContent;
  courseTitle?: string;
}

export const PdfModal: React.FC<PdfModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  pdfTitle = 'Course Reference Guide (PDF)',
  pdfUrl = '',
  pdfContent,
  courseTitle,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const totalPages = 12;

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
      onCompleteRef.current?.();
    }
  }, [isOpen, pdfUrl]);

  if (!isOpen || (!pdfUrl && !pdfContent)) return null;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      if (nextPage === totalPages) {
        onComplete?.();
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in"
    >
      <div className="relative w-full max-w-4xl h-[90vh] bg-slate-100 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-slide-up">
        {/* PDF Toolbar Header */}
        <div className="bg-slate-900 text-white px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3 shadow-md shrink-0">
          {/* LEFT: PDF Icon & Title (truncates on small screens) */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-red-600 flex items-center justify-center shrink-0">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            <span className="text-xs sm:text-sm font-semibold truncate text-slate-100 min-w-0">
              {pdfTitle}
            </span>
          </div>

          {/* Controls: Page navigation, Zoom (sm+), Download, Close */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Page navigation */}
            <div className="flex items-center gap-0.5 sm:gap-1 text-xs bg-slate-800 px-1.5 sm:px-2 py-1 rounded-md shrink-0 whitespace-nowrap">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="p-0.5 hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <span className="font-mono text-[11px] sm:text-xs px-1 whitespace-nowrap select-none">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className="p-0.5 hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* Zoom controls (hidden on mobile, visible on sm+) */}
            <div className="hidden sm:flex items-center gap-1 text-xs bg-slate-800 px-2 py-1 rounded-md shrink-0 whitespace-nowrap">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(z - 15, 70))}
                aria-label="Zoom out"
                className="p-0.5 hover:text-accent cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] px-1 whitespace-nowrap select-none">{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(z + 15, 150))}
                aria-label="Zoom in"
                className="p-0.5 hover:text-accent cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Download */}
            <a
              href={pdfUrl || '#'}
              download
              className="p-1.5 rounded-md bg-slate-800 hover:bg-accent hover:text-white transition-colors cursor-pointer text-slate-300 shrink-0"
              title="Download PDF"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </a>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close PDF viewer"
              className="p-1.5 rounded-md hover:bg-red-600 transition-colors cursor-pointer text-slate-300 hover:text-white shrink-0 sm:ml-1"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Document Content Simulation */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center bg-slate-200">
          <div
            style={{ transform: `scale(${zoomLevel / 100})` }}
            className="w-full max-w-[700px] bg-white min-h-[900px] rounded-lg shadow-xl p-8 sm:p-12 text-slate-800 transition-transform duration-200 flex flex-col justify-between origin-top"
          >
            <div>
              {/* Header */}
              <div className="border-b-2 border-emerald-600 pb-4 mb-6 flex justify-between items-center">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    ITLegend Learning Reference
                  </h1>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {pdfContent?.courseName ||
                      (courseTitle
                        ? `${courseTitle} • Comprehensive Study Guide`
                        : 'Professional Engineering & Architecture Reference Guide')}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-sm">
                    Module {currentPage}
                  </span>
                </div>
              </div>

              {/* Document Section Content */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <h2 className="text-base font-bold text-slate-900">
                  {pdfContent?.chapterTitle
                    ? `Chapter ${currentPage}: ${pdfContent.chapterTitle}`
                    : `Chapter ${currentPage}: Architectural Principles & Foundations`}
                </h2>
                <p>
                  {pdfContent?.summary ||
                    'Comprehensive engineering reference and technical guidelines tailored specifically for this course module.'}
                </p>

                <div className="bg-slate-50 border-l-4 border-emerald-500 p-3.5 my-3 rounded-r-lg">
                  <h3 className="font-bold text-slate-800 text-xs mb-1">
                    {pdfContent?.keyRuleTitle || 'Key Architectural Rule:'}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {pdfContent?.keyRuleText ||
                      'Always adhere to established patterns, isolate side-effects, and enforce type contracts across system boundaries.'}
                  </p>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-4">
                  Checklist for this Module:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 pl-1">
                  {(pdfContent?.checklist && pdfContent.checklist.length > 0
                    ? pdfContent.checklist
                    : [
                        'Review architecture benchmarks and documentation',
                        'Validate implementation against best practice guidelines',
                        'Conduct self-audit using the module verification rubric',
                        'Verify performance benchmarks and accessibility standards',
                      ]
                  ).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Document Footer */}
            <div className="border-t border-slate-200 pt-4 mt-8 flex justify-between text-[11px] text-slate-400 font-mono">
              <span>ITLegend Academy • Confidential Course Material</span>
              <span>Page {currentPage} of {totalPages}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

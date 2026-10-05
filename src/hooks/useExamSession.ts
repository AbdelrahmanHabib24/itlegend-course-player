'use strict';

import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { ExamData, ExamQuestion } from '@/types/course';

interface UseExamSessionProps {
  isOpen: boolean;
  examData?: ExamData;
  onExamComplete?: (score: number, total: number) => void;
}

export function useExamSession({
  isOpen,
  examData,
  onExamComplete,
}: UseExamSessionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(examData?.durationSeconds || 900);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || isSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isSubmitted]);

  // Reset exam state and timer when modal opens or examData changes
  useEffect(() => {
    if (isOpen && examData) {
      setCurrentQuestionIndex(0);
      setIsSubmitted(false);
      setSelectedAnswers({});
      setScore(0);
      setTimeLeft(examData.durationSeconds || 900);
    }
  }, [isOpen, examData?.id, examData?.durationSeconds]);

  const totalQuestions = examData?.questions?.length || 0;
  const safeIndex = Math.min(
    Math.max(currentQuestionIndex, 0),
    Math.max(totalQuestions - 1, 0)
  );
  const currentQuestion: ExamQuestion | undefined = examData?.questions?.[safeIndex];

  const selectOption = useCallback(
    (questionId: number, optionId: string) => {
      if (isSubmitted) return;
      setSelectedAnswers((prev) => ({
        ...prev,
        [questionId]: optionId,
      }));
    },
    [isSubmitted]
  );

  const nextQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
  }, [totalQuestions]);

  const prevQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToQuestion = useCallback(
    (idx: number) => {
      if (idx >= 0 && idx < totalQuestions) {
        setCurrentQuestionIndex(idx);
      }
    },
    [totalQuestions]
  );

  const submitExam = useCallback(() => {
    if (!examData) return;
    let correctCount = 0;
    examData.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOption) {
        correctCount += 1;
      }
    });

    setScore(correctCount);
    setIsSubmitted(true);
    if (onExamComplete) {
      onExamComplete(correctCount, totalQuestions);
    }

    // Fire celebratory confetti on high score (>= 50%)
    if (correctCount >= Math.ceil(totalQuestions / 2)) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [examData, onExamComplete, selectedAnswers, totalQuestions]);

  const resetExam = useCallback(() => {
    setCurrentQuestionIndex(0);
    setIsSubmitted(false);
    setSelectedAnswers({});
    setScore(0);
    setTimeLeft(examData?.durationSeconds || 900);
  }, [examData?.durationSeconds]);

  const formatTimer = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
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
    resetExam,
    formatTimer,
  };
}

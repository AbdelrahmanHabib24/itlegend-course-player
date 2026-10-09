
import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import type { ExamData, ExamQuestion } from '@/types/course';

const DEFAULT_EXAM_DURATION_SECONDS = 900;

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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [timeLeft, setTimeLeft] = useState(
    examData?.durationSeconds || DEFAULT_EXAM_DURATION_SECONDS,
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Timer countdown.
  useEffect(() => {
    if (!isOpen || isSubmitted || timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearTimeout(timer);
  }, [isOpen, isSubmitted, timeLeft]);

  // Reset exam when modal opens or exam changes.
  useEffect(() => {
    if (!isOpen || !examData) return;

    setCurrentQuestionIndex(0);
    setIsSubmitted(false);
    setSelectedAnswers({});
    setScore(0);
    setTimeLeft(
      examData.durationSeconds || DEFAULT_EXAM_DURATION_SECONDS,
    );
  }, [isOpen, examData?.id, examData?.durationSeconds]);

  const totalQuestions = examData?.questions.length || 0;

  const safeIndex = Math.min(
    Math.max(currentQuestionIndex, 0),
    Math.max(totalQuestions - 1, 0),
  );

  const currentQuestion: ExamQuestion | undefined =
    examData?.questions[safeIndex];

  const selectOption = useCallback(
    (questionId: number, optionId: string) => {
      if (isSubmitted) return;

      setSelectedAnswers((prev) => ({
        ...prev,
        [questionId]: optionId,
      }));
    },
    [isSubmitted],
  );

  const nextQuestion = useCallback(() => {
    if (totalQuestions === 0) return;

    setCurrentQuestionIndex((prev) =>
      Math.min(prev + 1, totalQuestions - 1),
    );
  }, [totalQuestions]);

  const prevQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalQuestions) {
        setCurrentQuestionIndex(index);
      }
    },
    [totalQuestions],
  );

  const submitExam = useCallback(() => {
    if (!examData || isSubmitted || totalQuestions === 0) return;

    const correctCount = examData.questions.filter(
      (question) =>
        selectedAnswers[question.id] === question.correctOption,
    ).length;

    setScore(correctCount);
    setIsSubmitted(true);

    onExamComplete?.(correctCount, totalQuestions);

    // Celebrate scores of 50% or higher.
    if (correctCount / totalQuestions >= 0.5) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [examData, isSubmitted, onExamComplete, selectedAnswers, totalQuestions]);

  const resetExam = useCallback(() => {
    setCurrentQuestionIndex(0);
    setIsSubmitted(false);
    setSelectedAnswers({});
    setScore(0);
    setTimeLeft(
      examData?.durationSeconds || DEFAULT_EXAM_DURATION_SECONDS,
    );
  }, [examData?.durationSeconds]);

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
  };
}

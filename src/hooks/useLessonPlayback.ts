'use strict';

import { useState, useRef, useEffect, useCallback } from 'react';
import { LessonItem } from '@/types/course';

interface UseLessonPlaybackProps {
  currentLesson: LessonItem | null;
  onLessonEnded?: () => void;
}

export function useLessonPlayback({
  currentLesson,
  onLessonEnded,
}: UseLessonPlaybackProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(100);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.85);
  const [hasStartedPlaying, setHasStartedPlaying] = useState<boolean>(false);

  // Video source: dynamic from selected lesson with fallback
  const videoSrc = currentLesson?.videoUrl || '/videos/seo-analytics.mp4';

  // Reset video state when switching lessons
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
      setHasStartedPlaying(false);
      videoRef.current.load();
    }
  }, [currentLesson?.id, currentLesson?.videoUrl]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
      setHasStartedPlaying(true);
    }
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 100);
  }, []);

  const seek = useCallback((time: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  }, [isMuted]);

  const setPlayerVolume = useCallback((val: number) => {
    if (!videoRef.current) return;
    videoRef.current.volume = val;
    setVolume(val);
    setIsMuted(val === 0);
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    if (onLessonEnded) {
      onLessonEnded();
    }
  }, [onLessonEnded]);

  const formatTime = useCallback((secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, []);

  return {
    videoRef,
    isPlaying,
    currentTime,
    duration,
    isMuted,
    volume,
    hasStartedPlaying,
    videoSrc,
    togglePlay,
    handleTimeUpdate,
    handleLoadedMetadata,
    seek,
    toggleMute,
    setPlayerVolume,
    handleEnded,
    formatTime,
    setIsPlaying,
    setHasStartedPlaying,
  };
}

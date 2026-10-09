import { useState, useRef, useEffect, useCallback } from "react";
import type { LessonItem } from "@/types/course";

interface UseLessonPlaybackProps {
  currentLesson: LessonItem | null;
  onLessonEnded?: () => void;
}

export function useLessonPlayback({
  currentLesson,
  onLessonEnded,
}: UseLessonPlaybackProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);

  const videoSrc = currentLesson?.videoUrl;

  // Reset video state when switching lessons.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setHasStartedPlaying(false);
  }, [currentLesson?.id, currentLesson?.videoUrl]);

  // Toggle play and pause.
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, []);

  // Update current playback time.
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;

    setCurrentTime(videoRef.current.currentTime);
  }, []);

  // Update duration and synchronize volume settings.
  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const videoDuration = video.duration;

    setDuration(
      Number.isFinite(videoDuration) && videoDuration > 0 ? videoDuration : 0,
    );
    video.volume = volume;
    video.muted = isMuted;
  }, [volume, isMuted]);

  // Seek video.
  const seek = useCallback((time: number) => {
    if (!videoRef.current) return;

    videoRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  // Toggle mute.
  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !isMuted;

    video.muted = nextMuted;
    setIsMuted(nextMuted);
  }, [isMuted]);

  // Change volume.
  const setPlayerVolume = useCallback((value: number) => {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = value === 0;

    video.volume = value;
    video.muted = nextMuted;

    setVolume(value);
    setIsMuted(nextMuted);
  }, []);

  // Sync state with native video events.
  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    setHasStartedPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    onLessonEnded?.();
  }, [onLessonEnded]);

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
    handlePlay,
    handlePause,
    handleEnded,
  };
}

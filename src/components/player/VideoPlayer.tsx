"use client";

import { useRef, useState, useEffect } from "react";
import type { ChangeEvent, CSSProperties } from "react";

import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from "lucide-react";

import type { LessonItem } from "@/types/course";
import { useLessonPlayback } from "@/hooks/useLessonPlayback";
import { formatTime } from "@/utils/formatTime";

interface VideoPlayerProps {
  currentLesson: LessonItem | null;
  courseThumbnail?: string;
  onLessonEnded?: () => void;
}

export const VideoPlayer = ({
  currentLesson,
  courseThumbnail,
  onLessonEnded,
}: VideoPlayerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
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
  } = useLessonPlayback({
    currentLesson,
    onLessonEnded,
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPlayerVolume(Number(e.target.value));
  };

  const toggleFullscreen = () => {
    const element = containerRef.current;

    if (!element) return;

    if (document.fullscreenElement === element) {
      document.exitFullscreen().catch(() => {});
      return;
    }

    element.requestFullscreen().catch(() => {});
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);

      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const handleControlsActivity = () => {
    setShowControls(true);

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    controlsTimeoutRef.current = setTimeout(() => {
      controlsTimeoutRef.current = null;

      if (videoRef.current && !videoRef.current.paused) {
        setShowControls(false);
      }
    }, 2800);
  };

  const handleMouseLeave = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = null;
    }

    if (videoRef.current && !videoRef.current.paused) {
      setShowControls(false);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleControlsActivity}
      onTouchStart={handleControlsActivity}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full bg-video overflow-hidden shadow-md group select-none transition-all duration-300 ${
        isFullscreen
          ? "h-full w-full rounded-none aspect-auto"
          : "aspect-video rounded-xl mobile-sticky-video"
      }`}
    >
      {/* HTML5 Video */}
      <video
        key={currentLesson?.id ?? "empty-video"}
        ref={videoRef}
        src={videoSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onDurationChange={handleLoadedMetadata}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onClick={togglePlay}
        playsInline
        className={`w-full h-full cursor-pointer transition-opacity duration-150 ${
          isFullscreen ? "object-contain" : "object-cover"
        } ${hasStartedPlaying ? "opacity-100" : "opacity-0"}`}
      />

      {/* Course Thumbnail */}
      {!hasStartedPlaying && (
        <div
          className="absolute inset-0 bg-video z-0 overflow-hidden"
          aria-hidden="true"
        >
          {courseThumbnail && (
            <img
              src={courseThumbnail}
              alt=""
              className={`w-full h-full ${
                isFullscreen ? "object-contain" : "object-cover"
              }`}
            />
          )}
        </div>
      )}

      {/* Center Play Button */}
      {!isPlaying && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Play video"
          className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-opacity z-10 border-0 p-0 ${
            hasStartedPlaying
              ? "bg-black/40 backdrop-blur-[0.5px]"
              : "bg-transparent"
          }`}
        >
          <span className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center shadow-xl transition-transform hover:scale-105 border border-white/80">
            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-[var(--player-play-accent)] text-[var(--player-play-accent)] ml-1" />
          </span>
        </button>
      )}

      {/* Player Controls */}
      <div
        className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-3 sm:px-4 py-2.5 sm:py-3 transition-opacity duration-300 flex flex-col gap-2 z-20 ${
          isFullscreen ? "pb-6 sm:pb-4" : ""
        } ${showControls || !isPlaying ? "opacity-100" : "opacity-0"}`}
      >
        {/* Progress Slider */}
        <div className="relative w-full flex items-center group/scrub cursor-pointer">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            aria-label="Video seek slider"
            style={
              {
                "--video-progress": `${
                  duration > 0 ? (currentTime / duration) * 100 : 0
                }%`,
              } as CSSProperties
            }
            className="player-progress-slider w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white group-hover/scrub:h-1.5 transition-all"
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Play / Pause */}
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="p-1 text-white hover:text-white/80 transition-colors cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current" />
              )}
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute" : "Mute"}
                className="p-1 text-white hover:text-white/80 transition-colors cursor-pointer"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-[var(--player-control-muted)]" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>

              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                aria-label="Volume slider"
                style={
                  {
                    "--volume-progress": `${(isMuted ? 0 : volume) * 100}%`,
                  } as CSSProperties
                }
                className="player-volume-slider w-14 sm:w-18 h-1 bg-white/30 rounded appearance-none cursor-pointer accent-white hidden sm:inline-block"
              />
            </div>

            {/* Time Indicator */}
            <span className="text-[11px] sm:text-xs text-white/80 font-mono">
              {formatTime(currentTime)} /{" "}
              {duration > 0 ? formatTime(duration) : "--:--"}
            </span>
          </div>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            className="p-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4" />
            ) : (
              <Maximize className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

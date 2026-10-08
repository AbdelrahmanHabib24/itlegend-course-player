'use strict';
'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Columns,
  Eye,
} from 'lucide-react';
import { LessonItem } from '@/types/course';
import { useLessonPlayback } from '@/hooks/useLessonPlayback';

interface VideoPlayerProps {
  currentLesson: LessonItem | null;
  courseThumbnail?: string;
  isWideMode: boolean;
  onToggleWideMode: () => void;
  onLessonEnded?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  currentLesson,
  courseThumbnail,
  isWideMode,
  onToggleWideMode,
  onLessonEnded,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

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
    handleEnded,
    formatTime,
    setIsPlaying,
    setHasStartedPlaying,
  } = useLessonPlayback({
    currentLesson,
    onLessonEnded,
  });

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(parseFloat(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerVolume(parseFloat(e.target.value));
  };

 const toggleFullscreen = () => {
  const element = containerRef.current;
  if (!element) return;

  if (document.fullscreenElement) {
    document.exitFullscreen?.().catch(() => {});
    return;
  }

  if (element.requestFullscreen) {
    element.requestFullscreen().catch(() => {});
    return;
  }

  const video = videoRef.current as
    | (HTMLVideoElement & { webkitEnterFullscreen?: () => void })
    | null;

  video?.webkitEnterFullscreen?.();
};

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
    };
  }, []);


 const handleMouseMove = () => {
  setShowControls(true);

  if (controlsTimeoutRef.current) {
    clearTimeout(controlsTimeoutRef.current);
  }

  controlsTimeoutRef.current = setTimeout(() => {
    if (isPlaying) {
      setShowControls(false);
    }
  }, 2800);
};

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchStart={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className={`relative w-full bg-video overflow-hidden shadow-md group select-none transition-all duration-300 ${
        isFullscreen
          ? 'h-full w-full rounded-none aspect-auto'
          : 'aspect-video rounded-xl mobile-sticky-video'
      }`}
    >
      {/* Real HTML5 Video Element — no poster, visible upon playback */}
      <video
        key={currentLesson?.id ?? 'empty-video'}
        ref={videoRef}
        src={videoSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onDurationChange={handleLoadedMetadata}
        onPlay={() => {
          setIsPlaying(true);
          setHasStartedPlaying(true);
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={handleEnded}
        onClick={togglePlay}
        playsInline
        className={`w-full h-full cursor-pointer transition-opacity duration-150 ${
          isFullscreen ? 'object-contain' : 'object-cover'
        } ${hasStartedPlaying ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Course poster / thumbnail before playback starts */}
      {!hasStartedPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 bg-video z-0 cursor-pointer overflow-hidden"
          aria-hidden="true"
        >
          {courseThumbnail && (
            <img
              src={courseThumbnail}
              alt=""
              className={`w-full h-full ${isFullscreen ? 'object-contain' : 'object-cover'}`}
            />
          )}
        </div>
      )}

      {/* Center Play Button — Pure White Circle with play icon */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-opacity z-10 ${
            hasStartedPlaying ? 'bg-black/40 backdrop-blur-[0.5px]' : 'bg-transparent'
          }`}
        >
          <button
            type="button"
            aria-label="Play video"
            className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center shadow-xl hover:scale-105 transition-transform cursor-pointer border border-white/80"
          >
            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-[#ED1D24] text-[#ED1D24] ml-1" />
          </button>
        </div>
      )}

      {/* Top Bar: Left lesson title badge & Right viewers pill */}
      <div
        className={`absolute inset-x-0 top-0 flex items-center justify-between text-white pointer-events-none transition-opacity duration-300 z-10 ${
          isFullscreen
            ? 'p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/30 to-transparent'
            : 'p-3 sm:p-4'
        } ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="bg-black/60 backdrop-blur-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/10 flex items-center gap-2 max-w-[70%] sm:max-w-md min-w-0">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-100 truncate">
            {currentLesson?.title || 'Course Overview'}
          </span>
        </div>

        {/* Viewers Pill top-right */}
        <div className="bg-black/75 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5 text-xs font-medium text-white/90 shrink-0">
          <Eye className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-[11px] font-bold">3</span>
        </div>
      </div>

      {/* Player Controls Bar at bottom */}
      <div
        className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-3 sm:px-4 py-2.5 sm:py-3 transition-opacity duration-300 flex flex-col gap-2 z-20 ${
          isFullscreen ? 'pb-6 sm:pb-4' : ''
        } ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Progress scrub bar */}
        <div className="relative w-full flex items-center group/scrub cursor-pointer">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            aria-label="Video seek slider"
            style={{
              background: `linear-gradient(to right, #FFFFFF ${
                duration > 0 ? (currentTime / duration) * 100 : 0
              }%, rgba(255, 255, 255, 0.25) ${
                duration > 0 ? (currentTime / duration) * 100 : 0
              }%)`,
            }}
            className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white group-hover/scrub:h-1.5 transition-all"
          />
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Play/Pause */}
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="p-1 text-white hover:text-white/80 transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            {/* Mute & Volume */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                className="p-1 text-white hover:text-white/80 transition-colors cursor-pointer"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-white/70" />
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
                style={{
                  background: `linear-gradient(to right, #FFFFFF ${
                    (isMuted ? 0 : volume) * 100
                  }%, rgba(255, 255, 255, 0.25) ${(isMuted ? 0 : volume) * 100}%)`,
                }}
                className="w-14 sm:w-18 h-1 bg-white/30 rounded appearance-none cursor-pointer accent-white hidden sm:inline-block"
              />
            </div>

            {/* Time Indicator */}
            <span className="text-[11px] sm:text-xs text-white/80 font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theater / Wide Mode toggle */}
            <button
              type="button"
              onClick={onToggleWideMode}
              title={isWideMode ? 'Exit Wide View' : 'Wide / Theater Mode'}
              aria-label="Toggle Theater View"
              className={`p-1.5 rounded-md hover:bg-white/10 transition-colors hidden md:flex items-center gap-1.5 cursor-pointer ${
                isWideMode ? 'text-white bg-white/20' : 'text-white/80 hover:text-white'
              }`}
            >
              <Columns className="w-4 h-4" />
              <span className="text-[11px] font-medium hidden lg:inline">
                {isWideMode ? 'Standard' : 'Wide View'}
              </span>
            </button>

            {/* Fullscreen Maximize */}
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              className="p-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

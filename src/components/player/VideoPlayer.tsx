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
  currentLesson: LessonItem;
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
    const el = containerRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      } else {
        // Fallback for Safari/iOS video element
        const vid = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
        vid?.webkitEnterFullscreen?.();
      }
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
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
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2800);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className="relative w-full aspect-video bg-[#0B1320] rounded-xl overflow-hidden shadow-md group select-none transition-all duration-300 mobile-sticky-video"
    >
      {/* Real HTML5 Video Element — no poster, visible upon playback */}
      <video
        key={currentLesson.id}
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
        className={`w-full h-full object-cover cursor-pointer transition-opacity duration-150 ${
          hasStartedPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Course poster / thumbnail before playback starts */}
      {!hasStartedPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 bg-[#0B1320] z-0 cursor-pointer overflow-hidden"
          aria-hidden="true"
        >
          {courseThumbnail && (
            <img
              src={courseThumbnail}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
        </div>
      )}

      {/* Center Play Button — Pure White Circle with play icon matching Figma */}
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
            className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-white text-[#ED1D24] flex items-center justify-center shadow-xl hover:scale-105 transition-transform cursor-pointer border border-white/80"
          >
            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-[#309255] text-[#309255] ml-1" />
          </button>
        </div>
      )}

      {/* Top Bar: Left "Course Overview" badge & Right viewers pill from Figma */}
      <div
        className={`absolute top-4 left-4 right-4 flex items-center justify-between text-white pointer-events-none transition-opacity duration-300 z-10 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="bg-black/60 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-100">
            {currentLesson.title || 'Course Overview'}
          </span>
        </div>

        {/* Viewers Pill matching Figma top-right */}
        <div className="bg-black/75 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5 text-xs font-medium text-white/90">
          <Eye className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-[11px] font-bold">3</span>
        </div>
      </div>

      {/* Player Controls Bar at bottom */}
      <div
        className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-3 sm:px-4 py-2.5 sm:py-3 transition-opacity duration-300 flex flex-col gap-2 z-20 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
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
            className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#309255] group-hover/scrub:h-1.5 transition-all"
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
              className="p-1 hover:text-[#309255] transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            {/* Mute & Volume */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                className="p-1 hover:text-[#309255] transition-colors cursor-pointer"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-red-400" />
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
                className="w-14 sm:w-18 h-1 bg-white/30 rounded appearance-none cursor-pointer accent-[#309255] hidden sm:inline-block"
              />
            </div>

            {/* Time Indicator */}
            <span className="text-[11px] sm:text-xs text-slate-300 font-mono">
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
                isWideMode ? 'text-[#309255] bg-white/10' : 'text-slate-300'
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
              className="p-1.5 rounded-md hover:text-[#309255] hover:bg-white/10 transition-colors cursor-pointer"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

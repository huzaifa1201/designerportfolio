import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Heart, Eye } from 'lucide-react';
import { Project } from '../types';

interface VideoReelsSectionProps {
  reels: Project[];
  onLike: (id: string | number) => void;
  likedIds: Set<string | number>;
}

export const VideoReelsSection: React.FC<VideoReelsSectionProps> = ({ reels, onLike, likedIds }) => {
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const activeReel = reels[activeReelIndex] || reels[0];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.playbackRate = playbackSpeed;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [activeReelIndex]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleSpeed = () => {
    const nextSpeed = playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : 1;
    setPlaybackSpeed(nextSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <section
      id="reels"
      className="relative py-20 lg:py-24 bg-[#0A0B10] text-white border-t border-white/10 overflow-hidden"
    >
      {/* Subtle Amber & Violet Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 left-1/4 h-[420px] w-[420px] rounded-full bg-amber-500/10 blur-[150px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-10 h-[360px] w-[360px] rounded-full bg-violet-600/10 blur-[140px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Sleek 9:16 Cinema Screening Player */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start">
            <div className="w-full max-w-[330px] rounded-[32px] border border-[#C5A880]/30 bg-[#100F0E] p-2.5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.65)]">
              <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[24px] bg-black">
                {activeReel && (
                  <video
                    ref={videoRef}
                    key={activeReel.media_url}
                    src={activeReel.media_url}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleTimeUpdate}
                    className="h-full w-full object-cover cursor-pointer"
                    onClick={togglePlay}
                  />
                )}

                {!isPlaying && (
                  <div
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/45 cursor-pointer backdrop-blur-[2px]"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C5A880] text-[#181716] shadow-xl transition-transform hover:scale-105">
                      <Play className="h-6 w-6 ml-0.5 fill-current" />
                    </div>
                  </div>
                )}

                {/* Minimal Top Status Bar */}
                <div className="pointer-events-none absolute top-3.5 inset-x-3.5 flex items-center justify-between text-[10px] tracking-[0.1em] uppercase text-[#FAF8F5]">
                  <span className="rounded-full bg-black/55 backdrop-blur-md px-2.5 py-1 border border-white/10 tabular-nums">
                    0{activeReelIndex + 1} / 0{reels.length}
                  </span>
                  <span className="rounded-full bg-black/55 backdrop-blur-md px-2.5 py-1 border border-white/10 text-[#C5A880]">
                    9:16 Vertical
                  </span>
                </div>

                {/* Bottom Scrubber & Cinema Controls */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/65 to-transparent p-3.5 pt-12">
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    aria-label="Seek video position"
                    className="mb-2.5 h-1 w-full cursor-pointer appearance-none rounded-lg bg-white/25 accent-[#C5A880]"
                  />

                  <div className="flex items-center justify-between text-xs text-[#FAF8F5]">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={togglePlay}
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                        className="rounded-full bg-white/12 p-1.5 hover:bg-[#C5A880] hover:text-[#181716] transition-colors"
                      >
                        {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={toggleMute}
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                        className="rounded-full bg-white/12 p-1.5 hover:bg-[#C5A880] hover:text-[#181716] transition-colors"
                      >
                        {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={toggleSpeed}
                        title="Toggle playback speed"
                        className="rounded-full bg-white/12 px-2 py-1 text-[10px] font-medium text-[#C5A880] hover:bg-[#C5A880] hover:text-[#181716] transition-colors tabular-nums"
                      >
                        {playbackSpeed}x
                      </button>
                      <span className="ml-1 text-[10px] text-[#D7D0C6] tabular-nums">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {activeReel && (
                        <button
                          type="button"
                          onClick={() => onLike(activeReel.id)}
                          aria-label={`Like reel ${activeReel.title}`}
                          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                            likedIds.has(activeReel.id)
                              ? 'bg-[#C47D68] text-white'
                              : 'bg-white/12 text-[#FAF8F5] hover:bg-[#C47D68]'
                          }`}
                        >
                          <Heart
                            className={`h-3 w-3 ${
                              likedIds.has(activeReel.id) ? 'fill-white text-white' : ''
                            }`}
                          />
                          <span className="tabular-nums">{activeReel.likes_count}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={toggleFullscreen}
                        aria-label="Fullscreen"
                        className="rounded-full bg-white/12 p-1.5 hover:bg-[#C5A880] hover:text-[#181716] transition-colors"
                      >
                        <Maximize2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {activeReel && (
                <div className="px-3 pt-3 pb-2">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.12em] text-[#C5A880]">
                    <span className="truncate">{activeReel.client_or_brand}</span>
                    <span className="inline-flex items-center gap-1 text-[#D7D0C6]/75 tabular-nums shrink-0">
                      <Eye className="h-3 w-3" /> {activeReel.views_count}
                    </span>
                  </div>
                  <h3 className="mt-1 font-serif text-lg font-medium text-[#FAF8F5] leading-snug">
                    {activeReel.title}
                  </h3>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Editorial Header + Balanced 2-Column Reel Playlist */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <span className="block text-[11px] font-medium uppercase tracking-[0.2em] text-[#C5A880]">
                02 · Motion &amp; Showreel Suite
              </span>
              <h2 className="mt-2.5 font-serif text-3xl sm:text-5xl font-medium tracking-[-0.02em] text-[#FAF8F5] leading-[1.08]">
                High-Retention <em className="italic font-normal text-[#C47D68]">Editorial</em> Reels
              </h2>
              <p className="mt-3 text-sm sm:text-[15px] text-[#D7D0C6] leading-[1.7] tracking-[0.02em] max-w-2xl">
                Art-directed short-form storytelling for real estate developments, corporate brands, and digital campaigns—combining rhythmic beat sync, drone pacing, and Urdu/English motion captions.
              </p>
            </div>

            {/* Compact 2-Column Reel Selector Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {reels.map((reel, index) => {
                const isActive = index === activeReelIndex;
                return (
                  <button
                    key={reel.id}
                    type="button"
                    onClick={() => setActiveReelIndex(index)}
                    className={`group text-left flex items-center gap-3.5 rounded-2xl border p-3 transition-all duration-200 ${
                      isActive
                        ? 'border-[#C5A880] bg-white/10 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.45)]'
                        : 'border-white/12 bg-white/[0.04] hover:border-white/30 hover:bg-white/[0.08]'
                    }`}
                  >
                    <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-xl bg-black border border-white/10">
                      <video
                        src={`${reel.media_url}#t=1`}
                        preload="metadata"
                        muted
                        playsInline
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full ${
                            isActive
                              ? 'bg-[#C5A880] text-[#181716]'
                              : 'bg-black/65 text-[#FAF8F5]'
                          }`}
                        >
                          <Play className="h-3 w-3 ml-0.5 fill-current" />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-[0.1em]">
                        <span className="text-[#C5A880] truncate font-medium">
                          {reel.client_or_brand}
                        </span>
                        <span className="text-[#D7D0C6]/70 tabular-nums shrink-0 inline-flex items-center gap-1">
                          <Heart className="h-2.5 w-2.5 text-[#C47D68]" /> {reel.likes_count}
                        </span>
                      </div>

                      <h4 className="mt-1 font-serif text-base font-medium text-[#FAF8F5] truncate group-hover:text-[#C5A880] transition-colors">
                        {reel.title}
                      </h4>

                      <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#D7D0C6]/70 truncate">
                        {reel.tags.slice(0, 2).map((tag, i) => (
                          <React.Fragment key={tag}>
                            {i > 0 && <span aria-hidden="true" className="text-[#C5A880]">·</span>}
                            <span>{tag}</span>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Clean Hairline Production Capabilities Row */}
            <div className="mt-8 pt-6 border-t border-white/12 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs text-[#D7D0C6]/85">
              <div className="flex items-center gap-2">
                <span className="text-[#C5A880]">01</span>
                <span>Premiere Pro &amp; CapCut beat-synced rhythm cuts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#C5A880]">02</span>
                <span>Bilingual Urdu Nastaliq &amp; English motion subtitles</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#C5A880]">03</span>
                <span>Architectural drone pacing &amp; LUT color grading</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#C5A880]">04</span>
                <span>Voiceover timing, audio leveling &amp; sound FX</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

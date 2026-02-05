"use client";

import React, { useRef, useState, useEffect } from "react";
import type { Character } from "@/lib/types";
import { CharacterCard } from "./character-card";
import { DraggableCharacterCard } from "./draggable-character-card";

interface CharactersWallProps {
  characters: Character[];
  isAdmin?: boolean;
}

export function CharactersWall({ characters, isAdmin = false }: CharactersWallProps) {
  const [hasCharacters] = useState(Boolean(characters && characters.length > 0));

  if (!hasCharacters) {
    return (
      <section className="py-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-8 text-foreground">
            Remembering the Individuals
          </h2>
          <p className="foreground">
            No characters have been added yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl mb-4 text-center text-foreground">
          Remembering the Individuals
        </h2>
        <p className="text-center text-foreground mb-12 max-w-2xl mx-auto">
          Each person represented here had a unique story, dreams, and loved ones.
          Click on a card to learn more about their life.
        </p>

        {/* Cork board effect */}
        <div
          className="relative p-8 md:p-12 rounded-lg min-h-[500px]"
          style={{
            backgroundColor: "var(--cork)",
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(0,0,0,0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(255,255,255,0.05) 0%, transparent 50%)
            `,
            boxShadow: "inset 0 2px 20px rgba(0,0,0,0.3), 0 4px 20px rgba(0,0,0,0.2)",
          }}
        >
          {/* Wooden frame effect */}
          <div
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              boxShadow: "inset 0 0 0 8px rgba(60,40,20,0.8), inset 0 0 0 10px rgba(80,60,40,0.6)",
            }}
          />

          {/* Cards */}
          {isAdmin ? (
            // Admin mode: draggable cards with absolute positioning
            <div className="relative min-h-[600px]">
              {characters.map((character) => (
                <DraggableCharacterCard key={character.id} character={character} />
              ))}
            </div>
          ) : (
            // Public mode: grid layout
            <div className="relative flex flex-wrap justify-center gap-8 md:gap-10">
              {characters.map((character) => (
                <CharacterCard key={character.id} character={character} />
              ))}
            </div>
          )}

          {/* Audio player placed at the bottom of the cork board */}
          <div className="mt-8 flex justify-center">
            <AudioPlayer />
          </div>
        </div>
      </div>
    </section>
  );
}

function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setCurrentTime(audio.currentTime);
    };
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {
        /* play might be blocked by browser autoplay policies */
      });
      setIsPlaying(true);
    }
  };

  const stop = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = ratio * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (t: number) => {
    if (!isFinite(t) || isNaN(t)) return "0:00";
    const minutes = Math.floor(t / 60);
    const seconds = Math.floor(t % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
<div
  className="rounded-md shadow-md p-4 w-290 h-72 flex flex-col justify-between"
  style={{ backgroundColor: "var(--post-it-cream)" }}
  role="region"
  aria-label="Audio player"
>
      <audio ref={audioRef} src="/podcast.mp3" preload="metadata" />
      <div className="text-center">
        <h3 className="font-semibold text-sm text-black">Podcast</h3>
        <p className="text-xs text-black">Listen to the episode</p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={togglePlay}
            className="px-3 py-2 bg-green-700 text-white rounded text-sm transition-all duration-300 hover:scale-105 hover:z-10 cursor-pointer"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            onClick={stop}
            className="px-3 py-2 bg-red-700 text-white rounded text-sm transition-all duration-300 hover:scale-105 hover:z-10 cursor-pointer"
            aria-label="Stop"
          >
            Stop
          </button>
        </div>

        <div>
          <div
            className="w-full h-3 rounded bg-blue-300 transition-all duration-300"
            onClick={handleProgressClick}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={duration || 0}
            aria-valuenow={currentTime}
            aria-label="Audio progress"
          >
            <div
              className="h-3 rounded bg-black"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-black mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <label className="text-xs text-black">Volume</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
            className="w-40"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}

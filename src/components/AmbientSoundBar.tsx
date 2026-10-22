"use client";

import React, { useState } from "react";
import { Volume2, VolumeX, CloudRain, Music, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { audioEngine } from "@/utils/audioSynth";

export const AmbientSoundBar: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<"rain" | "lofi" | "clock" | "off">("off");
  const [volume, setVolume] = useState(0.5);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSelectMode = (mode: "rain" | "lofi" | "clock" | "off") => {
    setCurrentMode(mode);
    audioEngine.play(mode);
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    audioEngine.setVolume(v);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <div className="bg-[#12131c]/90 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-3 text-white transition-all max-w-xs">
        {/* Header / Minimized bar */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-xs font-semibold hover:text-cyan-400 transition-colors"
          >
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Ambient Audio Bar</span>
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
            )}
          </button>

          {/* Quick mode tag */}
          <span className="text-[10px] font-mono text-zinc-400 uppercase">
            {currentMode}
          </span>
        </div>

        {/* Expanded Controls */}
        {isExpanded && (
          <div className="pt-3 mt-2 border-t border-white/10 space-y-3">
            {/* Mode buttons */}
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() =>
                  handleSelectMode(currentMode === "rain" ? "off" : "rain")
                }
                className={`flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-mono border transition-all ${
                  currentMode === "rain"
                    ? "bg-cyan-950/60 border-cyan-500/50 text-cyan-300"
                    : "bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10"
                }`}
              >
                <CloudRain className="w-3.5 h-3.5 mb-1" />
                <span>Rain</span>
              </button>

              <button
                onClick={() =>
                  handleSelectMode(currentMode === "lofi" ? "off" : "lofi")
                }
                className={`flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-mono border transition-all ${
                  currentMode === "lofi"
                    ? "bg-purple-950/60 border-purple-500/50 text-purple-300"
                    : "bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10"
                }`}
              >
                <Music className="w-3.5 h-3.5 mb-1" />
                <span>Lo-Fi</span>
              </button>

              <button
                onClick={() =>
                  handleSelectMode(currentMode === "clock" ? "off" : "clock")
                }
                className={`flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-mono border transition-all ${
                  currentMode === "clock"
                    ? "bg-amber-950/60 border-amber-500/50 text-amber-300"
                    : "bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10"
                }`}
              >
                <Clock className="w-3.5 h-3.5 mb-1" />
                <span>Clock</span>
              </button>
            </div>

            {/* Volume Scrub */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span>VOLUME</span>
                <span>{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                aria-label="Adjust ambient sound volume"
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

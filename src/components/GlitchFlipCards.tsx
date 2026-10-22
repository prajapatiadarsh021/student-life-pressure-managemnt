"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { GLITCH_FLIP_CARDS } from "@/data/pressureData";
import { Eye, EyeOff, Smile, AlertTriangle, RefreshCw } from "lucide-react";
import { audioEngine } from "@/utils/audioSynth";

export const GlitchFlipCards: React.FC = () => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [revealAll, setRevealAll] = useState(false);

  const toggleFlip = (id: string) => {
    audioEngine.playGentleChime();
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleToggleAll = () => {
    audioEngine.playGentleChime();
    const nextState = !revealAll;
    setRevealAll(nextState);
    const newMap: Record<string, boolean> = {};
    GLITCH_FLIP_CARDS.forEach((c) => {
      newMap[c.id] = nextState;
    });
    setFlippedCards(newMap);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 flex flex-col justify-center min-h-[72vh] text-left">
      {/* Chapter Tag & Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-600/20 border border-red-500/40 text-red-400 mb-2">
            CHAPTER 03 • MASK VS. TRUTH
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-syne text-white">
            Say &ldquo;I&apos;m Fine&rdquo; vs. The Real Thought
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-1">
            Tap or hover each card to flip through the polite social mask and reveal the raw, unedited internal panic.
          </p>
        </div>

        <button
          onClick={handleToggleAll}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10 text-xs font-semibold tracking-wide transition-colors"
        >
          {revealAll ? (
            <>
              <EyeOff className="w-4 h-4 text-zinc-400" />
              <span>Reset Masks</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 text-red-400" />
              <span>Reveal All Truths</span>
            </>
          )}
        </button>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {GLITCH_FLIP_CARDS.map((item) => {
          const isFlipped = flippedCards[item.id] ?? false;

          return (
            <div
              key={item.id}
              onClick={() => toggleFlip(item.id)}
              className="perspective-1000 h-[340px] cursor-pointer group"
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 280, damping: 22 }}
                className="w-full h-full relative transform-style-3d"
              >
                {/* FRONT FACE: POLITE SOCIAL MASK */}
                <div className="absolute inset-0 backface-hidden rounded-2xl p-5 bg-[#141522] border border-white/10 shadow-lg flex flex-col justify-between hover:border-white/20 transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                        <Smile className="w-3 h-3" />
                        <span>POLITE MASK</span>
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono truncate max-w-[100px]">
                        {item.personaTarget}
                      </span>
                    </div>

                    <p className="text-base font-bold font-syne text-white leading-snug my-4">
                      {item.socialMask}
                    </p>

                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-[9px] uppercase font-mono text-zinc-400 block mb-0.5">
                        Context:
                      </span>
                      <p className="text-[11px] text-zinc-400 italic">
                        {item.maskContext}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400 group-hover:text-red-400 transition-colors">
                    <span>Click to flip truth</span>
                    <RefreshCw className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* BACK FACE: RAW UNEDITED INTERNAL MONOLOGUE */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl p-5 bg-gradient-to-br from-[#260f12] to-[#120a0d] border border-red-500/60 shadow-xl shadow-red-950/60 flex flex-col justify-between overflow-hidden">
                  <div className="scanline-overlay absolute inset-0 opacity-30 pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-600/30 text-red-300 border border-red-500/40 text-[10px] font-mono font-bold">
                        <AlertTriangle className="w-3 h-3 text-red-400" />
                        <span>RAW TRUTH</span>
                      </span>
                      <span className="text-[10px] text-red-400 font-mono">DECODED</span>
                    </div>

                    <p className="text-xs sm:text-sm font-medium text-red-100 leading-relaxed my-2">
                      &ldquo;{item.realThought}&rdquo;
                    </p>

                    <div className="p-2 rounded-xl bg-black/50 border border-red-900/50 mt-2">
                      <span className="text-[9px] uppercase font-mono text-red-400 block mb-0.5">
                        Root Fear:
                      </span>
                      <p className="text-[11px] text-zinc-300">{item.rootFear}</p>
                    </div>
                  </div>

                  <div className="relative z-10 pt-2 border-t border-red-900/40 flex items-center justify-between text-[11px] text-red-400">
                    <span>Click to restore mask</span>
                    <RefreshCw className="w-3 h-3" />
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

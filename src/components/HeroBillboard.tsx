"use client";

import React from "react";
import { motion } from "framer-motion";
import { PersonaId } from "@/types";
import { PERSONAS } from "@/data/pressureData";
import {
  Play,
  ArrowRight,
  Flame,
  ShieldAlert,
  TrendingUp,
  Clock,
  Sparkles,
  Quote,
} from "lucide-react";

interface HeroBillboardProps {
  currentPersona: PersonaId;
  onOpenPersonaModal: () => void;
  onNextSlide: () => void;
}

export const HeroBillboard: React.FC<HeroBillboardProps> = ({
  currentPersona,
  onOpenPersonaModal,
  onNextSlide,
}) => {
  const persona = PERSONAS[currentPersona] || PERSONAS.invisible;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col justify-center min-h-[72vh] text-left">
      {/* Top Tag & Profile Badge */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-600/20 border border-red-500/40 text-red-400">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>CHAPTER 01 • THE UNFILTERED TRUTH</span>
        </div>

        <button
          onClick={onOpenPersonaModal}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 transition-colors"
        >
          <span>Archetype:</span>
          <span className="font-semibold text-white">
            {persona.avatar} {persona.name}
          </span>
          <span className="text-[10px] text-zinc-400 underline ml-1">
            Change
          </span>
        </button>
      </div>

      {/* Cinematic Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-3"
      >
        <h1 className="font-bebas text-5xl sm:text-7xl md:text-8xl tracking-tight leading-[0.9] text-white">
          PRESSURE <span className="text-red-500">POINTS</span>
          <span className="block text-xl sm:text-3xl md:text-4xl font-syne font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-400 tracking-normal mt-2">
            The Truth About Student Life
          </span>
        </h1>

        <p className="text-xs sm:text-sm font-mono text-zinc-400 italic">
          &ldquo;{persona.heroQuote}&rdquo;
        </p>
      </motion.div>

      {/* Featured Core Quote Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mt-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#161724]/90 to-[#10111a]/90 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden"
      >
        <Quote className="w-10 h-10 text-red-500/15 absolute -top-1 -left-1 transform -rotate-12 pointer-events-none" />

        <p className="text-lg sm:text-2xl md:text-3xl font-medium font-syne text-zinc-100 leading-snug relative z-10">
          &ldquo;It&apos;s not just homework and exams. It&apos;s late nights,
          high expectations, comparison, self-doubt, and still having to
          smile and say <span className="text-red-400 underline decoration-red-500/40 font-bold">&apos;I&apos;m fine.&apos;</span>&rdquo;
        </p>

        <div className="mt-4 pt-4 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs sm:text-sm text-zinc-400">
          <p className="text-zinc-300">
            <strong className="text-white">The Mission:</strong> Break the silence on stress, academic pressure, and that constant race to be perfect. No boring lectures — just real stories and real solutions.
          </p>
        </div>
      </motion.div>

      {/* Primary Action Button */}
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          onClick={onNextSlide}
          className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-base transition-all shadow-xl shadow-red-700/30 group"
        >
          <Play className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
          <span>Begin Slide Journey</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
        </button>

        <span className="text-xs text-zinc-400 italic">
          Press &rarr; or click Next Chapter to step through.
        </span>
      </div>

      {/* 4 Clean Stats */}
      <div className="mt-10 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="text-xl sm:text-2xl font-bold font-syne text-red-400">92%</div>
          <p className="text-[11px] text-zinc-400">Chronic academic stress</p>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold font-syne text-amber-400">78%</div>
          <p className="text-[11px] text-zinc-400">Mask with &ldquo;I&apos;m fine&rdquo;</p>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold font-syne text-cyan-400">84%</div>
          <p className="text-[11px] text-zinc-400">Imposter comparison</p>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold font-syne text-purple-400">1 in 3</div>
          <p className="text-[11px] text-zinc-400">&lt;5 hrs sleep before tests</p>
        </div>
      </div>
    </div>
  );
};

"use client";

import React, { useState } from "react";
import { PersonaId } from "@/types";
import { PERSONAS } from "@/data/pressureData";
import {
  Flame,
  Volume2,
  VolumeX,
  LifeBuoy,
} from "lucide-react";
import { audioEngine } from "@/utils/audioSynth";

interface NavbarProps {
  currentPersona: PersonaId;
  onOpenPersonaModal: () => void;
  currentSlide: number;
  totalSlides: number;
  slides: { id: string; label: string }[];
  onGoToSlide: (index: number) => void;
  onNextSlide: () => void;
  onPrevSlide: () => void;
  onOpenHelpline: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPersona,
  onOpenPersonaModal,
  currentSlide,
  totalSlides,
  slides,
  onGoToSlide,
  onOpenHelpline,
}) => {
  const [soundMode, setSoundMode] = useState<"rain" | "lofi" | "clock" | "off">("off");
  const persona = PERSONAS[currentPersona] || PERSONAS.invisible;

  const cycleSound = () => {
    const nextMode =
      soundMode === "off"
        ? "rain"
        : soundMode === "rain"
        ? "lofi"
        : soundMode === "lofi"
        ? "clock"
        : "off";
    setSoundMode(nextMode);
    audioEngine.play(nextMode);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0a0c]/90 backdrop-blur-2xl border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onGoToSlide(0)}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 text-red-500 group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4 fill-red-500 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
            </div>
            <div>
              <span className="font-bebas text-xl sm:text-2xl tracking-wider text-white flex items-center gap-1">
                PRESSURE<span className="text-red-500">POINTS</span>
              </span>
            </div>
          </button>
        </div>

        {/* Center: Slide Progress & Chapter Dots */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 p-1.5 rounded-full">
            {slides.map((s, idx) => {
              const isActive = currentSlide === idx;
              return (
                <button
                  key={s.id}
                  onClick={() => onGoToSlide(idx)}
                  className={`px-3 py-1 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-red-600 text-white font-bold shadow-md shadow-red-900/50"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="text-[10px] opacity-70">0{idx + 1}</span>
                  <span className="hidden xl:inline">{s.label.replace(/^\d+\.\s*/, "")}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile / Compact Slide indicator */}
        <div className="lg:hidden flex items-center gap-2 text-xs font-mono bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
          <span className="text-red-400 font-bold">0{currentSlide + 1}</span>
          <span className="text-zinc-500">/</span>
          <span className="text-zinc-400">0{totalSlides}</span>
          <span className="text-zinc-300 font-sans font-medium truncate max-w-[100px]">
            {slides[currentSlide]?.label.replace(/^\d+\.\s*/, "")}
          </span>
        </div>

        {/* Right Controls: Persona Switcher, Sound, Crisis */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Ambient Sound Button */}
          <button
            onClick={cycleSound}
            title={`Ambient Audio: ${soundMode.toUpperCase()}`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              soundMode !== "off"
                ? "bg-cyan-950/60 text-cyan-300 border-cyan-500/40 shadow-sm"
                : "bg-white/5 text-zinc-400 hover:text-white border-white/10"
            }`}
          >
            {soundMode !== "off" ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
                <span className="capitalize text-[11px] hidden sm:inline">
                  {soundMode}
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">Sound</span>
              </>
            )}
          </button>

          {/* Active Persona Pill */}
          <button
            onClick={onOpenPersonaModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-xs"
            title="Change active student archetype"
          >
            <span className="text-sm leading-none">{persona.avatar}</span>
            <span className="hidden sm:inline font-semibold text-white max-w-[100px] truncate">
              {persona.name}
            </span>
          </button>

          {/* Crisis Helpline Modal Popup Trigger */}
          <button
            onClick={onOpenHelpline}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-400 hover:text-red-300 text-xs font-semibold transition-all shadow-md"
            title="Open 24/7 Student Helpline"
          >
            <LifeBuoy className="w-3.5 h-3.5 animate-pulse" />
            <span>Helpline</span>
          </button>
        </div>
      </div>
    </header>
  );
};

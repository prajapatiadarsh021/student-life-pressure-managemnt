"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PersonaId } from "@/types";
import { PersonaSelectModal } from "@/components/PersonaSelectModal";
import { HelplineModal } from "@/components/HelplineModal";
import { Navbar } from "@/components/Navbar";
import { HeroBillboard } from "@/components/HeroBillboard";
import { EpisodesCarousel } from "@/components/EpisodesCarousel";
import { GlitchFlipCards } from "@/components/GlitchFlipCards";
import { VentingChamber } from "@/components/VentingChamber";
import { StressMoodShift } from "@/components/StressMoodShift";
import { RealityCheckCalculator } from "@/components/RealityCheckCalculator";
import { SevenDayHorizon } from "@/components/SevenDayHorizon";
import { BoxBreathingAnchor } from "@/components/BoxBreathingAnchor";
import { PowerClimaxFooter } from "@/components/PowerClimaxFooter";
import { AmbientSoundBar } from "@/components/AmbientSoundBar";
import { StudentChatBot } from "@/components/StudentChatBot";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { audioEngine } from "@/utils/audioSynth";

const SLIDES = [
  { id: "hero", label: "01. The Truth" },
  { id: "episodes", label: "02. Reality Episodes" },
  { id: "masks", label: "03. Mask vs. Truth" },
  { id: "burn", label: "04. Burn Chamber" },
  { id: "stress", label: "05. Stress Dial" },
  { id: "reality", label: "06. Reality Check" },
  { id: "horizon", label: "07. 7-Day Horizon" },
  { id: "breathing", label: "08. Box Breathing" },
  { id: "power", label: "09. Power Vault" },
];

export default function Home() {
  const [currentPersona, setCurrentPersona] = useState<PersonaId>("invisible");
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const [isHelplineOpen, setIsHelplineOpen] = useState(false);
  const [stressLevel, setStressLevel] = useState<number>(3);
  const [hasChosenInitialPersona, setHasChosenInitialPersona] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Show profile selection on initial visit
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasChosenInitialPersona) {
        setIsPersonaModalOpen(true);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [hasChosenInitialPersona]);

  const handleSelectPersona = (id: PersonaId) => {
    setCurrentPersona(id);
    setHasChosenInitialPersona(true);
    setIsPersonaModalOpen(false);
  };

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < SLIDES.length) {
      setDirection(index > currentSlide ? 1 : -1);
      setCurrentSlide(index);
      audioEngine.playGentleChime();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentSlide]);

  const nextSlide = useCallback(() => {
    if (currentSlide < SLIDES.length - 1) {
      goToSlide(currentSlide + 1);
    }
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  }, [currentSlide, goToSlide]);

  // Keyboard navigation support: Left / Right arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === "ArrowRight") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#f1f1f5] flex flex-col justify-between selection:bg-rose-600/30 selection:text-white overflow-x-hidden">
      {/* Persona Gate / Selection Modal */}
      <PersonaSelectModal
        isOpen={isPersonaModalOpen}
        onClose={() => setIsPersonaModalOpen(false)}
        selectedPersonaId={currentPersona}
        onSelectPersona={handleSelectPersona}
        isInitialGate={!hasChosenInitialPersona}
      />

      {/* Dedicated Helpline Popup Modal */}
      <HelplineModal
        isOpen={isHelplineOpen}
        onClose={() => setIsHelplineOpen(false)}
      />

      {/* Top Presentation Navbar */}
      <Navbar
        currentPersona={currentPersona}
        onOpenPersonaModal={() => setIsPersonaModalOpen(true)}
        currentSlide={currentSlide}
        totalSlides={SLIDES.length}
        slides={SLIDES}
        onGoToSlide={goToSlide}
        onNextSlide={nextSlide}
        onPrevSlide={prevSlide}
        onOpenHelpline={() => setIsHelplineOpen(true)}
      />

      {/* Main Single-Slide Stage with Smooth Transition */}
      <main className="flex-1 flex flex-col justify-center items-center relative py-4 sm:py-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {currentSlide === 0 && (
              <HeroBillboard
                currentPersona={currentPersona}
                onOpenPersonaModal={() => setIsPersonaModalOpen(true)}
                onNextSlide={nextSlide}
              />
            )}

            {currentSlide === 1 && (
              <EpisodesCarousel currentPersona={currentPersona} />
            )}

            {currentSlide === 2 && <GlitchFlipCards />}

            {currentSlide === 3 && <VentingChamber />}

            {currentSlide === 4 && (
              <StressMoodShift
                stressLevel={stressLevel}
                onStressChange={setStressLevel}
                onNextSlide={nextSlide}
              />
            )}

            {currentSlide === 5 && <RealityCheckCalculator />}

            {currentSlide === 6 && <SevenDayHorizon />}

            {currentSlide === 7 && <BoxBreathingAnchor />}

            {currentSlide === 8 && (
              <PowerClimaxFooter
                onOpenHelpline={() => setIsHelplineOpen(true)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Slide Deck Bottom Dock Bar */}
      <footer className="sticky bottom-0 z-30 w-full bg-[#0a0a0c]/90 backdrop-blur-2xl border-t border-white/10 py-3 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed border border-white/5 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous Chapter</span>
          </button>

          {/* Current Chapter Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-400">
              Chapter <strong className="text-white font-bold">{currentSlide + 1}</strong> of {SLIDES.length}
            </span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="text-xs font-medium text-red-400 hidden sm:inline">
              {SLIDES[currentSlide]?.label.replace(/^\d+\.\s*/, "")}
            </span>
          </div>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            disabled={currentSlide === SLIDES.length - 1}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md shadow-red-900/30"
          >
            <span className="hidden sm:inline">Next Chapter</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>

      {/* Floating Ambient Focus Sound Bar (Bottom-Right) */}
      <AmbientSoundBar />

      {/* Floating Student AI Chat Bot & Mood Anchor (Bottom-Left) */}
      <StudentChatBot
        currentPersona={currentPersona}
        stressLevel={stressLevel}
      />
    </div>
  );
}

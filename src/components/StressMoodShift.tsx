"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, Heart, ArrowDownCircle, AlertOctagon } from "lucide-react";
import { audioEngine } from "@/utils/audioSynth";

interface StressMoodShiftProps {
  stressLevel: number;
  onStressChange: (lvl: number) => void;
  onNextSlide?: () => void;
}

const STRESS_DATA = [
  {
    level: 1,
    name: "Mild Tension",
    bpm: 72,
    color: "#06b6d4",
    bgClass: "from-cyan-950/30 to-emerald-950/20",
    borderClass: "border-cyan-500/30",
    symptom: "Normal pre-deadline alertness. Low-grade focus friction.",
    immediateTriage: [
      "Stand up and do a 30-second shoulder roll.",
      "Drink a full 8 oz glass of cool water.",
      "Pick ONE single task and ignore everything else for 25 mins.",
    ],
    alertQuote: "You are alert and capable. Maintain steady pacing.",
  },
  {
    level: 2,
    name: "Simmering Anxiety",
    bpm: 86,
    color: "#eab308",
    bgClass: "from-amber-950/30 to-yellow-950/20",
    borderClass: "border-amber-500/30",
    symptom: "Multiple mental tabs open. Feeling rushed even when sitting still.",
    immediateTriage: [
      "Close all browser tabs unrelated to your current assignment.",
      "Place both feet flat on the floor; feel the solid support.",
      "Switch to low-stimulus lighting; dim screen brightness.",
    ],
    alertQuote: "Your mind is trying to multitask too fast. Slow down the input.",
  },
  {
    level: 3,
    name: "High-Pressure Zone",
    bpm: 104,
    color: "#f97316",
    bgClass: "from-orange-950/40 to-red-950/30",
    borderClass: "border-orange-500/40",
    symptom: "Shallow breathing, clenched jaw, racing worry loops about failure.",
    immediateTriage: [
      "Notice your jaw and un-clench your teeth right now.",
      "Inhale for 4 seconds, exhale slowly for 6 seconds.",
      "Tell yourself: 'No one is grading my next breath.'",
    ],
    alertQuote: "Adrenaline is spiking. Do not make catastrophic predictions right now.",
  },
  {
    level: 4,
    name: "Critical Strain",
    bpm: 125,
    color: "#ef4444",
    bgClass: "from-red-950/60 to-rose-950/40",
    borderClass: "border-red-500/50",
    symptom: "Chest tightness, tunnel vision, feeling trapped in the room.",
    immediateTriage: [
      "Physically step away from your desk for 3 minutes.",
      "Wash your face with cold water (activates dive reflex reset).",
      "Text a trusted friend: 'Studying is overwhelming me right now.'",
    ],
    alertQuote: "Your nervous system is interpreting an exam as a physical threat. Step back.",
  },
  {
    level: 5,
    name: "System Overload",
    bpm: 140,
    color: "#dc2626",
    bgClass: "from-rose-950/80 to-black",
    borderClass: "border-red-600 shadow-red-900/50 shadow-2xl",
    symptom: "Near-freeze state, trembling, panic attack symptoms, total paralysis.",
    immediateTriage: [
      "EMERGENCY PROTOCOL: Stop studying immediately. The paper can wait.",
      "Sit on the floor, back against a solid wall. 5-4-3-2-1 Sensory grounding.",
      "Call or text 988 for free, compassionate, 24/7 student support.",
    ],
    alertQuote: "Full freeze state detected. Human survival precedes any academic assignment.",
  },
];

export const StressMoodShift: React.FC<StressMoodShiftProps> = ({
  stressLevel,
  onStressChange,
}) => {
  const currentData =
    STRESS_DATA.find((s) => s.level === stressLevel) || STRESS_DATA[0];

  const handleLevelSelect = (lvl: number) => {
    onStressChange(lvl);
    audioEngine.playGentleChime();
  };

  const handleDeEscalate = () => {
    onStressChange(1);
    audioEngine.playGentleChime();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col justify-center min-h-[72vh] text-left">
      {/* Chapter Tag & Header */}
      <div className="space-y-2 mb-6 text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-600/20 border border-red-500/40 text-red-400">
          <Activity className="w-3.5 h-3.5" />
          <span>CHAPTER 05 • BIOMETRIC & STRESS SENSOR</span>
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-syne text-white">
          Interactive Stress Dial
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
          Tap your current internal tension level to see your physiological status and immediate triage actions.
        </p>
      </div>

      {/* Main Dial Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#13141f] border border-white/10 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
              Active Assessment:
            </span>
            <h3
              className="text-2xl font-bold font-syne"
              style={{ color: currentData.color }}
            >
              Level {currentData.level}: {currentData.name}
            </h3>
          </div>

          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-black/50 border border-white/10 self-start sm:self-auto font-mono text-xs">
            <Heart
              className="w-4 h-4 text-red-500 animate-pulse"
              style={{ animationDuration: `${60 / currentData.bpm}s` }}
            />
            <span className="text-zinc-400">PULSE:</span>
            <span className="text-white font-bold">{currentData.bpm} BPM</span>
          </div>
        </div>

        {/* 5-Step Dial Buttons */}
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((lvl) => {
            const step = STRESS_DATA[lvl - 1];
            const isActive = stressLevel === lvl;
            return (
              <button
                key={lvl}
                onClick={() => handleLevelSelect(lvl)}
                className={`py-3 px-1 rounded-xl text-center border font-mono transition-all ${
                  isActive
                    ? "ring-2 ring-white/30 font-bold scale-102"
                    : "bg-white/5 border-white/5 text-zinc-400 hover:text-white"
                }`}
                style={{
                  borderColor: isActive ? step.color : "rgba(255,255,255,0.08)",
                  backgroundColor: isActive ? `${step.color}25` : undefined,
                  color: isActive ? "#ffffff" : "#a1a1aa",
                }}
              >
                <div className="text-sm font-bold">LVL {lvl}</div>
                <div className="text-[9px] truncate hidden sm:block">{step.name}</div>
              </button>
            );
          })}
        </div>

        {/* Triage Prescription Card */}
        <motion.div
          key={currentData.level}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-5 rounded-2xl bg-gradient-to-br ${currentData.bgClass} border ${currentData.borderClass} space-y-3`}
        >
          <div className="flex items-center gap-2 text-xs font-mono font-semibold" style={{ color: currentData.color }}>
            <AlertOctagon className="w-4 h-4" />
            <span>SYMPTOM: {currentData.symptom}</span>
          </div>

          <p className="text-xs sm:text-sm italic text-zinc-100 font-medium">
            &ldquo;{currentData.alertQuote}&rdquo;
          </p>

          <div className="pt-2 border-t border-white/10 space-y-1.5">
            <span className="text-[10px] font-mono text-zinc-400 uppercase">Immediate Triage Protocol:</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {currentData.immediateTriage.map((step, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs text-zinc-200 flex items-start gap-2">
                  <span className="font-mono text-zinc-400 font-bold">0{idx + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {stressLevel > 1 && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleDeEscalate}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white"
              >
                <ArrowDownCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Reset to Level 1</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, CheckCircle } from "lucide-react";
import { audioEngine } from "@/utils/audioSynth";

export const RealityCheckCalculator: React.FC = () => {
  const [studyHours, setStudyHours] = useState(6);
  const [scrollHours, setScrollHours] = useState(3);
  const [sleepHours, setSleepHours] = useState(5);

  const distortionIndex = Math.min(
    100,
    Math.round(
      scrollHours * 16 +
        Math.max(0, (7 - sleepHours) * 10) +
        (studyHours > 8 ? (studyHours - 8) * 4 : 0)
    )
  );

  const getVerdict = () => {
    if (distortionIndex > 70) {
      return {
        title: "CRITICAL REALITY DISTORTION",
        color: "#ef4444",
        message:
          "You are comparing your raw, unfiltered behind-the-scenes struggles against everyone else's PR highlight reel. Your brain is running on fumes and consuming toxic career illusions.",
        prescriptions: [
          "Mute LinkedIn and peer feeds until exams finish.",
          "Sleep 90 minutes earlier tonight. Exhaustion magnifies self-doubt.",
          "Remember: Nobody posts their 90 rejected applications.",
        ],
      };
    } else if (distortionIndex > 40) {
      return {
        title: "ELEVATED COMPARISON NOISE",
        color: "#f97316",
        message:
          "You are losing focus by watching other people's fabricated timelines. Your actual study output is getting diluted by silent anxiety.",
        prescriptions: [
          "Set a 20-minute daily social media cap.",
          "Log your own small wins instead of comparing to peers.",
          "Prioritize 7 hours of non-negotiable sleep.",
        ],
      };
    } else {
      return {
        title: "GROUNDED PERSPECTIVE",
        color: "#10b981",
        message:
          "Your reality filters are relatively clear. You understand that your path is unique and external noise is mostly fiction.",
        prescriptions: [
          "Protect your current boundaries during crunch weeks.",
          "Continue viewing rest as essential fuel, not a luxury.",
          "Remind an overwhelmed friend that they are doing enough.",
        ],
      };
    }
  };

  const verdict = getVerdict();

  const handleSliderChange = (setter: (v: number) => void, val: number) => {
    setter(val);
    audioEngine.playGentleChime();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col justify-center min-h-[72vh] text-left">
      {/* Chapter Tag & Header */}
      <div className="space-y-2 mb-6 text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-600/20 border border-cyan-500/40 text-cyan-400">
          <Calculator className="w-3.5 h-3.5" />
          <span>CHAPTER 06 • COMPARISON DETOX</span>
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-syne text-white">
          The Reality Check Calculator
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
          Adjust your daily numbers to see how much of your panic is actual academic work vs. fabricated comparison noise.
        </p>
      </div>

      {/* Main Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#13141f] border border-white/10 shadow-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Slider 1: Study */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>STUDY / WORK</span>
              <span className="text-white font-bold">{studyHours} hrs/day</span>
            </div>
            <input
              type="range"
              min="0"
              max="14"
              value={studyHours}
              onChange={(e) => handleSliderChange(setStudyHours, Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Slider 2: Scrolling highlights */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>SCROLLING PEERS</span>
              <span className="text-red-400 font-bold">{scrollHours} hrs/day</span>
            </div>
            <input
              type="range"
              min="0"
              max="8"
              value={scrollHours}
              onChange={(e) => handleSliderChange(setScrollHours, Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
          </div>

          {/* Slider 3: Sleep */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>REST / SLEEP</span>
              <span className="text-emerald-400 font-bold">{sleepHours} hrs/night</span>
            </div>
            <input
              type="range"
              min="2"
              max="10"
              step="0.5"
              value={sleepHours}
              onChange={(e) => handleSliderChange(setSleepHours, Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>
        </div>

        {/* Dynamic Verdict Card */}
        <motion.div
          key={distortionIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#161726] to-[#10111a] border border-white/10 space-y-4"
        >
          <div className="flex items-center justify-between gap-4 pb-3 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                PERCEPTION DISTORTION SCORE
              </span>
              <h4 className="text-lg sm:text-xl font-bold font-syne" style={{ color: verdict.color }}>
                {verdict.title}
              </h4>
            </div>

            <div className="text-right">
              <span className="text-2xl font-bold font-syne" style={{ color: verdict.color }}>
                {distortionIndex}%
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/50 border border-white/5 text-xs sm:text-sm font-medium text-white italic">
            &ldquo;You are comparing your raw behind-the-scenes with everyone else&apos;s highlight reel.&rdquo;
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed">{verdict.message}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
            {verdict.prescriptions.map((p, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-white/5 text-[11px] text-zinc-300 flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{p}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

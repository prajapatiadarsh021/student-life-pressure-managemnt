"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Trash2, CheckCircle2, RotateCcw } from "lucide-react";
import { audioEngine } from "@/utils/audioSynth";

const PRESET_DOUBTS = [
  "I feel like everyone in lectures understands everything except me.",
  "I am terrified of failing and wasting my parents' hard-earned money.",
  "Everyone on LinkedIn is succeeding and I am falling hopelessly behind.",
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

export const VentingChamber: React.FC = () => {
  const [doubtText, setDoubtText] = useState("");
  const [isShredding, setIsShredding] = useState(false);
  const [isShredded, setIsShredded] = useState(false);
  const [shredCount, setShredCount] = useState(14892);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const startIncineration = () => {
    if (!doubtText.trim() || isShredding) return;

    setIsShredding(true);
    audioEngine.playGentleChime();

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const width = (canvas.width = canvas.offsetWidth);
        const height = (canvas.height = canvas.offsetHeight);

        const particles: Particle[] = [];
        const colors = ["#ef4444", "#f97316", "#eab308", "#ffffff", "#78716c"];

        for (let i = 0; i < 200; i++) {
          particles.push({
            x: Math.random() * width,
            y: height * 0.4 + Math.random() * (height * 0.4),
            vx: (Math.random() - 0.5) * 6,
            vy: -Math.random() * 8 - 2,
            size: Math.random() * 4 + 1.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1,
            decay: Math.random() * 0.015 + 0.01,
          });
        }

        let animationFrameId: number;
        const animate = () => {
          ctx.clearRect(0, 0, width, height);

          let activeParticles = 0;
          particles.forEach((p) => {
            if (p.alpha > 0) {
              activeParticles++;
              p.x += p.vx;
              p.y += p.vy;
              p.vy -= 0.05;
              p.alpha -= p.decay;

              ctx.save();
              ctx.globalAlpha = Math.max(0, p.alpha);
              ctx.fillStyle = p.color;
              ctx.shadowColor = p.color;
              ctx.shadowBlur = 8;
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
          });

          if (activeParticles > 0) {
            animationFrameId = requestAnimationFrame(animate);
          } else {
            ctx.clearRect(0, 0, width, height);
            setIsShredding(false);
            setIsShredded(true);
            setShredCount((prev) => prev + 1);
          }
        };

        animate();
      }
    } else {
      setTimeout(() => {
        setIsShredding(false);
        setIsShredded(true);
        setShredCount((prev) => prev + 1);
      }, 1500);
    }
  };

  const handleReset = () => {
    setIsShredded(false);
    setDoubtText("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col justify-center min-h-[72vh] text-center">
      {/* Chapter Tag & Header */}
      <div className="space-y-2 mb-6">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-orange-600/20 border border-orange-500/40 text-orange-400">
          <Flame className="w-3.5 h-3.5" />
          <span>CHAPTER 04 • PSYCHOLOGICAL DETOX</span>
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-syne text-white">
          Burn & Shred the Doubt
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
          Type an intrusive dread or imposter fear. Hit incinerate to dissolve it into digital embers and release the mental weight.
        </p>
      </div>

      {/* The Incinerator Chamber Card */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-[#13141f] border border-orange-500/30 shadow-2xl text-left overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-30" />

        <AnimatePresence mode="wait">
          {!isShredded ? (
            <motion.div key="input-stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2">
                  What intrusive thought are you carrying right now?
                </label>
                <div className="relative">
                  <textarea
                    rows={4}
                    disabled={isShredding}
                    value={doubtText}
                    onChange={(e) => setDoubtText(e.target.value)}
                    placeholder="e.g. 'I feel like I'm going to fail my midterm and prove everyone right that I don't belong here...'"
                    className={`w-full p-4 rounded-2xl bg-black/60 border text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition-all resize-none leading-relaxed font-sans ${
                      isShredding ? "border-red-500 blur-sm animate-pulse opacity-50" : "border-white/10 focus:border-orange-500/60"
                    }`}
                  />
                  {isShredding && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-xs rounded-2xl">
                      <span className="text-xs sm:text-sm font-mono text-orange-400 animate-pulse font-bold">
                        🔥 INCINERATING INTO EMBERS...
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Presets */}
              <div>
                <span className="text-[11px] font-mono text-zinc-500 block mb-1.5">Quick presets:</span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_DOUBTS.map((preset, idx) => (
                    <button
                      key={idx}
                      disabled={isShredding}
                      onClick={() => setDoubtText(preset)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-zinc-400 hover:text-zinc-200 border border-white/5 transition-colors text-left"
                    >
                      &ldquo;{preset}&rdquo;
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] text-zinc-500 italic">
                  Burned doubts: <strong className="text-orange-400 font-mono">{shredCount.toLocaleString()}</strong> worldwide.
                </span>
                <button
                  onClick={startIncineration}
                  disabled={!doubtText.trim() || isShredding}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:opacity-40 text-xs uppercase tracking-wider shadow-lg shadow-orange-950/40"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Shred & Dissolve</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="relief-stage" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-2xl font-bold font-syne text-white">Doubt Obliterated</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  You are not your grades, your resume, or your worst day. Take a slow, cleansing breath.
                </p>
              </div>
              <button onClick={handleReset} className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Burn Another Dread</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

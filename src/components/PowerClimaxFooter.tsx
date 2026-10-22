"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { POWER_AFFIRMATIONS } from "@/data/pressureData";
import { PowerAffirmation } from "@/types";
import {
  Sparkles,
  Share2,
  Copy,
  CheckCircle,
  Download,
  LifeBuoy,
  RefreshCw,
  PhoneCall,
} from "lucide-react";
import { audioEngine } from "@/utils/audioSynth";

interface PowerClimaxFooterProps {
  onOpenHelpline?: () => void;
}

export const PowerClimaxFooter: React.FC<PowerClimaxFooterProps> = ({
  onOpenHelpline,
}) => {
  const [currentAffirmation, setCurrentAffirmation] = useState<PowerAffirmation>(
    POWER_AFFIRMATIONS[0]
  );
  const [cardIndex, setCardIndex] = useState(0);
  const [copyStatus, setCopyStatus] = useState(false);
  const [shareStatus, setShareStatus] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const drawToken = () => {
    audioEngine.playGentleChime();
    const nextIdx = (cardIndex + 1) % POWER_AFFIRMATIONS.length;
    setCardIndex(nextIdx);
    setCurrentAffirmation(POWER_AFFIRMATIONS[nextIdx]);

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#10b981", "#a855f7", "#06b6d4", "#f59e0b", "#ec4899"],
    });
  };

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(`"${currentAffirmation.body}" — PRESSURE POINTS`);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  const handleShareToFriend = () => {
    const text =
      "Hey, saw this and thought of you. Whenever student life or exams feel overwhelming, check this out: " +
      window.location.href;

    if (navigator.share) {
      navigator.share({
        title: "PRESSURE POINTS: The Truth About Student Life",
        text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setShareStatus(true);
      setTimeout(() => setShareStatus(false), 2000);
    }
  };

  const handleDownloadCard = () => {
    setDownloading(true);
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 1080, 1350);
      grad.addColorStop(0, "#0a0a0f");
      grad.addColorStop(0.5, "#151828");
      grad.addColorStop(1, "#0d1f18");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1350);

      ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
      ctx.lineWidth = 12;
      ctx.strokeRect(40, 40, 1000, 1270);

      ctx.fillStyle = "#10b981";
      ctx.font = "bold 32px sans-serif";
      ctx.fillText("PRESSURE POINTS • POWER TOKEN", 80, 140);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 64px sans-serif";
      ctx.fillText(currentAffirmation.title, 80, 240);

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "400 42px sans-serif";
      const words = currentAffirmation.body.split(" ");
      let line = "";
      let y = 380;
      const maxWidth = 900;
      const lineHeight = 65;

      words.forEach((word) => {
        const testLine = line + word + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && line !== "") {
          ctx.fillText(line, 80, y);
          line = word + " ";
          y += lineHeight;
        } else {
          line = testLine;
        }
      });
      ctx.fillText(line, 80, y);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "italic 32px sans-serif";
      ctx.fillText(`“${currentAffirmation.authorNote}”`, 80, y + 100);

      ctx.fillStyle = "#64748b";
      ctx.font = "28px sans-serif";
      ctx.fillText("Come for the pressure, leave with the power.", 80, 1230);

      const link = document.createElement("a");
      link.download = `pressure-points-${currentAffirmation.title.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
    setDownloading(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col justify-center min-h-[72vh] text-left space-y-6">
      {/* Chapter Tag & Header */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600/20 border border-emerald-500/40 text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>CHAPTER 09 • THE CLIMAX TRANSITION</span>
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold font-syne text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300">
          Come for the Pressure, Leave with the Power
        </h2>
        <p className="text-xs sm:text-sm text-zinc-300 max-w-lg mx-auto">
          Student life is not easy — but you don&apos;t have to face it alone. Draw your power token below.
        </p>
      </div>

      {/* Affirmation Card Deck */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#121c18] via-[#101720] to-[#161224] border border-emerald-500/30 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
            POWER TOKEN #{cardIndex + 1} • {currentAffirmation.theme}
          </span>
          <button
            onClick={drawToken}
            className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full border border-white/10"
          >
            <RefreshCw className="w-3 h-3 text-emerald-400" />
            <span>Draw Another</span>
          </button>
        </div>

        <div className="space-y-1">
          <h3 className="text-xl sm:text-2xl font-bold font-syne text-white">{currentAffirmation.title}</h3>
          <p className="text-sm sm:text-base text-zinc-200 italic leading-relaxed">
            &ldquo;{currentAffirmation.body}&rdquo;
          </p>
          <p className="text-xs text-zinc-400 font-mono pt-1">Note: {currentAffirmation.authorNote}</p>
        </div>

        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyQuote}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-200 border border-white/10"
            >
              {copyStatus ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copyStatus ? "Copied" : "Copy Quote"}</span>
            </button>
            <button
              onClick={handleDownloadCard}
              disabled={downloading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save Wallpaper</span>
            </button>
          </div>

          <button
            onClick={drawToken}
            className="px-5 py-2 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 text-xs tracking-wide shadow-md"
          >
            Draw Power Token ✨
          </button>
        </div>
      </div>

      {/* Clean Bottom Support Action Bar (No dense lifeline cards) */}
      <div className="p-4 rounded-2xl bg-[#13141f] border border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <LifeBuoy className="w-4 h-4 text-red-400" />
          <span className="text-xs font-medium text-zinc-300">
            Carrying overwhelming pressure? We have free, confidential support available.
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {onOpenHelpline && (
            <button
              onClick={onOpenHelpline}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-bold transition-all shadow-md"
            >
              <PhoneCall className="w-3.5 h-3.5 text-red-400" />
              <span>Open Student Helpline</span>
            </button>
          )}

          <button
            onClick={handleShareToFriend}
            className="flex items-center gap-1.5 text-xs text-cyan-300 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 px-3.5 py-2 rounded-xl transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{shareStatus ? "Copied Link!" : "Send to a Friend"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

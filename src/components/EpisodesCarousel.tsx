"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PRESSURE_EPISODES,
  ANTIDOTES,
  ANONYMOUS_VOICES,
  PERSONAS,
} from "@/data/pressureData";
import {
  PersonaId,
  PressureEpisode,
  AntidotePowerMove,
  AnonymousVoice,
} from "@/types";
import {
  Play,
  CheckCircle,
  Copy,
  Heart,
  Volume2,
  X,
  Zap,
  PlusCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { audioEngine } from "@/utils/audioSynth";

interface EpisodesCarouselProps {
  currentPersona: PersonaId;
}

type TabMode = "pressure" | "antidotes" | "voices";

export const EpisodesCarousel: React.FC<EpisodesCarouselProps> = ({
  currentPersona,
}) => {
  const [activeTab, setActiveTab] = useState<TabMode>("pressure");
  const [selectedEpisode, setSelectedEpisode] = useState<PressureEpisode | null>(null);
  const [selectedAntidote, setSelectedAntidote] = useState<AntidotePowerMove | null>(null);
  const [confessions, setConfessions] = useState<AnonymousVoice[]>(ANONYMOUS_VOICES);
  const [relatesMap, setRelatesMap] = useState<Record<string, number>>(
    ANONYMOUS_VOICES.reduce((acc, v) => ({ ...acc, [v.id]: v.initialRelates }), {})
  );
  const [userVoted, setUserVoted] = useState<Record<string, boolean>>({});
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [newConfessionText, setNewConfessionText] = useState("");
  const [newConfessionMajor, setNewConfessionMajor] = useState("");
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const activePersonaObj = PERSONAS[currentPersona] || PERSONAS.invisible;

  const handleVote = (id: string) => {
    if (userVoted[id]) return;
    setUserVoted((prev) => ({ ...prev, [id]: true }));
    setRelatesMap((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    audioEngine.playGentleChime();
  };

  const playVoiceClip = (id: string) => {
    if (playingVoiceId === id) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(id);
      audioEngine.playGentleChime();
      setTimeout(() => setPlayingVoiceId(null), 4000);
    }
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(id);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const handleAddConfession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConfessionText.trim()) return;

    const newVoice: AnonymousVoice = {
      id: `v-custom-${Date.now()}`,
      author: "Fellow Student",
      major: newConfessionMajor || "Undeclared",
      text: newConfessionText,
      category: "Academic",
      initialRelates: 1,
      timestamp: "Just now",
      hasAudioClip: true,
    };

    setConfessions([newVoice, ...confessions]);
    setRelatesMap((prev) => ({ ...prev, [newVoice.id]: 1 }));
    setNewConfessionText("");
    setNewConfessionMajor("");
    setIsSubmitModalOpen(false);
    audioEngine.playGentleChime();
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 flex flex-col justify-center min-h-[72vh] text-left">
      {/* Chapter Tag & Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-600/20 border border-red-500/40 text-red-400 mb-2">
            CHAPTER 02 • STREAMING ARCHIVE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-syne text-white">
            Episodes of Reality
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-1">
            Stream the chapters of student friction, actionable antidotes, and real anonymous confessions.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/5 border border-white/10 self-start md:self-auto">
          <button
            onClick={() => {
              setActiveTab("pressure");
              audioEngine.playGentleChime();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
              activeTab === "pressure"
                ? "bg-red-600 text-white font-bold shadow-md shadow-red-950/40"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            01. Pressure Episodes
          </button>
          <button
            onClick={() => {
              setActiveTab("antidotes");
              audioEngine.playGentleChime();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
              activeTab === "antidotes"
                ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950/40"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            02. Power Antidotes
          </button>
          <button
            onClick={() => {
              setActiveTab("voices");
              audioEngine.playGentleChime();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
              activeTab === "voices"
                ? "bg-cyan-600 text-white font-bold shadow-md shadow-cyan-950/40"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            03. Student Voices
          </button>
        </div>
      </div>

      {/* TAB 1: PRESSURE EPISODES */}
      {activeTab === "pressure" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRESSURE_EPISODES.map((ep) => {
            const isRecommended = activePersonaObj.recommendedEpisodes.includes(ep.id);
            return (
              <motion.div
                key={ep.id}
                whileHover={{ y: -4, scale: 1.01 }}
                onClick={() => setSelectedEpisode(ep)}
                className={`p-5 rounded-2xl cursor-pointer border transition-all flex flex-col justify-between ${
                  isRecommended
                    ? "bg-[#181926] border-red-500/50 shadow-xl shadow-red-950/30"
                    : "bg-[#12131c] border-white/10 hover:border-white/20"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded">
                      EP {ep.episodeNumber}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400">{ep.duration}</span>
                  </div>

                  <h3 className="font-bold text-base text-white mb-1">{ep.title}</h3>
                  <p className="text-[11px] text-red-300/80 mb-2">{ep.tag}</p>
                  <p className="text-xs text-zinc-400 line-clamp-3 mb-4 leading-relaxed">
                    {ep.synopsis}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-mono text-[11px]">{ep.matchScore}% Match</span>
                  <span className="flex items-center gap-1 font-semibold text-white">
                    <span>Deep Dive</span>
                    <Play className="w-3 h-3 fill-current" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* TAB 2: ANTIDOTES / POWER MOVES */}
      {activeTab === "antidotes" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ANTIDOTES.map((antidote) => (
            <motion.div
              key={antidote.id}
              whileHover={{ y: -4, scale: 1.01 }}
              onClick={() => setSelectedAntidote(antidote)}
              className="p-5 rounded-2xl cursor-pointer border bg-[#111815] border-emerald-500/30 hover:border-emerald-500/50 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">
                    POWER {antidote.number}
                  </span>
                  <span className="text-[11px] text-zinc-400">{antidote.timeToImplement}</span>
                </div>

                <h3 className="font-bold text-base text-white mb-1">{antidote.title}</h3>
                <p className="text-[11px] text-emerald-300/80 mb-2">{antidote.category}</p>
                <p className="text-xs text-zinc-300 leading-relaxed italic mb-4">
                  &ldquo;{antidote.mantra}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                <span className="text-zinc-400 text-[11px] font-mono">{antidote.impactScore}</span>
                <span className="flex items-center gap-1">
                  <span>View Steps</span>
                  <Zap className="w-3 h-3 fill-current" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* TAB 3: ANONYMOUS VOICES */}
      {activeTab === "voices" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Share Anonymous Confession</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {confessions.slice(0, 3).map((voice) => {
              const isPlaying = playingVoiceId === voice.id;
              const hasVoted = userVoted[voice.id];
              const count = relatesMap[voice.id] || voice.initialRelates;

              return (
                <div key={voice.id} className="p-5 rounded-2xl bg-[#121420] border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-zinc-200">{voice.author}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">{voice.major}</span>
                    </div>

                    <button
                      onClick={() => playVoiceClip(voice.id)}
                      className="w-full py-1.5 px-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs font-mono text-zinc-400 mb-3"
                    >
                      <span className="flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{isPlaying ? "Simulating audio..." : "Listen Audio Memo"}</span>
                      </span>
                    </button>

                    <p className="text-xs text-zinc-300 italic leading-relaxed mb-4">
                      &ldquo;{voice.text}&rdquo;
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleVote(voice.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-colors ${
                        hasVoted ? "bg-rose-500/20 text-rose-300 border border-rose-500/40" : "bg-white/5 text-zinc-400 hover:text-rose-400"
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${hasVoted ? "fill-rose-500" : ""}`} />
                      <span>{count} felt this</span>
                    </button>
                    <button onClick={() => copyText(voice.text, voice.id)} className="text-zinc-500 hover:text-white">
                      {copyFeedback === voice.id ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* EPISODE DEEP DIVE MODAL */}
      <AnimatePresence>
        {selectedEpisode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-xl p-6 rounded-3xl bg-[#141522] border border-red-500/40 shadow-2xl text-left relative">
              <button onClick={() => setSelectedEpisode(null)} className="absolute top-5 right-5 p-2 rounded-full bg-white/5 text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono text-red-400">EPISODE {selectedEpisode.episodeNumber} • {selectedEpisode.duration}</span>
              <h3 className="text-2xl font-bold font-syne text-white mt-1 mb-3">{selectedEpisode.title}</h3>

              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 mb-4 text-xs italic text-zinc-200">
                &ldquo;{selectedEpisode.quote}&rdquo;
              </div>

              <div className="space-y-2 mb-4">
                <span className="text-[11px] font-mono text-zinc-400 uppercase">Physiological Mechanism:</span>
                {selectedEpisode.breakdown.map((b, i) => (
                  <p key={i} className="text-xs text-zinc-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                    <span>{b}</span>
                  </p>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200">
                <strong>Immediate Survival Step:</strong> {selectedEpisode.survivalStep}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ANTIDOTE MODAL */}
      <AnimatePresence>
        {selectedAntidote && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-xl p-6 rounded-3xl bg-[#111915] border border-emerald-500/40 shadow-2xl text-left relative">
              <button onClick={() => setSelectedAntidote(null)} className="absolute top-5 right-5 p-2 rounded-full bg-white/5 text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono text-emerald-400">POWER MOVE {selectedAntidote.number} • {selectedAntidote.timeToImplement}</span>
              <h3 className="text-2xl font-bold font-syne text-white mt-1 mb-2">{selectedAntidote.title}</h3>
              <p className="text-xs text-emerald-200 mb-4">{selectedAntidote.tagline}</p>

              <div className="space-y-2 mb-4">
                {selectedAntidote.protocol.map((step, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-zinc-200 flex items-start gap-2">
                    <span className="font-mono text-emerald-400 font-bold">{idx + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-emerald-500/30 flex items-center justify-between">
                <span className="text-xs italic text-white font-medium">&ldquo;{selectedAntidote.mantra}&rdquo;</span>
                <button onClick={() => copyText(selectedAntidote.mantra, selectedAntidote.id)} className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-mono">
                  {copyFeedback === selectedAntidote.id ? "Copied" : "Copy"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

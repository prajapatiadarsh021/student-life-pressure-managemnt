"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  RotateCcw,
  AlertTriangle,
  Heart,
  ChevronDown,
  Minimize2,
  PhoneCall,
  CheckCircle,
  Zap,
  Flame,
  LifeBuoy,
  Calendar,
  Clock,
  Check,
  Copy,
  Coffee,
  Sun,
  ListTodo,
} from "lucide-react";
import { ChatMessage, ChatMode, StudentMood, ScheduleBlock } from "@/types/chat";
import { PersonaId } from "@/types";
import { PERSONAS } from "@/data/pressureData";
import {
  CHAT_MODES,
  QUICK_PROMPTS,
} from "@/data/chatKnowledgeBase";
import { audioEngine } from "@/utils/audioSynth";

interface StudentChatBotProps {
  currentPersona: PersonaId;
  stressLevel: number;
}

export const StudentChatBot: React.FC<StudentChatBotProps> = ({
  currentPersona,
  stressLevel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ChatMode>("vent");
  const [currentMood, setCurrentMood] = useState<StudentMood | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedPlanId, setCopiedPlanId] = useState<string | null>(null);

  const persona = PERSONAS[currentPersona] || PERSONAS.invisible;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-welcome",
      role: "assistant",
      timestamp: "Just now",
      content: `Hey there. I'm your Pressure Companion. I know student life isn't just homework — it's the late nights, the silent comparisons, and pretending to be fine.\n\nWhether you need to vent without getting lectures, calm pre-exam panic, or untangle an intrusive thought, I'm here. How are you holding up right now?`,
      mode: "vent",
      groundingAnchor: "Take a slow breath. You don't have to perform or prove anything here.",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isTyping) return;

    audioEngine.playGentleChime();

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          mode,
          personaId: currentPersona,
          stressLevel,
          history: messages.slice(-6),
        }),
      });

      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content:
          data.reply ||
          "I hear you. The pressure you are carrying is real. Take it one breath at a time.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isCrisis: data.isCrisis,
        mode: data.mode || mode,
        thoughtDistortion: data.thoughtDistortion,
        actionSteps: data.actionSteps,
        groundingAnchor: data.groundingAnchor,
        dailySchedule: data.dailySchedule,
      };

      setMessages((prev) => [...prev, botMsg]);
      audioEngine.playGentleChime();
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `a-err-${Date.now()}`,
        role: "assistant",
        content:
          mode === "plan"
            ? "Here is an emergency energy-managed schedule for today: 50 min high-priority focus, 15 min rest, 50 min execution, and a strict shutdown."
            : "I hear how intense things feel right now. Remember: Done is better than perfect, and no single deadline defines your human worth. Take a deep breath.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        mode,
        dailySchedule:
          mode === "plan"
            ? [
                {
                  time: "09:00 - 10:15 AM",
                  activity: "Block 1: High-Yield Deep Work (Tackle hardest task first)",
                  type: "deep",
                },
                {
                  time: "10:15 - 10:45 AM",
                  activity: "Vagus Nerve Recovery (Screen-free walk + cold water)",
                  type: "rest",
                },
                {
                  time: "10:45 - 12:00 PM",
                  activity: "Block 2: Problem Solving / Writing Sprint",
                  type: "deep",
                },
                {
                  time: "12:00 - 12:30 PM",
                  activity: "Daily Closeout & Mandatory Hard Shutdown",
                  type: "review",
                },
              ]
            : undefined,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPrompt = (promptText: string, promptMode: ChatMode) => {
    setMode(promptMode);
    handleSendMessage(promptText);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `m-reset-${Date.now()}`,
        role: "assistant",
        timestamp: "Just now",
        content: `Conversation reset. I'm ready whenever you are. What is on your mind today?`,
        mode,
      },
    ]);
  };

  return (
    <>
      {/* Floating Launcher Button (Bottom-Left) */}
      <div className="fixed bottom-5 left-5 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl transition-all border ${
            isOpen
              ? "bg-zinc-800 text-white border-white/20"
              : "bg-[#141622] hover:bg-[#1a1d2e] text-white border-red-500/40 shadow-red-950/40"
          }`}
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-rose-400 text-white shadow-md">
            <MessageSquare className="w-4 h-4 fill-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0a0a0c]" />
          </div>

          <div className="text-left hidden sm:block">
            <span className="font-bebas text-base tracking-wide flex items-center gap-1.5 leading-none">
              PRESSURE <span className="text-red-400">COMPANION</span>
            </span>
            <span className="text-[10px] text-zinc-400 font-mono block">
              AI Mood & Thought Anchor
            </span>
          </div>
        </motion.button>
      </div>

      {/* Expandable Chat Drawer Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: "spring", damping: 25, stiffness: 320 }}
            className="fixed bottom-20 left-4 sm:left-5 z-50 w-[calc(100vw-32px)] sm:w-[440px] md:w-[480px] h-[600px] max-h-[82vh] rounded-3xl bg-[#11121c]/95 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden text-left"
          >
            {/* Header */}
            <div className="p-4 bg-[#161726]/90 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400">
                  <Sparkles className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <h3 className="font-bebas text-lg tracking-wider text-white leading-none">
                    PRESSURE <span className="text-red-500">COMPANION</span>
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono mt-0.5">
                    <span>{persona.avatar} {persona.name}</span>
                    <span>•</span>
                    <span className="text-rose-400">Stress Lvl {stressLevel}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleResetChat}
                  title="Clear & Reset Chat"
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close Chat"
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="px-3 py-2 bg-black/40 border-b border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {(Object.keys(CHAT_MODES) as ChatMode[]).map((mKey) => {
                const mInfo = CHAT_MODES[mKey];
                const isSelected = mode === mKey;
                return (
                  <button
                    key={mKey}
                    onClick={() => {
                      setMode(mKey);
                      audioEngine.playGentleChime();
                    }}
                    className={`shrink-0 px-2.5 py-1 rounded-xl text-[11px] font-mono transition-all border flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-white/15 text-white border-white/30 font-semibold shadow-sm"
                        : "bg-white/5 text-zinc-400 border-transparent hover:text-zinc-200"
                    }`}
                  >
                    {mKey === "plan" && <Calendar className="w-3 h-3 text-indigo-400" />}
                    {mKey === "vent" && <Heart className="w-3 h-3 text-rose-400" />}
                    {mKey === "panic" && <Flame className="w-3 h-3 text-cyan-400" />}
                    {mKey === "untangle" && <Sparkles className="w-3 h-3 text-purple-400" />}
                    {mKey === "action" && <Zap className="w-3 h-3 text-emerald-400" />}
                    <span>{mInfo.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Mode Description Banner */}
            <div className="px-4 py-1.5 bg-white/[0.02] border-b border-white/5 text-[10px] font-mono text-zinc-400 flex items-center justify-between">
              <span className="truncate">{CHAT_MODES[mode].tag}: {CHAT_MODES[mode].description}</span>
            </div>

            {/* Day Planner 1-Click Blueprints Strip (Only in Plan mode) */}
            {mode === "plan" && (
              <div className="px-3 py-2 bg-indigo-950/40 border-b border-indigo-500/20 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
                <span className="text-[10px] font-mono text-indigo-300 font-bold shrink-0 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>PRESETS:</span>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleQuickPrompt(
                      "I have 4 hours to study today. Build me a realistic, energy-managed study schedule.",
                      "plan"
                    )
                  }
                  className="shrink-0 px-2 py-1 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-200 border border-indigo-500/30 text-[10px] font-mono transition-colors"
                >
                  📅 4-Hour Sprint
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleQuickPrompt(
                      "I just woke up overwhelmed by my todo list. Build me a structured routine for today from 8 AM to 2 PM.",
                      "plan"
                    )
                  }
                  className="shrink-0 px-2 py-1 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-200 border border-indigo-500/30 text-[10px] font-mono transition-colors"
                >
                  ☀️ Morning Reset
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleQuickPrompt(
                      "I have a big exam in 2 days. Build me an exam day plan with active recall & recovery pacing.",
                      "plan"
                    )
                  }
                  className="shrink-0 px-2 py-1 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-200 border border-indigo-500/30 text-[10px] font-mono transition-colors"
                >
                  ⚡ Exam Day Pacer
                </button>
              </div>
            )}

            {/* Messages Feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs sm:text-sm">
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      isUser ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl p-4 leading-relaxed ${
                        isUser
                          ? "bg-red-600 text-white rounded-br-xs shadow-md shadow-red-950/40"
                          : "bg-[#181a28] text-zinc-200 rounded-bl-xs border border-white/10"
                      }`}
                    >
                      {/* Thought distortion pill if identified */}
                      {msg.thoughtDistortion && (
                        <div className="mb-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold">
                          <Zap className="w-3 h-3 text-purple-400" />
                          <span>DISTORTION: {msg.thoughtDistortion}</span>
                        </div>
                      )}

                      <p className="whitespace-pre-line">{msg.content}</p>

                      {/* Action steps if provided */}
                      {msg.actionSteps && msg.actionSteps.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                            Micro-Steps to Break The Freeze:
                          </span>
                          {msg.actionSteps.map((step, idx) => (
                            <div
                              key={idx}
                              className="p-2 rounded-xl bg-black/40 border border-white/5 text-[11px] text-zinc-300 flex items-start gap-2"
                            >
                              <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Day Planner Schedule Table / Blocks */}
                      {msg.dailySchedule && msg.dailySchedule.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-indigo-400">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>ENERGY-MANAGED DAY BLUEPRINT:</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const scheduleText = msg.dailySchedule!
                                  .map((s) => `${s.time} | ${s.activity} [${s.type.toUpperCase()}]`)
                                  .join("\n");
                                navigator.clipboard.writeText(
                                  `📅 DAY PLAN:\n${scheduleText}\n\nGenerated by Pressure Companion`
                                );
                                setCopiedPlanId(msg.id);
                                setTimeout(() => setCopiedPlanId(null), 2000);
                              }}
                              className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-mono text-zinc-400 hover:text-white border border-white/5 flex items-center gap-1 transition-all"
                              title="Copy schedule to clipboard"
                            >
                              {copiedPlanId === msg.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy Plan</span>
                                </>
                              )}
                            </button>
                          </div>

                          <div className="space-y-1.5">
                            {msg.dailySchedule.map((block, idx) => {
                              const typeConfig = {
                                deep: {
                                  bg: "bg-indigo-500/10 border-indigo-500/30 text-indigo-200",
                                  badge: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
                                  label: "Deep Focus",
                                  icon: Zap,
                                },
                                rest: {
                                  bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-200",
                                  badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
                                  label: "Recovery",
                                  icon: Coffee,
                                },
                                admin: {
                                  bg: "bg-amber-500/10 border-amber-500/30 text-amber-200",
                                  badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
                                  label: "Admin / Catchup",
                                  icon: Clock,
                                },
                                review: {
                                  bg: "bg-rose-500/10 border-rose-500/30 text-rose-200",
                                  badge: "bg-rose-500/20 text-rose-300 border-rose-500/40",
                                  label: "Hard Shutdown",
                                  icon: CheckCircle,
                                },
                              }[block.type] || {
                                bg: "bg-zinc-800/40 border-white/10 text-zinc-200",
                                badge: "bg-white/10 text-zinc-300 border-white/20",
                                label: block.type,
                                icon: Clock,
                              };

                              const IconComponent = typeConfig.icon;

                              return (
                                <div
                                  key={idx}
                                  className={`p-2.5 rounded-xl border ${typeConfig.bg} transition-all`}
                                >
                                  <div className="flex items-center justify-between gap-2 mb-1">
                                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
                                      <Clock className="w-3 h-3 text-zinc-500" />
                                      <span className="font-semibold text-zinc-300">{block.time}</span>
                                    </div>
                                    <span
                                      className={`px-1.5 py-0.5 rounded-md border text-[9px] font-mono uppercase font-bold flex items-center gap-1 ${typeConfig.badge}`}
                                    >
                                      <IconComponent className="w-2.5 h-2.5" />
                                      <span>{typeConfig.label}</span>
                                    </span>
                                  </div>
                                  <p className="text-[11px] leading-snug font-medium text-zinc-200">
                                    {block.activity}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Grounding anchor */}
                      {msg.groundingAnchor && (
                        <div className="mt-2.5 p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-[11px] text-cyan-200 flex items-start gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{msg.groundingAnchor}</span>
                        </div>
                      )}

                      {/* Crisis Safety Card */}
                      {msg.isCrisis && (
                        <div className="mt-3 p-3.5 rounded-xl bg-red-950/80 border border-red-500 text-white space-y-2">
                          <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
                            <LifeBuoy className="w-4 h-4 animate-bounce" />
                            <span>Free & Confidential Support Lifeline:</span>
                          </div>
                          <div className="flex flex-col gap-1 text-xs">
                            <a
                              href="tel:9152987821"
                              className="font-bold underline text-white flex items-center gap-1.5"
                            >
                              📞 Call 9152987821 (iCALL - TISS Helpline)
                            </a>
                            <span className="text-[10px] text-zinc-400 font-mono">OR WRITE TO US AT</span>
                            <a
                              href="mailto:icall@tiss.ac.in"
                              className="font-bold underline text-cyan-300 flex items-center gap-1.5"
                            >
                              ✉️ icall@tiss.ac.in (Email Counseling)
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] font-mono text-zinc-500 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-[#181a28] border border-white/10 w-20 text-zinc-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Starter Chips */}
            <div className="px-3 py-2 bg-[#141524] border-t border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
              {QUICK_PROMPTS.map((qp) => (
                <button
                  key={qp.id}
                  onClick={() => handleQuickPrompt(qp.text, qp.mode)}
                  className={`shrink-0 px-3 py-1.5 rounded-xl border text-[11px] font-medium transition-colors flex items-center gap-1.5 ${
                    qp.mode === mode
                      ? "bg-white/15 text-white border-white/20"
                      : "bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border-white/5"
                  }`}
                >
                  <span>{qp.emoji}</span>
                  <span>{qp.label}</span>
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-[#11121c] border-t border-white/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={
                    mode === "vent"
                      ? "Vent what you can't say out loud..."
                      : mode === "panic"
                      ? "Tell me what's causing the panic spike..."
                      : mode === "untangle"
                      ? "What thought feels overwhelming right now?"
                      : mode === "action"
                      ? "Which assignment is freezing you?"
                      : "Tell me your available hours & subjects for today's plan..."
                  }
                  className="flex-1 px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-red-500/60"
                />

                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className="p-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all shadow-md shadow-red-700/30 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Anchor,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle2,
  Sparkles,
  Eye,
  Hand,
  Ear,
  Wind,
  Heart,
  ChevronRight,
} from "lucide-react";
import { audioEngine } from "@/utils/audioSynth";
import confetti from "canvas-confetti";

export type ExerciseId = "box" | "478" | "sigh" | "resonant" | "grounding";

interface BreathPhaseDef {
  label: string;
  seconds: number;
  instruction: string;
  color: string;
  scale: number;
}

interface BreathExercise {
  id: ExerciseId;
  name: string;
  badge: string;
  goal: string;
  totalCycles: number;
  phases: BreathPhaseDef[];
}

const BREATH_EXERCISES: Record<Exclude<ExerciseId, "grounding">, BreathExercise> = {
  box: {
    id: "box",
    name: "Box Breathing",
    badge: "Navy SEAL Panic Reset",
    goal: "Equalize carbon dioxide and restore prefrontal cortex control during sudden anxiety.",
    totalCycles: 4,
    phases: [
      {
        label: "INHALE",
        seconds: 4,
        instruction: "Breathe in deeply through the nose... feel your chest and ribs widen.",
        color: "#06b6d4",
        scale: 1.45,
      },
      {
        label: "HOLD",
        seconds: 4,
        instruction: "Hold gently with relaxed lungs... drop your shoulders away from ears.",
        color: "#10b981",
        scale: 1.45,
      },
      {
        label: "EXHALE",
        seconds: 4,
        instruction: "Slowly release through the mouth... let all physical tension melt.",
        color: "#a855f7",
        scale: 1.0,
      },
      {
        label: "HOLD STILL",
        seconds: 4,
        instruction: "Rest in stillness... notice the quiet in your mind.",
        color: "#6366f1",
        scale: 1.0,
      },
    ],
  },
  "478": {
    id: "478",
    name: "4-7-8 Deep Calm",
    badge: "Dr. Weil Sleep Sedative",
    goal: "Forces the parasympathetic nervous system into deep relaxation. Ideal for late-night insomnia.",
    totalCycles: 4,
    phases: [
      {
        label: "INHALE",
        seconds: 4,
        instruction: "Quietly inhale through your nose to a count of four.",
        color: "#06b6d4",
        scale: 1.45,
      },
      {
        label: "HOLD",
        seconds: 7,
        instruction: "Hold your breath gently for seven seconds. Keep jaw completely unclenched.",
        color: "#10b981",
        scale: 1.45,
      },
      {
        label: "EXHALE",
        seconds: 8,
        instruction: "Make a gentle whoosh sound, exhaling completely through mouth for eight seconds.",
        color: "#a855f7",
        scale: 1.0,
      },
    ],
  },
  sigh: {
    id: "sigh",
    name: "Physiological Sigh",
    badge: "Stanford Huberman 30s Dump",
    goal: "Pops open collapsed lung alveoli. The fastest biological method to drop heart rate in 2 to 3 breaths.",
    totalCycles: 5,
    phases: [
      {
        label: "DEEP INHALE",
        seconds: 3,
        instruction: "Take a deep, full breath in through your nose.",
        color: "#06b6d4",
        scale: 1.35,
      },
      {
        label: "TOP-UP SNIFF",
        seconds: 1,
        instruction: "Take a second sharp, quick inhale to maximize lung volume.",
        color: "#10b981",
        scale: 1.5,
      },
      {
        label: "LONG SIGH",
        seconds: 6,
        instruction: "Release a long, slow, unforced exhale all the way out through your mouth.",
        color: "#f43f5e",
        scale: 1.0,
      },
    ],
  },
  resonant: {
    id: "resonant",
    name: "Resonant Flow",
    badge: "HRV Study Alignment",
    goal: "Coherent breathing at 5.5 breaths/minute. Synchronizes heart and respiration for sustained study focus.",
    totalCycles: 5,
    phases: [
      {
        label: "SMOOTH INHALE",
        seconds: 5,
        instruction: "Continuous, calm, oceanic inhale through the nose.",
        color: "#10b981",
        scale: 1.45,
      },
      {
        label: "SMOOTH EXHALE",
        seconds: 5,
        instruction: "Continuous, soft, frictionless exhale out through the nose or mouth.",
        color: "#06b6d4",
        scale: 1.0,
      },
    ],
  },
};

const SENSORY_STEPS = [
  {
    step: 5,
    icon: Eye,
    title: "5 Things You Can See",
    description: "Scan your current room. Name 5 distinct objects out loud or in your mind.",
    examples: ["The texture of your desk", "A shadow on the wall", "A book cover", "A pen", "A lamp glare"],
    color: "#06b6d4",
  },
  {
    step: 4,
    icon: Hand,
    title: "4 Things You Can Physically Touch",
    description: "Anchor into tactile reality. Notice 4 physical contact points.",
    examples: ["Both feet flat against the floor", "Your back supported by the chair", "The fabric of your shirt", "The cool surface of your table"],
    color: "#10b981",
  },
  {
    step: 3,
    icon: Ear,
    title: "3 Things You Can Hear",
    description: "Tune your ears outward. Listen for 3 subtle sounds right now.",
    examples: ["The hum of a computer fan", "A distant muffled sound outside", "The rhythm of your own breath"],
    color: "#a855f7",
  },
  {
    step: 2,
    icon: Wind,
    title: "2 Things You Can Smell / Inhale",
    description: "Take two conscious breaths. Notice any faint scent in the air.",
    examples: ["Fresh air from an open door", "Coffee aroma or room air"],
    color: "#f59e0b",
  },
  {
    step: 1,
    icon: Heart,
    title: "1 Truth You Know About Yourself",
    description: "Drop all evaluation. Affirm one non-negotiable fact.",
    examples: ["'I am safe right this second. No exam or grade can define my human worth.'"],
    color: "#ec4899",
  },
];

export const BoxBreathingAnchor: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseId>("box");

  // Breathwork state
  const [isActive, setIsActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);
  const [cycleCount, setCycleCount] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  // 5-4-3-2-1 Sensory Grounding state
  const [groundingStep, setGroundingStep] = useState(0);
  const [groundingCompleted, setGroundingCompleted] = useState(false);

  const activeDef =
    selectedExercise !== "grounding"
      ? BREATH_EXERCISES[selectedExercise]
      : BREATH_EXERCISES.box;

  const currentPhase = activeDef.phases[phaseIndex] || activeDef.phases[0];

  // Reset exercise on tab change
  const handleSelectExercise = (id: ExerciseId) => {
    setSelectedExercise(id);
    audioEngine.playGentleChime();
    setIsActive(false);
    setPhaseIndex(0);
    setCycleCount(1);
    setIsCompleted(false);
    setGroundingStep(0);
    setGroundingCompleted(false);

    if (id !== "grounding") {
      setPhaseSecondsLeft(BREATH_EXERCISES[id].phases[0].seconds);
    }
  };

  // Timer loop for breathwork
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && !isCompleted && selectedExercise !== "grounding") {
      interval = setInterval(() => {
        setPhaseSecondsLeft((prev) => {
          if (prev <= 1) {
            // Next phase
            setPhaseIndex((currIdx) => {
              const nextIdx = (currIdx + 1) % activeDef.phases.length;

              // Completed a full cycle
              if (nextIdx === 0) {
                setCycleCount((c) => {
                  if (c >= activeDef.totalCycles) {
                    setIsActive(false);
                    setIsCompleted(true);
                    confetti({
                      particleCount: 50,
                      spread: 60,
                      origin: { y: 0.7 },
                      colors: ["#10b981", "#06b6d4", "#a855f7"],
                    });
                    if (soundEnabled) audioEngine.playGentleChime();
                    return c;
                  }
                  return c + 1;
                });
              }

              if (soundEnabled) audioEngine.playGentleChime();
              return nextIdx;
            });

            const nextPhaseSeconds =
              activeDef.phases[(phaseIndex + 1) % activeDef.phases.length].seconds;
            return nextPhaseSeconds;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, isCompleted, selectedExercise, activeDef, phaseIndex, soundEnabled]);

  const toggleActive = () => {
    if (!isActive && isCompleted) {
      handleReset();
      setIsActive(true);
    } else {
      setIsActive(!isActive);
      if (!isActive && soundEnabled) {
        audioEngine.playGentleChime();
      }
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setPhaseIndex(0);
    setPhaseSecondsLeft(activeDef.phases[0].seconds);
    setCycleCount(1);
    setIsCompleted(false);
  };

  // Next step in 5-4-3-2-1
  const advanceGroundingStep = () => {
    audioEngine.playGentleChime();
    if (groundingStep < SENSORY_STEPS.length - 1) {
      setGroundingStep((s) => s + 1);
    } else {
      setGroundingCompleted(true);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#10b981", "#06b6d4", "#a855f7"],
      });
    }
  };

  const resetGrounding = () => {
    setGroundingStep(0);
    setGroundingCompleted(false);
    audioEngine.playGentleChime();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col justify-center min-h-[72vh] text-center space-y-5">
      {/* Chapter Tag & Header */}
      <div className="space-y-2">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-600/20 border border-cyan-500/40 text-cyan-400">
          <Anchor className="w-3.5 h-3.5" />
          <span>CHAPTER 08 • NEURO-SOMATIC STRESS RELIEF</span>
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-syne text-white">
          Somatic Reset & Breathwork Vault
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
          Choose a clinically verified protocol below to regulate your vagus nerve and dissolve academic strain.
        </p>
      </div>

      {/* EXERCISE SWITCHER TABS */}
      <div className="flex items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-white/5 border border-white/10 max-w-2xl mx-auto overflow-x-auto no-scrollbar">
        <button
          onClick={() => handleSelectExercise("box")}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all shrink-0 ${
            selectedExercise === "box"
              ? "bg-cyan-600 text-white font-bold shadow-md shadow-cyan-950/40"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Box (4-4-4-4)
        </button>

        <button
          onClick={() => handleSelectExercise("478")}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all shrink-0 ${
            selectedExercise === "478"
              ? "bg-purple-600 text-white font-bold shadow-md shadow-purple-950/40"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          4-7-8 Deep Sleep
        </button>

        <button
          onClick={() => handleSelectExercise("sigh")}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all shrink-0 ${
            selectedExercise === "sigh"
              ? "bg-rose-600 text-white font-bold shadow-md shadow-rose-950/40"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Physiological Sigh
        </button>

        <button
          onClick={() => handleSelectExercise("resonant")}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all shrink-0 ${
            selectedExercise === "resonant"
              ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950/40"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Resonant Flow
        </button>

        <button
          onClick={() => handleSelectExercise("grounding")}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all shrink-0 ${
            selectedExercise === "grounding"
              ? "bg-amber-600 text-white font-bold shadow-md shadow-amber-950/40"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          5-4-3-2-1 Grounding
        </button>
      </div>

      {/* EXERCISE ARENA */}
      {selectedExercise !== "grounding" ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#12131d] border border-cyan-500/20 shadow-2xl relative flex flex-col items-center justify-center min-h-[380px] overflow-hidden max-w-3xl mx-auto w-full">
          {/* Ambient Glow */}
          <div
            className="absolute inset-0 opacity-15 blur-3xl pointer-events-none transition-colors duration-1000"
            style={{ backgroundColor: currentPhase.color }}
          />

          {/* Goal Badge */}
          <div className="mb-4 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 bg-cyan-950/40 px-3 py-0.5 rounded-full border border-cyan-800/40">
              {activeDef.badge}
            </span>
            <p className="text-[11px] text-zinc-400 max-w-md mx-auto">
              {activeDef.goal}
            </p>
          </div>

          {!isCompleted ? (
            <div className="space-y-5 flex flex-col items-center">
              {/* Dynamic Geometric Ring */}
              <div className="relative w-52 h-52 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-white/10" />

                <motion.div
                  animate={{ scale: isActive ? currentPhase.scale : 1.0 }}
                  transition={{
                    duration: isActive ? currentPhase.seconds : 0.8,
                    ease: "easeInOut",
                  }}
                  className="w-32 h-32 rounded-full border-2 flex items-center justify-center shadow-2xl transition-colors duration-700"
                  style={{
                    borderColor: currentPhase.color,
                    boxShadow: `0 0 45px -5px ${currentPhase.color}50`,
                    backgroundColor: `${currentPhase.color}15`,
                  }}
                >
                  <div className="text-center">
                    <span
                      className="block text-4xl font-extrabold font-syne"
                      style={{ color: currentPhase.color }}
                    >
                      {isActive ? phaseSecondsLeft : `${currentPhase.seconds}s`}
                    </span>
                    <span className="text-[10px] font-mono tracking-widest text-zinc-300 font-bold uppercase">
                      {isActive ? currentPhase.label : "READY"}
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Guidance Prompt */}
              <div className="space-y-1 max-w-sm">
                <p className="text-xs sm:text-sm font-semibold text-zinc-100 italic min-h-[36px] flex items-center justify-center">
                  {isActive
                    ? currentPhase.instruction
                    : "Press Start to begin this somatic breathwork session."}
                </p>
                <div className="text-[11px] font-mono text-zinc-400">
                  Cycle {cycleCount} of {activeDef.totalCycles}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={toggleActive}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all shadow-md ${
                    isActive
                      ? "bg-zinc-800 text-white"
                      : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/30"
                  }`}
                >
                  {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  <span>{isActive ? "Pause" : "Start Session"}</span>
                </button>

                <button
                  onClick={handleReset}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5"
                  title="Reset cycle"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-2.5 rounded-xl border transition-colors ${
                    soundEnabled
                      ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                      : "bg-white/5 text-zinc-500 border-white/5"
                  }`}
                  title={soundEnabled ? "Mute chime" : "Enable chime"}
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ) : (
            <div className="py-6 space-y-4 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold font-syne text-white">
                {activeDef.name} Complete
              </h3>
              <p className="text-xs text-zinc-300 max-w-sm mx-auto">
                Your heart rate has slowed and cognitive clarity is restored. Take this stillness with you into your next task.
              </p>
              <button
                onClick={handleReset}
                className="px-5 py-2 rounded-xl bg-cyan-600 text-white text-xs font-semibold"
              >
                Do Another Cycle
              </button>
            </div>
          )}
        </div>
      ) : (
        /* 5-4-3-2-1 SENSORY GROUNDING ARENA */
        <div className="p-6 sm:p-8 rounded-3xl bg-[#12131d] border border-amber-500/30 shadow-2xl relative flex flex-col items-center justify-center min-h-[380px] max-w-3xl mx-auto w-full text-left">
          {!groundingCompleted ? (
            <div className="w-full space-y-5">
              {/* Stepper Progress Indicator */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
                <span className="text-amber-400 font-bold">
                  SENSORY STEP {5 - groundingStep} OF 5
                </span>
                <span className="text-zinc-400">
                  Step {groundingStep + 1} of 5
                </span>
              </div>

              {/* Active Grounding Stage Card */}
              {(() => {
                const activeStep = SENSORY_STEPS[groundingStep];
                const StepIcon = activeStep.icon;

                return (
                  <motion.div
                    key={groundingStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0"
                        style={{ backgroundColor: `${activeStep.color}25`, border: `1px solid ${activeStep.color}50` }}
                      >
                        <StepIcon className="w-6 h-6" style={{ color: activeStep.color }} />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold font-syne text-white">
                          {activeStep.title}
                        </h4>
                        <p className="text-xs text-zinc-300">
                          {activeStep.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-2">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                        Ideas to notice right now:
                      </span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                        {activeStep.examples.map((ex, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                            <span>{ex}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={advanceGroundingStep}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-950/40 transition-all"
                      >
                        <span>
                          {groundingStep === SENSORY_STEPS.length - 1
                            ? "Complete Grounding"
                            : "I've Noticed These — Next Step"}
                        </span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })()}
            </div>
          ) : (
            <div className="py-8 space-y-4 text-center max-w-md mx-auto">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold font-syne text-white">
                5-4-3-2-1 Sensory Reset Complete
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                You have pulled your consciousness out of catastrophic future worries and anchored back into the physical present moment. You are here, you are safe, and you are capable.
              </p>
              <button
                onClick={resetGrounding}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold"
              >
                Repeat Sensory Grounding
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

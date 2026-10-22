"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PERSONAS } from "@/data/pressureData";
import { PersonaId } from "@/types";
import { CheckCircle2, Sparkles, X } from "lucide-react";

interface PersonaSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPersonaId: PersonaId;
  onSelectPersona: (id: PersonaId) => void;
  isInitialGate?: boolean;
}

export const PersonaSelectModal: React.FC<PersonaSelectModalProps> = ({
  isOpen,
  onClose,
  selectedPersonaId,
  onSelectPersona,
  isInitialGate = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.92, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl p-6 sm:p-10 my-8 rounded-3xl bg-[#12131a] border border-white/10 shadow-2xl text-center overflow-hidden"
          >
            {/* Ambient background glow */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

            {!isInitialGate && (
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <div className="space-y-3 mb-8">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                Netflix-Style Student Profiles
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-syne text-white">
                Who&apos;s Feeling It?
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
                Select your current student archetype. This tailors your
                reality episodes, survival mantras, and emotional antidotes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              {Object.values(PERSONAS).map((persona) => {
                const isSelected = selectedPersonaId === persona.id;
                return (
                  <motion.div
                    key={persona.id}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onSelectPersona(persona.id);
                      if (!isInitialGate) onClose();
                    }}
                    className={`relative cursor-pointer rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                      isSelected
                        ? "bg-white/10 border-red-500/80 shadow-lg shadow-red-950/50 ring-2 ring-red-500/40"
                        : "bg-[#181922]/80 hover:bg-[#1e1f2b] border-white/10 hover:border-white/20"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 text-red-400">
                        <CheckCircle2 className="w-5 h-5 fill-red-500/20" />
                      </div>
                    )}

                    <div>
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4 bg-white/5 border border-white/10 shadow-inner">
                        {persona.avatar}
                      </div>

                      <h3 className="font-bold text-lg text-white mb-1">
                        {persona.name}
                      </h3>
                      <p
                        className="text-xs font-semibold mb-3 tracking-wide"
                        style={{ color: persona.color }}
                      >
                        {persona.roleTitle}
                      </p>

                      <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed mb-4">
                        &ldquo;{persona.slogan}&rdquo;
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
                      <span>Click to Enter</span>
                      <span className="font-mono text-[10px] text-zinc-400">
                        {isSelected ? "Active" : "Select"}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {isInitialGate && (
              <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/30 transition-all text-sm tracking-wide"
                >
                  Enter Reality Experience &rarr;
                </button>
                <button
                  onClick={() => {
                    onClose();
                  }}
                  className="text-xs text-zinc-400 hover:text-white underline underline-offset-4 transition-colors"
                >
                  Browse as Anonymous Student
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

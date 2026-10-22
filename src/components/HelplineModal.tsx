"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PhoneCall,
  Mail,
  Copy,
  CheckCircle2,
  X,
  LifeBuoy,
  ShieldCheck,
  Heart,
  Clock,
  ExternalLink,
} from "lucide-react";
import { audioEngine } from "@/utils/audioSynth";

interface HelplineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelplineModal: React.FC<HelplineModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const phoneNumber = "9152987821";
  const emailAddress = "icall@tiss.ac.in";

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(phoneNumber);
    setCopiedPhone(true);
    audioEngine.playGentleChime();
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopiedEmail(true);
    audioEngine.playGentleChime();
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.94, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#12131e] border border-red-500/40 shadow-2xl text-left overflow-hidden my-8"
          >
            {/* Ambient Red Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close helpline modal"
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Badge */}
            <div className="space-y-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-600/20 border border-red-500/40 text-red-400">
                <LifeBuoy className="w-3.5 h-3.5 animate-pulse" />
                <span>CONFIDENTIAL STUDENT HELPLINE</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-syne text-white">
                You Are Not Alone
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400">
                If the pressure, academic anxiety, or burnout feels too heavy to carry, free and professional psychosocial counseling is ready for you.
              </p>
            </div>

            {/* Helpline Options Card Container */}
            <div className="space-y-4">
              {/* Option 1: CALL NUMBER */}
              <div className="p-5 rounded-2xl bg-[#181a28] border border-white/10 space-y-3 hover:border-red-500/40 transition-colors">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span className="flex items-center gap-1.5 text-red-400 font-bold uppercase tracking-wider">
                    <PhoneCall className="w-4 h-4" />
                    <span>Helpline Number:</span>
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Free & Confidential</span>
                  </span>
                </div>

                <div className="flex items-baseline justify-between gap-3">
                  <a
                    href={`tel:${phoneNumber}`}
                    className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-wider hover:text-red-400 transition-colors"
                  >
                    {phoneNumber}
                  </a>

                  <button
                    onClick={handleCopyPhone}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300 hover:text-white border border-white/10 transition-colors"
                  >
                    {copiedPhone ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <a
                  href={`tel:${phoneNumber}`}
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call {phoneNumber} Now</span>
                </a>
              </div>

              {/* OR Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-white/10 w-full" />
                <span className="bg-[#12131e] px-3 text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest">
                  OR
                </span>
                <div className="border-t border-white/10 w-full" />
              </div>

              {/* Option 2: WRITE TO US AT EMAIL */}
              <div className="p-5 rounded-2xl bg-[#181a28] border border-white/10 space-y-3 hover:border-cyan-500/40 transition-colors">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span className="flex items-center gap-1.5 text-cyan-400 font-bold uppercase tracking-wider">
                    <Mail className="w-4 h-4" />
                    <span>Write to Us At:</span>
                  </span>
                  <span className="text-[11px] text-zinc-400">Email Counseling</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <a
                    href={`mailto:${emailAddress}`}
                    className="font-mono text-base sm:text-lg font-bold text-white hover:text-cyan-400 transition-colors truncate"
                  >
                    {emailAddress}
                  </a>

                  <button
                    onClick={handleCopyEmail}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300 hover:text-white border border-white/10 transition-colors shrink-0"
                  >
                    {copiedEmail ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <a
                  href={`mailto:${emailAddress}`}
                  className="w-full py-2.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/40 text-cyan-200 border border-cyan-500/40 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send an Email to {emailAddress}</span>
                </a>
              </div>
            </div>

            {/* Context Note (iCALL / TISS) */}
            <div className="mt-5 p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1 text-xs text-zinc-400">
              <div className="flex items-center gap-1.5 font-bold text-zinc-200">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>iCALL Psychosocial Helpline (TISS)</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Initiated by the Tata Institute of Social Sciences. Provides free, confidential, and professional mental health support by trained counselors Monday to Saturday (10:00 AM – 8:00 PM).
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

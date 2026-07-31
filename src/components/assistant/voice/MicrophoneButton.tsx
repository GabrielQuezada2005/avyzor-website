"use client";

/**
 * Voice Mode – Mikrofon-Button
 *
 * Startet/stoppt Spracherkennung mit Premium-Animation und Abbruch-Option.
 */

import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useVoice } from "./VoiceContext";

interface MicrophoneButtonProps {
  disabled?: boolean;
}

export function MicrophoneButton({ disabled = false }: MicrophoneButtonProps) {
  const t = useTranslations("voice");
  const {
    isVoiceSupported,
    isVoiceInputActive,
    recordingState,
    toggleRecording,
    cancelRecording,
  } = useVoice();

  if (!isVoiceSupported || !isVoiceInputActive) return null;

  const isRecording = recordingState === "recording";
  const isProcessing = recordingState === "processing";
  const isBusy = isRecording || isProcessing;

  const label = isRecording
    ? t("mic.stop")
    : isProcessing
      ? t("mic.processing")
      : t("mic.start");

  return (
    <div className="flex items-center gap-0.5">
      <motion.button
        type="button"
        onClick={toggleRecording}
        disabled={disabled || isProcessing}
        aria-label={label}
        aria-pressed={isBusy}
        whileHover={!disabled && !isProcessing ? { scale: 1.05 } : undefined}
        whileTap={!disabled && !isProcessing ? { scale: 0.92 } : undefined}
        className={cn(
          "relative w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50",
          isRecording
            ? "bg-red-500/20 border border-red-500/40 text-red-300"
            : isProcessing
              ? "bg-gold-500/15 border border-gold-500/30 text-gold-400 cursor-wait"
              : "bg-dark-600 text-white/50 hover:text-gold-400 hover:bg-gold-500/10 hover:border-gold-500/20 border border-transparent"
        )}
      >
        {isRecording ? (
          <motion.span
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
          >
            <Mic size={14} aria-hidden="true" />
          </motion.span>
        ) : isProcessing ? (
          <Square size={12} className="animate-pulse" aria-hidden="true" />
        ) : (
          <Mic size={14} aria-hidden="true" />
        )}

        {isRecording && (
          <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-70" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400" />
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isRecording && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={cancelRecording}
            aria-label={t("mic.cancel")}
            className={cn(
              "w-6 h-6 rounded-md flex items-center justify-center",
              "text-white/40 hover:text-red-300 hover:bg-red-500/10",
              "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
            )}
          >
            <X size={12} aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

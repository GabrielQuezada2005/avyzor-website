"use client";

/**
 * Text-to-Speech – Lautsprecher-Steuerung pro Nachricht
 *
 * Play / Pause / Resume / Stop mit Premium-Design und vollständiger Accessibility.
 */

import { motion } from "framer-motion";
import { Volume2, Pause, Square, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useSpeech } from "./SpeechContext";

interface MessageSpeechButtonProps {
  messageId: string;
  text: string;
}

export function MessageSpeechButton({
  messageId,
  text,
}: MessageSpeechButtonProps) {
  const t = useTranslations("tts");
  const { activeMessageId, playbackState, playMessage, pause, resume, stop } =
    useSpeech();

  const isActive = activeMessageId === messageId;
  const isPlaying = isActive && playbackState === "playing";
  const isPaused = isActive && playbackState === "paused";
  const isLoading = isActive && playbackState === "loading";
  const isEngaged = isPlaying || isPaused || isLoading;

  const handlePlayPause = () => {
    if (!isActive) {
      playMessage(messageId, text);
      return;
    }
    if (isPlaying || isLoading) {
      pause();
      return;
    }
    if (isPaused) {
      resume();
    }
  };

  const handleStop = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    stop();
  };

  const playPauseLabel = !isActive
    ? t("play")
    : isLoading
      ? t("loading")
      : isPlaying
        ? t("pause")
        : isPaused
          ? t("resume")
          : t("play");

  return (
    <div
      className="inline-flex items-center gap-0.5"
      role="group"
      aria-label={t("controlsAriaLabel")}
    >
      <button
        type="button"
        onClick={handlePlayPause}
        aria-label={playPauseLabel}
        aria-pressed={isEngaged}
        disabled={!text.trim()}
        className={cn(
          "relative flex items-center justify-center w-7 h-7 rounded-lg",
          "transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 focus-visible:ring-offset-1 focus-visible:ring-offset-dark-800",
          isEngaged
            ? "text-gold-400 bg-gold-500/15 border border-gold-500/30"
            : "text-white/40 hover:text-gold-400 hover:bg-gold-500/10 border border-transparent hover:border-gold-500/20"
        )}
      >
        {isLoading ? (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
            className="flex items-center justify-center"
          >
            <Loader2 size={14} aria-hidden="true" />
          </motion.span>
        ) : isPlaying ? (
          <motion.span
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            <Volume2 size={14} aria-hidden="true" />
          </motion.span>
        ) : isPaused ? (
          <Pause size={14} aria-hidden="true" />
        ) : (
          <Volume2 size={14} aria-hidden="true" />
        )}

        {(isPlaying || isLoading) && (
          <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-400" />
          </span>
        )}
      </button>

      {isEngaged && (
        <button
          type="button"
          onClick={handleStop}
          aria-label={t("stop")}
          className={cn(
            "flex items-center justify-center w-6 h-6 rounded-md",
            "text-white/35 hover:text-red-300 hover:bg-red-500/10",
            "transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
          )}
        >
          <Square size={11} aria-hidden="true" fill="currentColor" />
        </button>
      )}
    </div>
  );
}

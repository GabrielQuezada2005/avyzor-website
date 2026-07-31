"use client";

/**
 * Voice Mode – Eingabeleiste mit Mikrofon
 *
 * Erweitert die Chat-Eingabe um Spracheingabe, ohne die
 * bestehende AssistantInput-Komponente zu verändern.
 */

import { useState, type FormEvent, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVoice } from "./VoiceContext";
import { MicrophoneButton } from "./MicrophoneButton";
import { VoiceRecordingIndicator } from "./VoiceRecordingIndicator";
import { VoiceModeSwitch } from "./VoiceModeSwitch";
import { LanguageSelector } from "./LanguageSelector";

interface AssistantVoiceInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function AssistantVoiceInput({
  onSend,
  disabled = false,
  placeholder = "Ihre Nachricht eingeben…",
}: AssistantVoiceInputProps) {
  const { voiceMode, interimTranscript, isVoiceInputActive, isVoiceSupported } =
    useVoice();
  const [value, setValue] = useState("");

  const isVoiceOnly = voiceMode === "voice-only";
  const displayValue =
    interimTranscript && isVoiceInputActive ? interimTranscript : value;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <div className="space-y-2">
      {isVoiceSupported && (
        <div className="flex items-center justify-between gap-2">
          <VoiceModeSwitch />
          <LanguageSelector />
        </div>
      )}

      <VoiceRecordingIndicator />

      {isVoiceOnly ? (
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-3 py-4 px-3",
            "rounded-xl bg-dark-700/40 border border-gold-500/15"
          )}
        >
          <p className="text-xs text-white/45 text-center">
            Sprechen Sie mit Ihrem Berater – tippen Sie auf das Mikrofon
          </p>
          <MicrophoneButton disabled={disabled} />
          {interimTranscript && (
            <p
              className="text-sm text-white/70 text-center max-w-full truncate px-2"
              aria-live="polite"
            >
              {interimTranscript}
            </p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="relative flex items-end gap-1.5">
          <textarea
            value={displayValue}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled || Boolean(interimTranscript && isVoiceInputActive)}
            placeholder={placeholder}
            rows={1}
            aria-label="Chat-Nachricht"
            className={cn(
              "flex-1 resize-none bg-dark-700/60 border border-white/10 rounded-xl pl-4 pr-3 py-3 text-sm text-white placeholder:text-white/30",
              "focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all duration-300",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "max-h-24 overflow-y-auto"
            )}
          />

          <div className="flex items-center gap-1 pb-0.5">
            <MicrophoneButton disabled={disabled} />

            <motion.button
              type="submit"
              disabled={disabled || !value.trim()}
              aria-label="Nachricht senden"
              whileHover={value.trim() && !disabled ? { scale: 1.05 } : undefined}
              whileTap={value.trim() && !disabled ? { scale: 0.92 } : undefined}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 flex-shrink-0",
                value.trim() && !disabled
                  ? "bg-gold-gradient text-dark-900 hover:shadow-gold"
                  : "bg-dark-600 text-white/30 cursor-not-allowed"
              )}
            >
              <Send size={14} />
            </motion.button>
          </div>
        </form>
      )}
    </div>
  );
}

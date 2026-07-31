"use client";

/**
 * Voice Mode – Modus-Schalter
 *
 * Drei Modi: Nur Text | Text + Sprache | Nur Sprache
 */

import { MessageSquare, MessagesSquare, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VoiceMode } from "@/lib/assistant/voice";
import { useVoice } from "./VoiceContext";

const MODES: Array<{
  id: VoiceMode;
  label: string;
  shortLabel: string;
  icon: typeof MessageSquare;
  ariaLabel: string;
}> = [
  {
    id: "text-only",
    label: "Nur Text",
    shortLabel: "Text",
    icon: MessageSquare,
    ariaLabel: "Nur Textmodus",
  },
  {
    id: "text-and-voice",
    label: "Text + Sprache",
    shortLabel: "Text+",
    icon: MessagesSquare,
    ariaLabel: "Text- und Sprachmodus",
  },
  {
    id: "voice-only",
    label: "Nur Sprache",
    shortLabel: "Voice",
    icon: Mic,
    ariaLabel: "Nur Sprachmodus",
  },
];

export function VoiceModeSwitch() {
  const { voiceMode, setVoiceMode, isVoiceSupported } = useVoice();

  if (!isVoiceSupported) return null;

  return (
    <div
      role="radiogroup"
      aria-label="Voice Mode auswählen"
      className="flex items-center gap-1 p-0.5 rounded-lg bg-dark-700/50 border border-white/5"
    >
      {MODES.map(({ id, shortLabel, icon: Icon, ariaLabel }) => {
        const isActive = voiceMode === id;

        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={ariaLabel}
            title={MODES.find((m) => m.id === id)?.label}
            onClick={() => setVoiceMode(id)}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50",
              isActive
                ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent"
            )}
          >
            <Icon size={11} aria-hidden="true" />
            <span className="hidden sm:inline">{shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
}

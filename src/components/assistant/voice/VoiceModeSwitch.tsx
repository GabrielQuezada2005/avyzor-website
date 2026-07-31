"use client";

/**
 * Voice Mode – Modus-Schalter
 *
 * Drei Modi: Nur Text | Text + Sprache | Nur Sprache
 */

import { MessageSquare, MessagesSquare, Mic } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { VoiceMode } from "@/lib/assistant/voice";
import { useVoice } from "./VoiceContext";

const MODE_IDS: VoiceMode[] = ["text-only", "text-and-voice", "voice-only"];

const MODE_ICONS = {
  "text-only": MessageSquare,
  "text-and-voice": MessagesSquare,
  "voice-only": Mic,
} as const;

const MODE_KEYS = {
  "text-only": "textOnly",
  "text-and-voice": "textAndVoice",
  "voice-only": "voiceOnly",
} as const;

export function VoiceModeSwitch() {
  const t = useTranslations("voice");
  const { voiceMode, setVoiceMode, isVoiceSupported } = useVoice();

  if (!isVoiceSupported) return null;

  return (
    <div
      role="radiogroup"
      aria-label={t("modeGroupAriaLabel")}
      className="flex items-center gap-1 p-0.5 rounded-lg bg-dark-700/50 border border-white/5"
    >
      {MODE_IDS.map((id) => {
        const isActive = voiceMode === id;
        const modeKey = MODE_KEYS[id];
        const Icon = MODE_ICONS[id];

        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={t(`modes.${modeKey}.ariaLabel`)}
            title={t(`modes.${modeKey}.label`)}
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
            <span className="hidden sm:inline">
              {t(`modes.${modeKey}.shortLabel`)}
            </span>
          </button>
        );
      })}
    </div>
  );
}

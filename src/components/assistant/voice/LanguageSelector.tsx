"use client";

/**
 * Voice Mode – Sprachauswahl
 *
 * Manuelle Sprachwahl als Fallback, wenn Auto-Erkennung unsicher ist.
 */

import { Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { SUPPORTED_LANGUAGES } from "@/lib/assistant/voice";
import { useVoice } from "./VoiceContext";

interface LanguageSelectorProps {
  compact?: boolean;
}

export function LanguageSelector({ compact = true }: LanguageSelectorProps) {
  const t = useTranslations("voice");
  const { language, setLanguage, isVoiceSupported } = useVoice();

  if (!isVoiceSupported) return null;

  return (
    <div className="flex items-center gap-1.5">
      <Globe
        size={12}
        className="text-white/30 flex-shrink-0"
        aria-hidden="true"
      />
      <label htmlFor="voice-language-select" className="sr-only">
        {t("language.label")}
      </label>
      <select
        id="voice-language-select"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        aria-label={t("language.selectAriaLabel")}
        className={cn(
          "bg-dark-700/60 border border-white/10 rounded-md text-white/70",
          "focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30",
          "transition-all duration-200 cursor-pointer",
          compact
            ? "text-[10px] py-0.5 px-1.5 max-w-[88px] sm:max-w-none"
            : "text-xs py-1 px-2"
        )}
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-dark-800">
            {compact ? lang.short : lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}

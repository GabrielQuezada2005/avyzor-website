"use client";

/**
 * Text-to-Speech – Einstellungs-Panel
 *
 * Stimme, Geschwindigkeit, Tonhöhe und Lautstärke im Chatbot.
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { localeToBcp47, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useSpeech } from "./SpeechContext";

interface TtsSettingsPanelProps {
  isOpen: boolean;
}

function formatSliderValue(value: number, decimals = 2): string {
  return value.toFixed(decimals);
}

export function TtsSettingsPanel({ isOpen }: TtsSettingsPanelProps) {
  const t = useTranslations("tts");
  const locale = useLocale() as Locale;
  const {
    isTtsSupported,
    activeProviderId,
    preferences,
    availableVoices,
    updatePreferences,
    resetPreferences,
  } = useSpeech();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || !isTtsSupported) return null;

  const lang = localeToBcp47[locale] ?? "de-DE";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
          role="region"
          aria-label={t("settings.voiceSection")}
        >
          <div className="mx-4 mb-2 p-3 rounded-xl bg-dark-700/50 border border-gold-500/15 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-gold-400 uppercase tracking-wider">
                  {t("settings.voiceSection")}
                </h4>
                {activeProviderId === "openai" && (
                  <p className="text-[10px] text-white/35 mt-0.5">
                    {t("settings.premiumProvider")}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={resetPreferences}
                className="text-[10px] text-white/40 hover:text-gold-400 transition-colors"
              >
                {t("settings.reset")}
              </button>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="tts-voice-select"
                className="text-[11px] text-white/50"
              >
                {t("settings.voiceLabel")}
              </label>
              <select
                id="tts-voice-select"
                value={preferences.voiceUri ?? ""}
                onChange={(e) =>
                  updatePreferences({
                    voiceUri: e.target.value || null,
                  })
                }
                aria-label={t("settings.voiceLabel")}
                className={cn(
                  "w-full bg-dark-800/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/80",
                  "focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30"
                )}
              >
                <option value="">{t("settings.voiceAuto")}</option>
                {availableVoices.map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-white/30">{lang}</p>
            </div>

            <SliderControl
              id="tts-rate"
              label={t("settings.rateLabel")}
              value={preferences.rate}
              min={0.5}
              max={2}
              step={0.05}
              displayValue={formatSliderValue(preferences.rate)}
              onChange={(rate) => updatePreferences({ rate })}
            />

            <SliderControl
              id="tts-pitch"
              label={t("settings.pitchLabel")}
              value={preferences.pitch}
              min={0}
              max={2}
              step={0.05}
              displayValue={formatSliderValue(preferences.pitch)}
              onChange={(pitch) => updatePreferences({ pitch })}
              disabled={activeProviderId === "openai"}
              hint={
                activeProviderId === "openai"
                  ? t("settings.pitchBrowserOnly")
                  : undefined
              }
            />

            <SliderControl
              id="tts-volume"
              label={t("settings.volumeLabel")}
              value={preferences.volume}
              min={0}
              max={1}
              step={0.05}
              displayValue={formatSliderValue(preferences.volume)}
              onChange={(volume) => updatePreferences({ volume })}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface SliderControlProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  onChange: (value: number) => void;
  disabled?: boolean;
  hint?: string;
}

function SliderControl({
  id,
  label,
  value,
  min,
  max,
  step,
  displayValue,
  onChange,
  disabled = false,
  hint,
}: SliderControlProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className={cn(
            "text-[11px]",
            disabled ? "text-white/25" : "text-white/50"
          )}
        >
          {label}
        </label>
        <span className="text-[10px] text-gold-400/80 tabular-nums">
          {displayValue}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        className={cn(
          "w-full h-1.5 rounded-full appearance-none cursor-pointer",
          "bg-dark-600 accent-gold-400",
          disabled && "opacity-40 cursor-not-allowed",
          "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5",
          "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold-400",
          "[&::-webkit-slider-thumb]:shadow-gold [&::-webkit-slider-thumb]:border-0"
        )}
      />
      {hint && <p className="text-[10px] text-white/30">{hint}</p>}
    </div>
  );
}

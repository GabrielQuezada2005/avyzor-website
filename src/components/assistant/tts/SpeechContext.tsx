"use client";

/**
 * Text-to-Speech – React Context
 *
 * Stellt globale Wiedergabe-Steuerung und Nutzer-Einstellungen bereit.
 * Bevorzugt Cloud-TTS (OpenAI / ElevenLabs), Fallback: Browser Speech Synthesis.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import { localeToBcp47, type Locale } from "@/i18n/routing";
import {
  getTtsEngine,
  ensureAudioPlaybackUnlocked,
  loadTtsPreferences,
  loadVoicesForLanguage,
  probeCloudTtsAvailability,
  resetTtsPreferences,
  subscribeTtsPreferences,
  toElevenLabsVoiceUri,
  toOpenAiVoiceUri,
  type SpeechPlaybackState,
  type TtsPreferences,
  type TtsProviderId,
  type TtsStatusResponse,
} from "@/lib/assistant/tts";

export interface TtsVoiceOption {
  id: string;
  name: string;
}

interface SpeechContextValue {
  activeMessageId: string | null;
  playbackState: SpeechPlaybackState;
  isTtsSupported: boolean;
  activeProviderId: TtsProviderId;
  preferences: TtsPreferences;
  availableVoices: TtsVoiceOption[];
  playMessage: (messageId: string, text: string, lang?: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  updatePreferences: (partial: Partial<TtsPreferences>) => void;
  resetPreferences: () => void;
}

const SpeechContext = createContext<SpeechContextValue | null>(null);

interface SpeechProviderProps {
  children: ReactNode;
}

function mapCloudVoices(
  status: TtsStatusResponse,
  t: (key: string) => string
): TtsVoiceOption[] {
  const toUri =
    status.activeProvider === "elevenlabs"
      ? toElevenLabsVoiceUri
      : toOpenAiVoiceUri;

  return status.voices.map((voice) => ({
    id: toUri(voice.id),
    name:
      status.activeProvider === "openai"
        ? t(`settings.openaiVoices.${voice.id}`)
        : t(`settings.elevenlabsVoices.${voice.label.toLowerCase()}`),
  }));
}

export function SpeechProvider({ children }: SpeechProviderProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("tts");
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [playbackState, setPlaybackState] =
    useState<SpeechPlaybackState>("idle");
  const [preferences, setPreferences] = useState<TtsPreferences>(
    loadTtsPreferences
  );
  const [availableVoices, setAvailableVoices] = useState<TtsVoiceOption[]>(
    []
  );
  const [isTtsSupported, setIsTtsSupported] = useState(false);
  const [activeProviderId, setActiveProviderId] =
    useState<TtsProviderId>("browser");

  const lang = localeToBcp47[locale] ?? "de-DE";

  useEffect(() => {
    const engine = getTtsEngine();

    return engine.subscribe(({ messageId, playbackState: state }) => {
      setActiveMessageId(messageId);
      setPlaybackState(state);
      setActiveProviderId(engine.activeProviderId);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function initTts() {
      const browserOk =
        typeof window !== "undefined" &&
        "speechSynthesis" in window &&
        "SpeechSynthesisUtterance" in window;

      const status = await probeCloudTtsAvailability();
      if (cancelled) return;

      const engine = getTtsEngine();

      if (status?.available) {
        engine.setProvider(status.activeProvider);
        setActiveProviderId(status.activeProvider);
        setAvailableVoices(mapCloudVoices(status, t));
        setIsTtsSupported(true);
        return;
      }

      if (browserOk) {
        engine.setProvider("browser");
        setActiveProviderId("browser");
        const voices = await loadVoicesForLanguage(lang);
        if (!cancelled) {
          setAvailableVoices(
            voices.map((v) => ({ id: v.voiceURI, name: v.name }))
          );
          setIsTtsSupported(true);
        }
        return;
      }

      setIsTtsSupported(false);
    }

    void initTts();

    return () => {
      cancelled = true;
    };
  }, [lang, t]);

  useEffect(() => {
    return subscribeTtsPreferences(setPreferences);
  }, []);

  useEffect(() => {
    if (activeProviderId !== "browser") return;
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    let cancelled = false;

    const refreshVoices = async () => {
      const voices = await loadVoicesForLanguage(lang);
      if (!cancelled) {
        setAvailableVoices(
          voices.map((v) => ({ id: v.voiceURI, name: v.name }))
        );
      }
    };

    void refreshVoices();

    const synth = window.speechSynthesis;
    synth.addEventListener("voiceschanged", refreshVoices);

    return () => {
      cancelled = true;
      synth.removeEventListener("voiceschanged", refreshVoices);
    };
  }, [lang, activeProviderId]);

  const playMessage = useCallback(
    (messageId: string, text: string, speakLang?: string) => {
      ensureAudioPlaybackUnlocked();
      void getTtsEngine().speak({
        messageId,
        text,
        lang: speakLang ?? lang,
      });
    },
    [lang]
  );

  const pause = useCallback(() => {
    getTtsEngine().pause();
  }, []);

  const resume = useCallback(() => {
    getTtsEngine().resume();
  }, []);

  const stop = useCallback(() => {
    getTtsEngine().stop();
  }, []);

  const updatePreferences = useCallback(
    (partial: Partial<TtsPreferences>) => {
      const next = getTtsEngine().setPreferences(partial);
      setPreferences(next);
    },
    []
  );

  const resetPreferencesHandler = useCallback(() => {
    const next = resetTtsPreferences();
    setPreferences(next);
  }, []);

  const value = useMemo<SpeechContextValue>(
    () => ({
      activeMessageId,
      playbackState,
      isTtsSupported,
      activeProviderId,
      preferences,
      availableVoices,
      playMessage,
      pause,
      resume,
      stop,
      updatePreferences,
      resetPreferences: resetPreferencesHandler,
    }),
    [
      activeMessageId,
      playbackState,
      isTtsSupported,
      activeProviderId,
      preferences,
      availableVoices,
      playMessage,
      pause,
      resume,
      stop,
      updatePreferences,
      resetPreferencesHandler,
    ]
  );

  return (
    <SpeechContext.Provider value={value}>{children}</SpeechContext.Provider>
  );
}

export function useSpeech(): SpeechContextValue {
  const ctx = useContext(SpeechContext);
  if (!ctx) {
    throw new Error("useSpeech must be used within SpeechProvider");
  }
  return ctx;
}

export function useSpeechOptional(): SpeechContextValue | null {
  return useContext(SpeechContext);
}

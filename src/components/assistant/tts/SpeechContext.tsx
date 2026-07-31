"use client";

/**
 * Text-to-Speech – React Context
 *
 * Stellt globale Wiedergabe-Steuerung und Nutzer-Einstellungen bereit.
 * Nur eine Nachricht kann gleichzeitig vorgelesen werden.
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
import { useLocale } from "next-intl";
import { localeToBcp47, type Locale } from "@/i18n/routing";
import {
  getTtsEngine,
  loadTtsPreferences,
  loadVoicesForLanguage,
  resetTtsPreferences,
  subscribeTtsPreferences,
  type SpeechPlaybackState,
  type TtsPreferences,
} from "@/lib/assistant/tts";

interface SpeechContextValue {
  activeMessageId: string | null;
  playbackState: SpeechPlaybackState;
  isTtsSupported: boolean;
  preferences: TtsPreferences;
  availableVoices: SpeechSynthesisVoice[];
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

export function SpeechProvider({ children }: SpeechProviderProps) {
  const locale = useLocale() as Locale;
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [playbackState, setPlaybackState] =
    useState<SpeechPlaybackState>("idle");
  const [preferences, setPreferences] = useState<TtsPreferences>(
    loadTtsPreferences
  );
  const [availableVoices, setAvailableVoices] = useState<
    SpeechSynthesisVoice[]
  >([]);
  const [isTtsSupported, setIsTtsSupported] = useState(false);

  const lang = localeToBcp47[locale] ?? "de-DE";

  useEffect(() => {
    const engine = getTtsEngine();
    setIsTtsSupported(
      typeof window !== "undefined" &&
        "speechSynthesis" in window &&
        "SpeechSynthesisUtterance" in window
    );

    return engine.subscribe(({ messageId, playbackState: state }) => {
      setActiveMessageId(messageId);
      setPlaybackState(state);
    });
  }, []);

  useEffect(() => {
    return subscribeTtsPreferences(setPreferences);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    let cancelled = false;

    async function refreshVoices() {
      const voices = await loadVoicesForLanguage(lang);
      if (!cancelled) setAvailableVoices(voices);
    }

    void refreshVoices();

    const synth = window.speechSynthesis;
    synth.addEventListener("voiceschanged", refreshVoices);

    return () => {
      cancelled = true;
      synth.removeEventListener("voiceschanged", refreshVoices);
    };
  }, [lang]);

  const playMessage = useCallback(
    (messageId: string, text: string, speakLang?: string) => {
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

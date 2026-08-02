"use client";

/**
 * Voice Mode – React Context
 *
 * Verwaltet Voice-Mode, Sprache, Mikrofon-Aufnahme und Auto-Speak.
 * Integriert STT-Engine und SpeechContext (TTS) ohne Chat-Logik zu verändern.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { localeToBcp47, type Locale } from "@/i18n/routing";
import { detectLanguageFromText, ensureAudioPlaybackUnlocked } from "@/lib/assistant/tts";
import {
  DEFAULT_LANGUAGE,
  getSttEngine,
  type RecordingState,
  type VoiceMode,
} from "@/lib/assistant/voice";
import {
  isVoiceModeActive,
  loadVoicePreferences,
  saveVoicePreferences,
  shouldAutoSpeakResponses,
} from "@/lib/assistant/voice/preferences";
import { useSpeech } from "../tts/SpeechContext";
import type { ChatMessage } from "@/lib/assistant";

interface VoiceContextValue {
  voiceMode: VoiceMode;
  setVoiceMode: (mode: VoiceMode) => void;
  language: string;
  setLanguage: (lang: string) => void;
  isVoiceSupported: boolean;
  recordingState: RecordingState;
  interimTranscript: string;
  isVoiceInputActive: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  cancelRecording: () => void;
  toggleRecording: () => void;
}

const VoiceContext = createContext<VoiceContextValue | null>(null);

interface VoiceProviderProps {
  children: ReactNode;
  siteLocale: string;
  messages: ChatMessage[];
  isTyping: boolean;
  onSend: (message: string) => void;
}

function localeToVoiceLanguage(siteLocale: string): string {
  return localeToBcp47[siteLocale as Locale] ?? DEFAULT_LANGUAGE;
}

export function VoiceProvider({
  children,
  siteLocale,
  messages,
  isTyping,
  onSend,
}: VoiceProviderProps) {
  const { playMessage, stop: stopSpeech } = useSpeech();
  const prefs = loadVoicePreferences();

  const [voiceMode, setVoiceModeState] = useState<VoiceMode>(prefs.mode);
  const [language, setLanguageState] = useState<string>(
    localeToVoiceLanguage(siteLocale)
  );
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);

  const lastSpokenMessageIdRef = useRef<string | null>(null);
  const onSendRef = useRef(onSend);
  const voiceModeRef = useRef(voiceMode);
  onSendRef.current = onSend;
  voiceModeRef.current = voiceMode;

  useEffect(() => {
    const engine = getSttEngine();
    setIsVoiceSupported(engine.isSupported());
    return engine.subscribe(({ recordingState: state, interimTranscript: interim }) => {
      setRecordingState(state);
      setInterimTranscript(interim);
    });
  }, []);

  useEffect(() => {
    const bcp47 = localeToVoiceLanguage(siteLocale);
    setLanguageState(bcp47);
    saveVoicePreferences({ mode: voiceModeRef.current, language: bcp47 });
  }, [siteLocale]);

  const persist = useCallback((mode: VoiceMode, lang: string) => {
    saveVoicePreferences({ mode, language: lang });
  }, []);

  const setVoiceMode = useCallback(
    (mode: VoiceMode) => {
      if (!isVoiceSupported && isVoiceModeActive(mode)) return;
      setVoiceModeState(mode);
      persist(mode, language);
      if (mode === "text-only") {
        getSttEngine().abort();
        stopSpeech();
      }
    },
    [isVoiceSupported, language, persist, stopSpeech]
  );

  const setLanguage = useCallback(
    (lang: string) => {
      setLanguageState(lang);
      persist(voiceMode, lang);
    },
    [voiceMode, persist]
  );

  const handleFinalTranscript = useCallback(
    (transcript: string) => {
      const detected = detectLanguageFromText(transcript, language);
      if (detected !== language) {
        setLanguageState(detected);
        persist(voiceMode, detected);
      }
      onSendRef.current(transcript);
    },
    [language, voiceMode, persist]
  );

  const startRecording = useCallback(() => {
    if (!isVoiceSupported || isTyping) return;

    ensureAudioPlaybackUnlocked();
    getSttEngine().start({
      lang: language || DEFAULT_LANGUAGE,
      onInterim: (text) => setInterimTranscript(text),
      onFinal: handleFinalTranscript,
    });
  }, [isVoiceSupported, isTyping, language, handleFinalTranscript]);

  const stopRecording = useCallback(() => {
    getSttEngine().stop();
  }, []);

  const cancelRecording = useCallback(() => {
    getSttEngine().abort();
    setInterimTranscript("");
  }, []);

  const toggleRecording = useCallback(() => {
    if (recordingState === "recording") {
      stopRecording();
      return;
    }
    if (recordingState === "idle") {
      startRecording();
    }
  }, [recordingState, startRecording, stopRecording]);

  // Auto-Speak: KI-Antwort vorlesen, wenn Voice Mode aktiv
  useEffect(() => {
    if (!shouldAutoSpeakResponses(voiceMode) || isTyping) return;

    const lastMessage = messages[messages.length - 1];
    if (
      !lastMessage ||
      lastMessage.role !== "assistant" ||
      lastMessage.status === "error" ||
      !lastMessage.content.trim()
    ) {
      return;
    }

    if (lastSpokenMessageIdRef.current === lastMessage.id) return;
    lastSpokenMessageIdRef.current = lastMessage.id;

    playMessage(lastMessage.id, lastMessage.content);
  }, [messages, isTyping, voiceMode, playMessage]);

  useEffect(() => {
    return () => {
      getSttEngine().abort();
    };
  }, []);

  const isVoiceInputActive = isVoiceModeActive(voiceMode);

  const value = useMemo<VoiceContextValue>(
    () => ({
      voiceMode,
      setVoiceMode,
      language,
      setLanguage,
      isVoiceSupported,
      recordingState,
      interimTranscript,
      isVoiceInputActive,
      startRecording,
      stopRecording,
      cancelRecording,
      toggleRecording,
    }),
    [
      voiceMode,
      setVoiceMode,
      language,
      setLanguage,
      isVoiceSupported,
      recordingState,
      interimTranscript,
      isVoiceInputActive,
      startRecording,
      stopRecording,
      cancelRecording,
      toggleRecording,
    ]
  );

  return (
    <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>
  );
}

export function useVoice(): VoiceContextValue {
  const ctx = useContext(VoiceContext);
  if (!ctx) {
    throw new Error("useVoice must be used within VoiceProvider");
  }
  return ctx;
}

export function useVoiceOptional(): VoiceContextValue | null {
  return useContext(VoiceContext);
}

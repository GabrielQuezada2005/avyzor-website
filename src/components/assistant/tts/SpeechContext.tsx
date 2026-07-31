"use client";

/**
 * Text-to-Speech – React Context
 *
 * Stellt globale Wiedergabe-Steuerung bereit.
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
import {
  getTtsEngine,
  type SpeechPlaybackState,
} from "@/lib/assistant/tts";

interface SpeechContextValue {
  activeMessageId: string | null;
  playbackState: SpeechPlaybackState;
  playMessage: (messageId: string, text: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

const SpeechContext = createContext<SpeechContextValue | null>(null);

interface SpeechProviderProps {
  children: ReactNode;
}

export function SpeechProvider({ children }: SpeechProviderProps) {
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [playbackState, setPlaybackState] =
    useState<SpeechPlaybackState>("idle");

  useEffect(() => {
    const engine = getTtsEngine();
    return engine.subscribe(({ messageId, playbackState: state }) => {
      setActiveMessageId(messageId);
      setPlaybackState(state);
    });
  }, []);

  const playMessage = useCallback((messageId: string, text: string) => {
    void getTtsEngine().speak({ messageId, text });
  }, []);

  const pause = useCallback(() => {
    getTtsEngine().pause();
  }, []);

  const resume = useCallback(() => {
    getTtsEngine().resume();
  }, []);

  const stop = useCallback(() => {
    getTtsEngine().stop();
  }, []);

  const value = useMemo<SpeechContextValue>(
    () => ({
      activeMessageId,
      playbackState,
      playMessage,
      pause,
      resume,
      stop,
    }),
    [activeMessageId, playbackState, playMessage, pause, resume, stop]
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

/**
 * Optionaler Hook – gibt null zurück, wenn kein Provider vorhanden.
 * Verhindert Fehler in Storybook/Tests.
 */
export function useSpeechOptional(): SpeechContextValue | null {
  return useContext(SpeechContext);
}

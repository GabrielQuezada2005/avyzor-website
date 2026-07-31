/**
 * Voice Mode – Browser Speech Recognition Provider
 *
 * Standard-Implementierung über die native Web Speech API
 * (SpeechRecognition / webkitSpeechRecognition).
 */

import type {
  RecordingState,
  SttProvider,
  SttStartOptions,
  SttStateListener,
} from "../types";

/** Webkit-Präfix für Safari. */
type SpeechRecognitionConstructor = new () => SpeechRecognition;

function getSpeechRecognitionCtor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;

  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export class BrowserSttProvider implements SttProvider {
  readonly id = "browser" as const;

  private recognition: SpeechRecognition | null = null;
  private listeners = new Set<SttStateListener>();
  private recordingState: RecordingState = "idle";
  private interimTranscript = "";

  isSupported(): boolean {
    return getSpeechRecognitionCtor() !== null;
  }

  subscribe(listener: SttStateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(): void {
    const snapshot = {
      recordingState: this.recordingState,
      interimTranscript: this.interimTranscript,
    };
    this.listeners.forEach((l) => l(snapshot));
  }

  private setState(state: RecordingState, interim = ""): void {
    this.recordingState = state;
    this.interimTranscript = interim;
    this.emit();
  }

  start(options: SttStartOptions): void {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;

    this.abort();

    const recognition = new Ctor();
    this.recognition = recognition;

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = options.lang;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      this.setState("recording");
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let finalText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0]?.transcript ?? "";
        if (result.isFinal) {
          finalText += transcript;
        } else {
          interim += transcript;
        }
      }

      if (interim) {
        this.setState("recording", interim);
        options.onInterim?.(interim);
      }

      if (finalText.trim()) {
        this.setState("processing", finalText);
        options.onFinal(finalText.trim());
      }
    };

    recognition.onerror = () => {
      // Stilles Fallback – kein Fehlerdialog
      this.cleanup();
      options.onEnd?.();
    };

    recognition.onend = () => {
      this.cleanup();
      options.onEnd?.();
    };

    try {
      recognition.start();
    } catch {
      this.cleanup();
      options.onEnd?.();
    }
  }

  stop(): void {
    if (!this.recognition) return;
    try {
      this.recognition.stop();
    } catch {
      this.cleanup();
    }
  }

  abort(): void {
    if (!this.recognition) return;
    try {
      this.recognition.abort();
    } catch {
      // ignore
    }
    this.cleanup();
  }

  private cleanup(): void {
    this.recognition = null;
    this.setState("idle");
  }
}

let browserInstance: BrowserSttProvider | null = null;

export function getBrowserSttProvider(): BrowserSttProvider {
  if (!browserInstance) {
    browserInstance = new BrowserSttProvider();
  }
  return browserInstance;
}

/**
 * Voice Mode – OpenAI Realtime API Provider (Vorbereitung)
 *
 * Platzhalter für bidirektionale Echtzeit-Sprachkommunikation
 * über die OpenAI Realtime API (WebSocket).
 *
 * Integration (später):
 * 1. API-Route oder Edge-Proxy für WebSocket-Session
 * 2. WebSocket zu OpenAI Realtime verbinden
 * 3. Audio-Stream senden/empfangen
 * 4. Transkripte + Antworten an Chat-UI weiterleiten
 *
 * @example
 * ```ts
 * const ws = new WebSocket('/api/assistant/realtime');
 * ws.onmessage = (event) => {
 *   const data = JSON.parse(event.data);
 *   if (data.type === 'transcript') onFinal(data.text);
 *   if (data.type === 'audio') playAudioChunk(data.chunk);
 * };
 * ws.send(JSON.stringify({ type: 'session.update', language: lang }));
 * ```
 */

import type { SttProvider, SttStartOptions, SttStateListener } from "../types";

export class OpenAiRealtimeProvider implements SttProvider {
  readonly id = "openai-realtime" as const;

  private listeners = new Set<SttStateListener>();

  isSupported(): boolean {
    return false;
  }

  subscribe(listener: SttStateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  start(_options: SttStartOptions): void {
    throw new Error(
      "OpenAI Realtime ist noch nicht konfiguriert. Nutze Browser-Speech-Recognition."
    );
  }

  stop(): void {
    /* future: ws.close session */
  }

  abort(): void {
    /* future: ws abort */
  }
}

let realtimeInstance: OpenAiRealtimeProvider | null = null;

export function getOpenAiRealtimeProvider(): OpenAiRealtimeProvider {
  if (!realtimeInstance) {
    realtimeInstance = new OpenAiRealtimeProvider();
  }
  return realtimeInstance;
}

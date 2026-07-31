# Text-to-Speech (TTS) – KI-Spracharchitektur

## Übersicht

Professionelle KI-Sprachausgabe für den Website-Assistenten.  
**OpenAI `gpt-4o-mini-tts`** ist der Standard-Anbieter. **ElevenLabs** ist optional vorbereitet.  
**Browser Speech Synthesis** dient als stiller Fallback – ohne Fehlermeldung für Nutzer.

> **Scope:** Nur die Sprachausgabe wurde verbessert. Chat, Voice Mode, Mehrsprachigkeit,
> Lead-Scoring, CRM-Vorbereitung und alle anderen Features sind unverändert.

---

## Architektur-Diagramm

```
┌─────────────────────────────────────────────────────────────────┐
│  UI (unverändert)                                               │
│  MessageSpeechButton · TtsSettingsPanel · Voice Mode Auto-Speak │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│  SpeechContext (React)                                          │
│  · Probe GET /api/assistant/tts                                 │
│  · Locale → BCP-47 (de-DE, en-US, …)                           │
│  · Stimmenliste für Einstellungs-Panel                          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│  TtsEngine (Singleton)                                          │
│  · Provider-Auswahl · Pause/Resume/Stop · Preference-Bridge     │
└────────────┬─────────────────────────────┬──────────────────────┘
             │                             │
┌────────────▼────────────┐   ┌────────────▼──────────────────────┐
│  CloudSpeechProvider    │   │  BrowserSpeechProvider            │
│  (OpenAI / ElevenLabs)  │   │  (Fallback)                       │
│                         │   │                                   │
│  POST /api/assistant/tts│   │  Web Speech API                   │
│  Streaming MP3          │   │  SpeechSynthesisUtterance         │
│  MediaSource Playback   │   │  select-voice.ts (Premium-Score)  │
└────────────┬────────────┘   └───────────────────────────────────┘
             │
┌────────────▼────────────────────────────────────────────────────┐
│  API Route: /api/assistant/tts                                  │
│  GET  → Status, aktiver Provider, Stimmen                       │
│  POST → Audio-Generierung (Streaming)                           │
└────────────┬────────────────────────────────────────────────────┘
             │
┌────────────▼────────────────────────────────────────────────────┐
│  generate-tts.server.ts (Router)                                │
│  ├── generate-openai-speech.server.ts                           │
│  │     · gpt-4o-mini-tts + instructions (Emotion, Pausen)       │
│  │     · Streaming via OpenAI SDK                               │
│  └── generate-elevenlabs-speech.server.ts                       │
│        · eleven_multilingual_v2                                 │
│        · Streaming via /text-to-speech/{id}/stream              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Dateistruktur

### Server (API-Key geschützt)

| Datei | Zweck |
|-------|-------|
| `src/app/api/assistant/tts/route.ts` | REST-Endpunkt (GET Status, POST Audio-Stream) |
| `src/lib/assistant/tts/generate-tts.server.ts` | Router zwischen OpenAI und ElevenLabs |
| `src/lib/assistant/tts/generate-openai-speech.server.ts` | OpenAI TTS (+ Streaming, Instructions) |
| `src/lib/assistant/tts/generate-elevenlabs-speech.server.ts` | ElevenLabs TTS (+ Streaming) |
| `src/lib/assistant/tts/tts-service-error.ts` | Typisierte Server-Fehler |
| `src/lib/env.server.ts` | Env-Getter (`TTS_PROVIDER`, API-Keys) |

### Client (Browser)

| Datei | Zweck |
|-------|-------|
| `src/lib/assistant/tts/providers/cloud-speech-provider.ts` | Cloud-TTS mit Streaming + Fallback |
| `src/lib/assistant/tts/providers/browser-speech-provider.ts` | Browser-Fallback |
| `src/lib/assistant/tts/stream-audio-playback.ts` | MediaSource-Streaming, Blob-Fallback |
| `src/lib/assistant/tts/tts-engine.ts` | Zentraler Orchestrator |
| `src/components/assistant/tts/SpeechContext.tsx` | React Context |
| `src/components/assistant/tts/MessageSpeechButton.tsx` | Lautsprecher-Button + Lade-Spinner |
| `src/components/assistant/tts/TtsSettingsPanel.tsx` | Stimme/Geschwindigkeit/Lautstärke |

### Konfiguration & Stimmen

| Datei | Zweck |
|-------|-------|
| `src/lib/assistant/tts/openai-voices.ts` | OpenAI-Stimmen + Sprach-Mapping |
| `src/lib/assistant/tts/elevenlabs-voices.ts` | ElevenLabs-Stimmen + Sprach-Mapping |
| `src/lib/assistant/tts/tts-instructions.ts` | Premium-Berater-Ton pro Sprache |
| `src/lib/assistant/tts/validation.ts` | Zod-Schema für API-Requests |
| `src/lib/assistant/tts/preferences.ts` | localStorage-Nutzer-Einstellungen |

### Unverändert (bestehende Features)

| Bereich | Status |
|---------|--------|
| Chat / Assistant API | ✅ unverändert |
| Voice Mode (Mikrofon, STT, Auto-Speak) | ✅ unverändert |
| Mehrsprachigkeit (next-intl, 5 Locales) | ✅ unverändert |
| Lead-Scoring / CRM-Vorbereitung | ✅ unverändert |
| Formulare, Pipeline, Booking | ✅ unverändert |
| MessageSpeechButton UI/UX | ✅ erhalten (+ Lade-Spinner) |

---

## Konfiguration (.env.local)

### OpenAI (Standard)

```env
OPENAI_API_KEY=sk-proj-...
TTS_PROVIDER=openai
OPENAI_TTS_MODEL=gpt-4o-mini-tts
OPENAI_TTS_VOICE=shimmer
```

| Variable | Pflicht | Standard | Beschreibung |
|----------|---------|----------|--------------|
| `OPENAI_API_KEY` | Ja | – | Gleicher Key wie Chat-Assistent |
| `TTS_PROVIDER` | Nein | `openai` | Aktiver Cloud-Anbieter |
| `OPENAI_TTS_MODEL` | Nein | `gpt-4o-mini-tts` | Natürliche KI-Stimme |
| `OPENAI_TTS_VOICE` | Nein | `shimmer` | Fallback-Stimme |

### ElevenLabs (Optional)

```env
TTS_PROVIDER=elevenlabs
ELEVENLABS_API_KEY=...
ELEVENLABS_MODEL_ID=eleven_multilingual_v2
ELEVENLABS_VOICE_ID=onwK4e9ZLuTAKqWW03F9
```

| Variable | Pflicht | Standard | Beschreibung |
|----------|---------|----------|--------------|
| `ELEVENLABS_API_KEY` | Ja* | – | *Nur wenn ElevenLabs aktiv |
| `ELEVENLABS_MODEL_ID` | Nein | `eleven_multilingual_v2` | Multilingual |
| `ELEVENLABS_VOICE_ID` | Nein | Daniel | Gut für Deutsch |

> **Sicherheit:** Alle Keys sind server-only. Niemals `NEXT_PUBLIC_` verwenden.

---

## Anbieter wechseln

```env
# OpenAI (Standard)
TTS_PROVIDER=openai

# ElevenLabs
TTS_PROVIDER=elevenlabs
ELEVENLABS_API_KEY=dein-key
```

**Priorität:** Bevorzugter Provider → alternativer Cloud-Provider → Browser-Fallback.

Nach Änderung: Dev-Server neu starten (`npm run dev`).

---

## Automatische Sprachauswahl

Die Website-Locale (`de`, `en`, `es`, `fr`, `it`) wird über `SpeechContext` in BCP-47 umgewandelt
und an die TTS-API übergeben.

### OpenAI Stimmen-Mapping

| Sprache | Stimme | Charakter |
|---------|--------|-----------|
| Deutsch | **shimmer** | klar, professionell, Premium-Berater |
| Englisch | alloy | neutral, professionell |
| Spanisch | shimmer | klar, freundlich |
| Französisch | shimmer | klar, freundlich |
| Italienisch | shimmer | klar, professionell |

Zusätzlich: sprachspezifische `instructions` für Betonung, Emotion und Pausen
(siehe `tts-instructions.ts`).

### ElevenLabs Stimmen-Mapping

| Sprache | Stimme |
|---------|--------|
| Deutsch | Daniel |
| Englisch | Sarah |
| Spanisch/Französisch | Charlotte |
| Italienisch | Sarah |

---

## Streaming & Latenz

1. Client sendet `POST /api/assistant/tts` mit `stream: true`
2. Server generiert Audio via OpenAI/ElevenLabs Streaming-API
3. Response: `Transfer-Encoding: chunked`, `Content-Type: audio/mpeg`
4. Client: MediaSource startet Wiedergabe beim ersten Chunk
5. Fallback: vollständiger Blob-Download in älteren Browsern

---

## Fehlerbehandlung

| Szenario | Verhalten |
|----------|-----------|
| Kein API-Key | Browser Speech API (still) |
| API-Fehler (401, 429, 5xx) | Browser Speech API (still) |
| Netzwerkfehler | Browser Speech API (still) |
| Streaming-Fehler | Browser Speech API (still) |

Keine Fehlermeldung für Endnutzer. Der Übergang ist transparent.

---

## Nutzer-Einstellungen

Persistiert in `localStorage` (`avyzor-assistant-tts-prefs`):

- Stimme (Auto oder manuell)
- Geschwindigkeit (0.5 – 2.0)
- Lautstärke (0 – 1)
- Tonhöhe (nur Browser-Fallback)

UI: Chatbot → Zahnrad → Bereich **Stimme**

---

## Wiedergabe-Ablauf

```
1. Nutzer klickt Lautsprecher-Button
2. State → "loading" (Spinner sichtbar)
3. POST /api/assistant/tts
4. Erster Audio-Chunk → State → "playing" (Auto-Start)
5. Ende → State → "idle"
```

Voice Mode Auto-Speak nutzt denselben Pfad über `SpeechContext.playMessage()`.

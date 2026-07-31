# Text-to-Speech (TTS)

## Übersicht

Moderne KI-TTS-Architektur mit **OpenAI gpt-4o-mini-tts** als Standard und optional **ElevenLabs**.  
**Browser Speech Synthesis** als stiller Fallback bei Fehlern oder fehlendem API-Key.

## Architektur

```
MessageSpeechButton → SpeechContext → TtsEngine
  → CloudSpeechProvider (OpenAI oder ElevenLabs)
      → POST /api/assistant/tts (Streaming MP3)
      → MediaSource-Wiedergabe (niedrige Latenz)
  → BrowserSpeechProvider (Fallback)
```

## Anbieter wechseln

In `.env.local`:

```env
TTS_PROVIDER=openai      # Standard
# TTS_PROVIDER=elevenlabs
```

Priorität: Bevorzugter Provider → alternativer Cloud-Provider → Browser.

## OpenAI (Standard)

| Variable | Standard | Beschreibung |
|----------|----------|--------------|
| `OPENAI_API_KEY` | – | Pflicht |
| `OPENAI_TTS_MODEL` | `gpt-4o-mini-tts` | Natürliche KI-Stimme mit Emotionen |
| `OPENAI_TTS_VOICE` | `nova` | Fallback-Stimme |

Sprachspezifische Stimmen: de→nova, en→alloy, es/fr→shimmer, it→nova

## ElevenLabs (Optional)

| Variable | Standard | Beschreibung |
|----------|----------|--------------|
| `ELEVENLABS_API_KEY` | – | Pflicht für ElevenLabs |
| `ELEVENLABS_MODEL_ID` | `eleven_multilingual_v2` | Multilingual |
| `ELEVENLABS_VOICE_ID` | Daniel | Gut für Deutsch |

## Streaming

Server streamt MP3-Chunks (`Transfer-Encoding: chunked`).  
Client nutzt MediaSource für frühen Wiedergabestart, Blob-Fallback in älteren Browsern.

## Nutzer-Einstellungen

Persistiert in `localStorage` – Stimme, Geschwindigkeit, Lautstärke.  
Tonhöhe nur für Browser-Fallback.

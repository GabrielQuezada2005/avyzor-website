# Text-to-Speech (TTS)

## Übersicht

**OpenAI Text-to-Speech** als Premium-Standard (natürliche KI-Stimmen, niedrige Latenz).  
**Browser Speech Synthesis** als stiller Fallback, wenn kein API-Key gesetzt ist oder die API ausfällt.

## Premium-Stimmen (OpenAI)

| Stimme   | Charakter              | DE-Empfehlung |
|----------|------------------------|---------------|
| **nova** | warm, natürlich        | ✓ Standard DE |
| shimmer  | klar, freundlich       |               |
| alloy    | neutral, ausgewogen    | EN-Standard   |
| echo     | männlich, ruhig        |               |
| fable    | erzählerisch           |               |
| onyx     | tief, souverän         |               |

Modelle: `tts-1-hd` (Qualität, Standard) · `tts-1` (schneller)

## Architektur

```
MessageSpeechButton → SpeechContext → TtsEngine
  → OpenAiSpeechProvider (Primär)
      → POST /api/assistant/tts → OpenAI audio.speech.create()
      → HTMLAudioElement-Wiedergabe
  → BrowserSpeechProvider (Fallback bei Fehler / ohne Key)
```

## Konfiguration (.env.local)

| Variable           | Beschreibung                          | Standard    |
|--------------------|---------------------------------------|-------------|
| `OPENAI_API_KEY`   | Pflicht (gleicher Key wie Chat)       | –           |
| `OPENAI_TTS_MODEL` | `tts-1-hd` oder `tts-1`               | `tts-1-hd`  |
| `OPENAI_TTS_VOICE` | Standard-Stimme                       | `nova`      |

## Nutzer-Einstellungen

Persistiert in `localStorage` (`avyzor-assistant-tts-prefs`):

- Stimme (Auto oder manuell)
- Geschwindigkeit (0.5 – 2.0, Standard **1.15**)
- Tonhöhe (nur Browser-Fallback)
- Lautstärke (0 – 1)

UI: Chatbot → Zahnrad → Bereich **Stimme**

## Browser-Fallback

`select-voice.ts` bewertet System-Stimmen per Score (Apple Enhanced, Neural, localService).  
Wird nur genutzt, wenn OpenAI TTS nicht verfügbar ist.

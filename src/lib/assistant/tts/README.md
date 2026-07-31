# Text-to-Speech (TTS)

## Übersicht

Browser Speech Synthesis als Standard-Provider mit Premium-Stimmenauswahl und Nutzer-Einstellungen.

## Stimmenqualität

`select-voice.ts` bewertet verfügbare Stimmen per Score:

- **Sprach-Match** (höchste Priorität)
- **Apple Enhanced/Premium** auf macOS (Anna, Markus, …)
- **Neural/Natural**-Stimmen (Google, Microsoft)
- **localService** (System-Stimmen statt Cloud)
- Abwertung: Compact, Novelty, eSpeak

Standard: automatisch beste Stimme (`voiceUri: null`).

## Standard-Wiedergabe

| Parameter | Standard |
|-----------|----------|
| Rate      | **1.15** (natürlicher als 1.0) |
| Pitch     | 1.0      |
| Volume    | 1.0      |

## Nutzer-Einstellungen

Persistiert in `localStorage` (`avyzor-assistant-tts-prefs`):

- Stimme (Auto oder manuell)
- Geschwindigkeit (0.5 – 2.0)
- Tonhöhe (0 – 2)
- Lautstärke (0 – 1)

UI: Chatbot → Zahnrad → Bereich **Stimme**

## Architektur

```
TtsSettingsPanel → SpeechContext → TtsEngine → BrowserSpeechProvider
                                        ↓
                              preferences.ts (localStorage)
                              select-voice.ts (Qualitäts-Score)
```

OpenAI TTS bleibt als optionaler Provider vorbereitet (`openai-speech-provider.ts`).

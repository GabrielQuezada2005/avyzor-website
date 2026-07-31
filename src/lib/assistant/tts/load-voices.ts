/**
 * Text-to-Speech – Stimmen laden
 *
 * Lädt verfügbare Browser-Stimmen (asynchron in manchen Browsern).
 */

import { rankVoicesForLanguage } from "./select-voice";

export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve([]);
      return;
    }

    const synth = window.speechSynthesis;
    const existing = synth.getVoices();
    if (existing.length > 0) {
      resolve(existing);
      return;
    }

    const onVoicesChanged = () => {
      synth.removeEventListener("voiceschanged", onVoicesChanged);
      resolve(synth.getVoices());
    };

    synth.addEventListener("voiceschanged", onVoicesChanged);

    setTimeout(() => {
      synth.removeEventListener("voiceschanged", onVoicesChanged);
      resolve(synth.getVoices());
    }, 250);
  });
}

/** Stimmen für eine Zielsprache filtern und nach Qualität sortieren. */
export async function loadVoicesForLanguage(
  lang: string
): Promise<SpeechSynthesisVoice[]> {
  const voices = await loadVoices();
  return rankVoicesForLanguage(voices, lang);
}

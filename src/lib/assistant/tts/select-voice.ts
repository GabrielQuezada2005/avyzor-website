/**
 * Text-to-Speech – Stimmenauswahl
 *
 * Wählt die bestpassende Stimme für einen BCP-47-Sprachcode.
 */

/** Browser SpeechSynthesisVoice – nur im Client verfügbar. */
export type BrowserVoice = SpeechSynthesisVoice;

/**
 * Wählt die beste verfügbare Stimme für die Zielsprache.
 * Kein Fehler bei fehlender Stimme – fallback auf erste verfügbare.
 */
export function selectBestVoice(
  voices: BrowserVoice[],
  lang: string
): BrowserVoice | null {
  if (voices.length === 0) return null;

  const prefix = lang.split("-")[0].toLowerCase();

  const byLang = voices.filter((v) =>
    v.lang.toLowerCase().startsWith(prefix)
  );

  const pool = byLang.length > 0 ? byLang : voices;

  return (
    pool.find((v) => v.default) ??
    pool.find((v) => v.localService) ??
    pool[0] ??
    null
  );
}

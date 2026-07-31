/**
 * Text-to-Speech – Spracherkennung aus Nachrichtentext
 *
 * Leichte Heuristik ohne externe Abhängigkeiten.
 */

const LANGUAGE_PATTERNS: Array<{ lang: string; pattern: RegExp }> = [
  { lang: "de-DE", pattern: /[äöüßÄÖÜ]|(\b(und|der|die|das|ich|Sie|wir|nicht|eine|für)\b)/i },
  { lang: "es-ES", pattern: /[áéíóúñ¿¡]|(\b(el|la|los|las|gracias|hola|por favor)\b)/i },
  { lang: "fr-FR", pattern: /[àâçéèêëîïôùû]|(\b(le|la|les|vous|nous|merci)\b)/i },
  { lang: "en-US", pattern: /\b(the|and|you|your|we|is|are|with|for|this)\b/i },
];

/**
 * Erkennt die wahrscheinliche Sprache eines Textes.
 * Fallback: de-DE (AVYZOR-Standard).
 */
export function detectLanguageFromText(
  text: string,
  fallback = "de-DE"
): string {
  const sample = text.slice(0, 500);

  for (const { lang, pattern } of LANGUAGE_PATTERNS) {
    if (pattern.test(sample)) return lang;
  }

  return fallback;
}

/**
 * Text-to-Speech – Textaufbereitung
 *
 * Entfernt Elemente, die sich schlecht vorlesen lassen.
 */

/**
 * Bereitet Chat-Text für natürliche Sprachausgabe auf.
 */
export function sanitizeTextForSpeech(text: string): string {
  return (
    text
      // Markdown-Links: [Label](url) → Label
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      // URLs entfernen
      .replace(/https?:\/\/\S+/gi, "")
      // Markdown-Formatierung
      .replace(/[*_#`~]/g, "")
      // Mehrfache Leerzeilen reduzieren
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

/**
 * Formatiert geladene Wissensdokumente als LLM-Kontext.
 *
 * Reine Textfunktion – ohne Dateisystem oder API-Abhängigkeiten.
 * Später durch Chunk-Auswahl / Retrieval erweiterbar.
 */

import type { LoadedKnowledgeDocument } from "./types";

/**
 * Wandelt Wissensdokumente in einen strukturierten Kontext-Block für das Sprachmodell um.
 */
export function formatKnowledgeDocumentsForContext(
  documents: LoadedKnowledgeDocument[]
): string {
  if (documents.length === 0) {
    return "(Keine Wissensdokumente verfügbar.)";
  }

  return documents
    .map(({ document, sourceFile }) => {
      const summaryLine = document.summary
        ? `Zusammenfassung: ${document.summary}\n`
        : "";

      return [
        `### ${document.title}`,
        `Kategorie: ${document.category} | ID: ${document.id} | Quelle: ${sourceFile}`,
        summaryLine + document.content.trim(),
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n---\n\n");
}

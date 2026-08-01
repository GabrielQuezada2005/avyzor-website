import "server-only";

import { formatKnowledgeDocumentsForContext } from "./format-knowledge-context";
import { loadKnowledge } from "./loadKnowledge";
import type { LoadedKnowledgeDocument } from "./types";

const KNOWLEDGE_USAGE_INSTRUCTIONS = `WISSENSBASIS (RAG) – NUTZUNGSREGELN:
- Die folgenden Dokumente aus data/knowledge sind die primäre Quelle für AVYZOR-spezifische Fakten.
- Bevorzuge diese Informationen bei Fragen zu Unternehmen, Leistungen, Preisen und FAQ.
- Enthält die Wissensbasis keine passende Information, darfst du mit allgemeinem Fachwissen antworten.
- Erfinde keine AVYZOR-spezifischen Fakten (Preise, Pakete, Leistungen), die nicht in der Wissensbasis stehen.
- Bei Widersprüchen zu firmenspezifischen Fakten gilt die Wissensbasis.`;

function normalizeLocalePrefix(locale?: string): string | null {
  if (!locale) return null;
  return locale.split("-")[0].toLowerCase();
}

/**
 * Filtert Dokumente nach Sprache. Fallback: alle Dokumente, wenn keine passende Locale.
 */
export function filterKnowledgeByLocale(
  documents: LoadedKnowledgeDocument[],
  locale?: string
): LoadedKnowledgeDocument[] {
  const prefix = normalizeLocalePrefix(locale);
  if (!prefix) return documents;

  const matched = documents.filter((entry) => {
    const docLocale = entry.document.locale.toLowerCase();
    return docLocale === prefix || docLocale.startsWith(`${prefix}-`);
  });

  return matched.length > 0 ? matched : documents;
}

/**
 * Lädt die Wissensbasis und bereitet sie als System-Prompt-Kontext für den Assistenten auf.
 * Wird vor jeder KI-Antwort aufgerufen.
 */
export async function getAssistantKnowledgeContext(
  locale?: string
): Promise<string> {
  const knowledgeBase = await loadKnowledge();
  const documents = filterKnowledgeByLocale(knowledgeBase.documents, locale);
  const formatted = formatKnowledgeDocumentsForContext(documents);

  return `${KNOWLEDGE_USAGE_INSTRUCTIONS}\n\n${formatted}`;
}

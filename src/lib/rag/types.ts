/**
 * Wissensbasis (RAG) – Typen
 *
 * Einheitliche Datenstruktur für alle Wissensdokumente.
 * Erweiterbar für spätere Schritte: Chunking, Embeddings, Vektorsuche, Chat-Anbindung.
 */

/** Unterstützte Dateiformate im Ordner data/knowledge */
export const KNOWLEDGE_FILE_EXTENSIONS = [".md", ".markdown"] as const;

export type KnowledgeFileExtension = (typeof KNOWLEDGE_FILE_EXTENSIONS)[number];

/** Metadaten aus dem YAML-Frontmatter einer Markdown-Datei */
export interface KnowledgeDocumentMetadata {
  /** Eindeutige ID innerhalb der Wissensbasis (Standard: Dateiname ohne Endung) */
  id: string;
  /** Anzeigetitel des Dokuments */
  title: string;
  /** Sprache des Inhalts (z. B. de, en) */
  locale: string;
  /** Grobe Kategorie für Filterung und Retrieval (z. B. company, faq) */
  category: string;
  /** Schlagwörter für Suche und späteres Retrieval */
  tags: string[];
  /** Kurzfassung für Vorschau oder Snippets */
  summary: string;
  /** ISO-Datum der letzten inhaltlichen Aktualisierung */
  updatedAt: string;
}

/** Vollständiges Wissensdokument nach dem Laden */
export interface KnowledgeDocument extends KnowledgeDocumentMetadata {
  /** Markdown-Inhalt ohne Frontmatter – Basis für Chunking und Embeddings */
  content: string;
  /** Rohtext der Datei inklusive Frontmatter */
  rawContent: string;
}

/** Ergebnis beim Laden einer einzelnen Quelldatei */
export interface LoadedKnowledgeDocument {
  /** Dateiname ohne Pfad (z. B. company.md) */
  sourceFile: string;
  /** Relativer Pfad ab data/knowledge */
  relativePath: string;
  document: KnowledgeDocument;
}

/**
 * Gesamtergebnis von loadKnowledge().
 * Zentraler Container für alle geladenen Wissensdaten.
 */
export interface KnowledgeBase {
  /** Alle geladenen und validierten Dokumente */
  documents: LoadedKnowledgeDocument[];
  /** Absoluter Pfad zum Wissensdaten-Ordner */
  sourceDir: string;
  /** ISO-Zeitstempel des Ladevorgangs */
  loadedAt: string;
}

/**
 * Vorbereitet für spätere Chunk-Aufteilung (noch nicht implementiert).
 * Jeder Chunk kann separat embedded und indexiert werden.
 */
export interface KnowledgeChunk {
  id: string;
  documentId: string;
  content: string;
  index: number;
}

/**
 * Vorbereitet für spätere Vektorsuche (noch nicht implementiert).
 */
export interface EmbeddedKnowledgeChunk extends KnowledgeChunk {
  embedding: number[];
}

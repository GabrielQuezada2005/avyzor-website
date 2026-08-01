import "server-only";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { KNOWLEDGE_DIR } from "./constants";
import { parseMarkdownKnowledgeFile } from "./parse-frontmatter";
import {
  KNOWLEDGE_FILE_EXTENSIONS,
  type KnowledgeBase,
  type KnowledgeDocument,
  type LoadedKnowledgeDocument,
} from "./types";

const KNOWLEDGE_CACHE_TTL_MS = 60_000;
let cachedKnowledge: KnowledgeBase | null = null;
let cacheExpiresAt = 0;

function isKnowledgeFile(fileName: string): boolean {
  const lowerName = fileName.toLowerCase();
  return KNOWLEDGE_FILE_EXTENSIONS.some((extension) =>
    lowerName.endsWith(extension)
  );
}

function toKnowledgeDocument(
  parsed: ReturnType<typeof parseMarkdownKnowledgeFile>
): KnowledgeDocument {
  const { metadata, content, rawContent } = parsed;

  return {
    id: metadata.id!,
    title: metadata.title!,
    locale: metadata.locale!,
    category: metadata.category!,
    tags: metadata.tags ?? [],
    summary: metadata.summary ?? "",
    updatedAt: metadata.updatedAt!,
    content,
    rawContent,
  };
}

/**
 * Lädt alle Wissensdateien aus data/knowledge und gibt eine einheitliche Struktur zurück.
 *
 * Server-only: verwendet das Dateisystem.
 * Angebunden über getAssistantKnowledgeContext() im KI-Assistenten.
 * Nächste Schritte: Chunking → Embeddings → Vektorsuche.
 */
export async function loadKnowledge(): Promise<KnowledgeBase> {
  const now = Date.now();
  if (cachedKnowledge && now < cacheExpiresAt) {
    return cachedKnowledge;
  }

  const entries = await readdir(KNOWLEDGE_DIR, { withFileTypes: true });
  const fileNames = entries
    .filter((entry) => entry.isFile() && isKnowledgeFile(entry.name))
    .map((entry) => entry.name)
    .sort();

  const documents: LoadedKnowledgeDocument[] = [];

  for (const fileName of fileNames) {
    const filePath = path.join(KNOWLEDGE_DIR, fileName);
    const rawContent = await readFile(filePath, "utf8");
    const parsed = parseMarkdownKnowledgeFile(rawContent, fileName);

    documents.push({
      sourceFile: fileName,
      relativePath: path.join("data", "knowledge", fileName),
      document: toKnowledgeDocument(parsed),
    });
  }

  cachedKnowledge = {
    documents,
    sourceDir: KNOWLEDGE_DIR,
    loadedAt: new Date().toISOString(),
  };
  cacheExpiresAt = now + KNOWLEDGE_CACHE_TTL_MS;

  return cachedKnowledge;
}

/**
 * Lädt ein einzelnes Wissensdokument anhand seiner ID.
 * Gibt null zurück, wenn kein passendes Dokument gefunden wurde.
 */
export async function loadKnowledgeById(
  id: string
): Promise<LoadedKnowledgeDocument | null> {
  const knowledgeBase = await loadKnowledge();
  return knowledgeBase.documents.find((entry) => entry.document.id === id) ?? null;
}

/**
 * Hilfsfunktion: nur die Dokumentinhalte ohne Datei-Metadaten.
 */
export async function loadKnowledgeDocuments(): Promise<KnowledgeDocument[]> {
  const knowledgeBase = await loadKnowledge();
  return knowledgeBase.documents.map((entry) => entry.document);
}

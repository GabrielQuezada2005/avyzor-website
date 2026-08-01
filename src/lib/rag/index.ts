/**
 * Wissensbasis (RAG) – Öffentliche API
 *
 * Zentraler Einstiegspunkt zum Laden von Wissensdaten aus data/knowledge.
 * Embeddings und Vektorsuche folgen in späteren Entwicklungsschritten.
 */

export {
  loadKnowledge,
  loadKnowledgeById,
  loadKnowledgeDocuments,
} from "./loadKnowledge";

export { getAssistantKnowledgeContext } from "./get-assistant-knowledge-context.server";

export { formatKnowledgeDocumentsForContext } from "./format-knowledge-context";

export { filterKnowledgeByLocale } from "./get-assistant-knowledge-context.server";

export { KNOWLEDGE_DIR, KNOWLEDGE_DIR_NAME } from "./constants";

export {
  KNOWLEDGE_FILE_EXTENSIONS,
  type EmbeddedKnowledgeChunk,
  type KnowledgeBase,
  type KnowledgeChunk,
  type KnowledgeDocument,
  type KnowledgeDocumentMetadata,
  type KnowledgeFileExtension,
  type LoadedKnowledgeDocument,
} from "./types";

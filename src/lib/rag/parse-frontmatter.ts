/**
 * Minimaler YAML-Frontmatter-Parser für Markdown-Wissensdateien.
 *
 * Unterstützt einzeilige Schlüssel-Wert-Paare und kommagetrennte Tag-Listen.
 * Keine externe Abhängigkeit – ausreichend für strukturierte Wissensdateien.
 */

import type { KnowledgeDocumentMetadata } from "./types";

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

interface ParsedFrontmatter {
  metadata: Partial<KnowledgeDocumentMetadata>;
  content: string;
  rawContent: string;
}

function parseTags(value: string): string[] {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function parseFrontmatterBlock(block: string): Partial<KnowledgeDocumentMetadata> {
  const metadata: Partial<KnowledgeDocumentMetadata> = {};

  for (const line of block.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf(":");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    switch (key) {
      case "id":
        metadata.id = value;
        break;
      case "title":
        metadata.title = value;
        break;
      case "locale":
        metadata.locale = value;
        break;
      case "category":
        metadata.category = value;
        break;
      case "summary":
        metadata.summary = value;
        break;
      case "updatedAt":
        metadata.updatedAt = value;
        break;
      case "tags":
        metadata.tags = parseTags(value);
        break;
      default:
        break;
    }
  }

  return metadata;
}

function deriveIdFromFileName(fileName: string): string {
  return fileName.replace(/\.(md|markdown)$/i, "");
}

function deriveTitleFromId(id: string): string {
  return id
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/**
 * Parst eine Markdown-Datei mit optionalem YAML-Frontmatter.
 * Fehlende Metadaten werden aus dem Dateinamen abgeleitet.
 */
export function parseMarkdownKnowledgeFile(
  rawContent: string,
  fileName: string
): ParsedFrontmatter {
  const match = rawContent.match(FRONTMATTER_PATTERN);

  if (!match) {
    const fallbackId = deriveIdFromFileName(fileName);
    return {
      metadata: {
        id: fallbackId,
        title: deriveTitleFromId(fallbackId),
        locale: "de",
        category: fallbackId,
        tags: [],
        summary: "",
        updatedAt: new Date().toISOString().slice(0, 10),
      },
      content: rawContent.trim(),
      rawContent,
    };
  }

  const [, frontmatterBlock, body] = match;
  const metadata = parseFrontmatterBlock(frontmatterBlock);
  const fallbackId = deriveIdFromFileName(fileName);

  return {
    metadata: {
      id: metadata.id ?? fallbackId,
      title: metadata.title ?? deriveTitleFromId(fallbackId),
      locale: metadata.locale ?? "de",
      category: metadata.category ?? fallbackId,
      tags: metadata.tags ?? [],
      summary: metadata.summary ?? "",
      updatedAt:
        metadata.updatedAt ?? new Date().toISOString().slice(0, 10),
    },
    content: body.trim(),
    rawContent,
  };
}

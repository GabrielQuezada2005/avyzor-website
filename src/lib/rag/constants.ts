import path from "node:path";

/** Relativer Pfad zum Wissensdaten-Ordner (ab Projektroot) */
export const KNOWLEDGE_DIR_NAME = "data/knowledge";

/** Absoluter Pfad zum Wissensdaten-Ordner */
export const KNOWLEDGE_DIR = path.join(process.cwd(), KNOWLEDGE_DIR_NAME);

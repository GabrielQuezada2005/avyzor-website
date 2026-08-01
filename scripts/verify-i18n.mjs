#!/usr/bin/env node
/**
 * Prüft i18n-Vollständigkeit: Dateien vorhanden und Schlüssel-Parität zu Referenz-Locale (de).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const messagesDir = path.join(root, "src/messages");

const REFERENCE_LOCALE = "de";

/** Aktive Locales – synchron zu src/i18n/locale-config.ts */
const ACTIVE_LOCALES = ["de", "en", "es", "fr", "it"];

/** Namespaces – synchron zu src/lib/i18n/namespaces.ts */
const MESSAGE_NAMESPACES = [
  "metadata",
  "nav",
  "header",
  "footer",
  "hero",
  "services",
  "pricing",
  "why",
  "portfolio",
  "testimonials",
  "faq",
  "contact",
  "cta",
  "forms",
  "assistant",
  "voice",
  "tts",
  "notFound",
  "newsletter",
  "legal",
  "common",
  "skipLink",
];

function collectKeys(obj, prefix = "") {
  const keys = [];
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
    return keys;
  }
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      keys.push(...collectKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys.sort();
}

async function loadNamespace(locale, namespace) {
  const filePath = path.join(messagesDir, locale, `${namespace}.ts`);
  if (!fs.existsSync(filePath)) {
    return { missing: true, keys: [] };
  }
  const mod = await import(pathToFileURL(filePath).href);
  const data = mod.default ?? mod;
  return { missing: false, keys: collectKeys(data) };
}

function diffKeys(reference, target) {
  const refSet = new Set(reference);
  const targetSet = new Set(target);
  return {
    missing: reference.filter((k) => !targetSet.has(k)),
    extra: target.filter((k) => !refSet.has(k)),
  };
}

async function main() {
  let failed = false;
  const referenceMessages = {};

  console.log(`\n🔍 i18n verification (reference: ${REFERENCE_LOCALE})\n`);

  for (const namespace of MESSAGE_NAMESPACES) {
    const ref = await loadNamespace(REFERENCE_LOCALE, namespace);
    if (ref.missing) {
      console.error(`✗ Missing reference file: ${REFERENCE_LOCALE}/${namespace}.ts`);
      failed = true;
      continue;
    }
    referenceMessages[namespace] = ref.keys;
  }

  for (const locale of ACTIVE_LOCALES) {
    console.log(`Locale: ${locale}`);

    for (const namespace of MESSAGE_NAMESPACES) {
      const result = await loadNamespace(locale, namespace);

      if (result.missing) {
        console.error(`  ✗ missing ${namespace}.ts`);
        failed = true;
        continue;
      }

      if (locale === REFERENCE_LOCALE) {
        console.log(`  ✓ ${namespace} (${result.keys.length} keys)`);
        continue;
      }

      const { missing, extra } = diffKeys(
        referenceMessages[namespace],
        result.keys
      );

      if (missing.length || extra.length) {
        failed = true;
        console.error(`  ✗ ${namespace}`);
        if (missing.length) {
          console.error(`      missing keys (${missing.length}): ${missing.slice(0, 5).join(", ")}${missing.length > 5 ? "…" : ""}`);
        }
        if (extra.length) {
          console.error(`      extra keys (${extra.length}): ${extra.slice(0, 5).join(", ")}${extra.length > 5 ? "…" : ""}`);
        }
      } else {
        console.log(`  ✓ ${namespace}`);
      }
    }

    console.log("");
  }

  if (failed) {
    console.error("i18n verification failed.\n");
    process.exit(1);
  }

  console.log(`✓ All ${ACTIVE_LOCALES.length} locales have complete message parity.\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

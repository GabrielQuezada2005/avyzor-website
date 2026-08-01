#!/usr/bin/env node
/**
 * Richtet das Supabase-Schema ein bzw. prüft die Vollständigkeit.
 * Ausführung: node scripts/setup-supabase-schema.mjs
 *
 * Wenn DATABASE_URL oder SUPABASE_DB_URL gesetzt ist, werden fehlende
 * Migrationen aus supabase/migrations/ angewendet.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const migrationsDir = path.join(root, "supabase", "migrations");
const envPath = path.join(root, ".env.local");

function loadEnvLocal() {
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;

    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

function fail(message) {
  console.error(`❌ Setup-Fehler: ${message}`);
  process.exit(1);
}

loadEnvLocal();

console.log("→ Prüfe Supabase-Verbindung…");
const connection = spawnSync("node", ["scripts/verify-supabase.mjs"], {
  cwd: root,
  stdio: "inherit",
});

if (connection.status !== 0) {
  process.exit(connection.status ?? 1);
}

console.log("→ Prüfe Datenbankschema…");
const schema = spawnSync("node", ["scripts/verify-supabase-schema.mjs"], {
  cwd: root,
  stdio: "inherit",
});

if (schema.status !== 0) {
  const dbUrl =
    (process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL ?? "").trim();

  if (!dbUrl) {
    fail(
      "Schema unvollständig. Setze DATABASE_URL in .env.local oder führe die SQL-Dateien aus supabase/migrations/ im Supabase SQL Editor aus."
    );
  }

  console.log("→ Wende Migrationen über DATABASE_URL an…");

  let pg;
  try {
    pg = await import("pg");
  } catch {
    fail(
      "Schema unvollständig und pg-Modul nicht verfügbar. Führe supabase/migrations/*.sql im Supabase SQL Editor aus."
    );
  }

  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  const pool = new pg.default.Pool({ connectionString: dbUrl, max: 1 });

  try {
    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
      console.log(`  · ${file}`);
      await pool.query(sql);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    fail(`Migration fehlgeschlagen: ${message}`);
  } finally {
    await pool.end();
  }

  const recheck = spawnSync("node", ["scripts/verify-supabase-schema.mjs"], {
    cwd: root,
    stdio: "inherit",
  });

  if (recheck.status !== 0) {
    fail("Schema nach Migration weiterhin unvollständig");
  }
}

console.log("✅ Supabase-Datenbankstruktur erfolgreich eingerichtet");

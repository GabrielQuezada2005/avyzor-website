#!/usr/bin/env node
/**
 * Prüft, ob alle erforderlichen Supabase-Tabellen erreichbar sind.
 * Ausführung: node scripts/verify-supabase-schema.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const envPath = path.join(root, ".env.local");

const REQUIRED_TABLES = [
  "leads",
  "newsletter_subscribers",
  "quote_requests",
  "bookings",
  "crm_leads",
  "crm_quotes",
  "crm_email_logs",
  "crm_appointments",
  "crm_payments",
  "portal_users",
];

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

function normalizeSupabaseUrl(url) {
  return url.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}

function fail(message) {
  console.error(`❌ Schema-Fehler: ${message}`);
  process.exit(1);
}

loadEnvLocal();

const url = normalizeSupabaseUrl(
  (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim()
);
const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();

if (!url || !serviceRoleKey) {
  fail("Supabase-Umgebungsvariablen fehlen (.env.local)");
}

const client = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const missing = [];

for (const table of REQUIRED_TABLES) {
  const { error } = await client
    .from(table)
    .select("id", { head: true, count: "exact" });

  if (error) {
    missing.push(`${table} (${error.message})`);
  }
}

if (missing.length > 0) {
  fail(`Fehlende Tabellen: ${missing.join(", ")}`);
}

console.log(`✅ Supabase-Schema vollständig (${REQUIRED_TABLES.length} Tabellen)`);

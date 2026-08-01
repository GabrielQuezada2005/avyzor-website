#!/usr/bin/env node
/**
 * Supabase-Verbindungstest.
 * Ausführung: node scripts/verify-supabase.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
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

function isPlaceholder(value, markers) {
  if (!value.trim()) return true;
  const lower = value.toLowerCase();
  return markers.some((marker) => lower.includes(marker));
}

function fail(message) {
  console.error(`❌ Fehler: ${message}`);
  process.exit(1);
}

loadEnvLocal();

const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();
const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();

if (!url || isPlaceholder(url, ["your-project"])) {
  fail("NEXT_PUBLIC_SUPABASE_URL fehlt oder ist ungültig (.env.local)");
}

if (!anonKey || isPlaceholder(anonKey, ["your-anon"])) {
  fail("NEXT_PUBLIC_SUPABASE_ANON_KEY fehlt oder ist ungültig (.env.local)");
}

if (!serviceRoleKey || isPlaceholder(serviceRoleKey, ["your-service"])) {
  fail("SUPABASE_SERVICE_ROLE_KEY fehlt oder ist ungültig (.env.local)");
}

const anonClient = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { error: anonError } = await anonClient.auth.getSession();
if (anonError) {
  fail(`Anon-Client: ${anonError.message}`);
}

const adminClient = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { error: adminError } = await adminClient
  .from("leads")
  .select("id", { head: true, count: "exact" });

if (adminError) {
  fail(`Datenbank: ${adminError.message}`);
}

console.log("✅ Supabase erfolgreich verbunden");

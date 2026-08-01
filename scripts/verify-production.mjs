#!/usr/bin/env node
/**
 * Production-Readiness-Verifikation.
 * Ausführung: node scripts/verify-production.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(filePath) {
  return fs.readFileSync(path.join(root, filePath), "utf8");
}

function exists(filePath) {
  return fs.existsSync(path.join(root, filePath));
}

console.log("→ Prüfe Production-Dateien…");
const requiredFiles = [
  "src/lib/env.public.ts",
  "src/lib/logging/server.ts",
  "src/lib/logging/client.ts",
  "src/app/api/health/route.ts",
  "instrumentation.ts",
  "vercel.json",
  ".github/workflows/ci.yml",
  "DEPLOYMENT.md",
  "README.md",
  ".env.example",
];

for (const file of requiredFiles) {
  assert(exists(file), `Fehlende Datei: ${file}`);
}

console.log("→ Prüfe Rate Limiting…");
const security = read("src/lib/api/security.ts");
assert(security.includes("RateLimitProfile"), "Rate-Limit-Profile fehlen");
assert(security.includes("auth:"), "Auth-Rate-Limit fehlt");
assert(security.includes("isDebugEndpointEnabled"), "Debug-Gate fehlt");

const crmAuth = read("src/app/api/crm/auth/route.ts");
assert(crmAuth.includes('checkRateLimit(request, "auth"'), "CRM-Auth Rate Limit fehlt");

const portalLogin = read("src/app/api/portal/auth/login/route.ts");
assert(portalLogin.includes('checkRateLimit(request, "auth"'), "Portal-Login Rate Limit fehlt");

console.log("→ Prüfe Security Headers…");
const nextConfig = read("next.config.mjs");
assert(nextConfig.includes("Content-Security-Policy"), "CSP fehlt");
assert(nextConfig.includes("microphone=(self)"), "Mikrofon-Policy fehlt");

console.log("→ Prüfe Validierung…");
const validations = read("src/lib/validations.ts");
assert(validations.includes("crmAuthSchema"), "crmAuthSchema fehlt");
assert(validations.includes("portalLoginSchema"), "portalLoginSchema fehlt");

console.log("→ Prüfe Env-Trennung…");
const constants = read("src/lib/constants.ts");
assert(constants.includes("env.public"), "Public env in constants fehlt");

const envExample = read(".env.example");
const secretKeys = [
  "CRM_ADMIN_SECRET",
  "PORTAL_AUTH_SECRET",
  "SUPABASE_SERVICE_ROLE_KEY",
  "STRIPE_SECRET_KEY",
  "OPENAI_API_KEY",
];
for (const key of secretKeys) {
  assert(envExample.includes(key), `.env.example fehlt: ${key}`);
}

console.log("→ Prüfe Fehlerseiten…");
const localeError = read("src/app/[locale]/error.tsx");
assert(localeError.includes("errorCode"), "Locale error code fehlt");
assert(localeError.includes("errorHome"), "Locale error home link fehlt");

console.log("→ Prüfe TTS Debug Absicherung…");
const ttsDebug = read("src/app/api/assistant/tts/debug/route.ts");
assert(ttsDebug.includes("isDebugEndpointEnabled"), "TTS debug gate fehlt");

console.log("→ Prüfe Health Endpoint…");
const health = read("src/app/api/health/route.ts");
assert(health.includes("checkProductionEnvironment"), "Production env check fehlt");

console.log("✓ Production-Readiness-Verifikation erfolgreich.");

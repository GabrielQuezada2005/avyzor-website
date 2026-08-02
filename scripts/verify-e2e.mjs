#!/usr/bin/env node
/**
 * Vollständiger End-to-End-Smoke-Test (Seiten, APIs, i18n, Supabase).
 * Ausführung: node scripts/verify-e2e.mjs [baseUrl]
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const envPath = path.join(root, ".env.local");
const BASE = process.argv[2] ?? "http://localhost:3000";

function loadActiveLocales() {
  const configPath = path.join(root, "src/i18n/locale-config.ts");
  const source = fs.readFileSync(configPath, "utf8");
  const locales = [...source.matchAll(/^\s*code:\s*"([a-z]{2})"/gm)].map(
    (match) => match[1]
  );
  if (locales.length === 0) {
    throw new Error("Keine Locales in src/i18n/locale-config.ts gefunden");
  }
  return locales;
}

const LOCALES = loadActiveLocales();
const PUBLIC_PATHS = ["/", "/impressum", "/datenschutz"];
const ADMIN_PATHS = ["/admin", "/portal/login", "/portal/register"];
const API_GET = [
  "/api/health",
  "/api/supabase/health",
  "/api/booking/availability?date=2026-08-15",
  "/sitemap.xml",
  "/robots.txt",
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

const failures = [];
const warnings = [];

function fail(message) {
  failures.push(message);
  console.error(`  ✗ ${message}`);
}

function warn(message) {
  warnings.push(message);
  console.warn(`  ⚠ ${message}`);
}

function pass(message) {
  console.log(`  ✓ ${message}`);
}

async function check(method, url, options = {}) {
  const response = await fetch(url, { method, redirect: "manual", ...options });
  return response;
}

loadEnvLocal();

console.log(`→ E2E-Smoke-Test: ${BASE}\n`);

console.log("→ Öffentliche Seiten (alle Locales)…");
for (const locale of LOCALES) {
  for (const pagePath of PUBLIC_PATHS) {
    const path = pagePath === "/" ? `/${locale}` : `/${locale}${pagePath}`;
    try {
      const res = await check("GET", `${BASE}${path}`);
      if (res.status !== 200) {
        fail(`${path} → HTTP ${res.status}`);
      } else {
        pass(`${path}`);
      }
    } catch (error) {
      fail(`${path} → ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

console.log("\n→ Admin & Portal…");
for (const pagePath of ADMIN_PATHS) {
  try {
    const res = await check("GET", `${BASE}${pagePath}`);
    if (res.status !== 200) {
      fail(`${pagePath} → HTTP ${res.status}`);
    } else {
      pass(pagePath);
    }
  } catch (error) {
    fail(`${pagePath} → ${error instanceof Error ? error.message : String(error)}`);
  }
}

console.log("\n→ API GET-Routen…");
for (const apiPath of API_GET) {
  try {
    const res = await check("GET", `${BASE}${apiPath}`);
    if (apiPath === "/api/health") {
      const body = await res.json();
      if (!body.checks?.supabase) {
        fail(`${apiPath} → Supabase nicht bereit`);
      } else if (res.status === 503 && !body.checks?.forms) {
        warn(`${apiPath} → degradiert (E-Mail-Backend fehlt)`);
        pass(`${apiPath} → ${res.status} (Supabase ok)`);
      } else if (res.status >= 500) {
        fail(`${apiPath} → HTTP ${res.status}`);
      } else {
        pass(`${apiPath} → ${res.status}`);
      }
      continue;
    }

    if (res.status >= 500) {
      fail(`${apiPath} → HTTP ${res.status}`);
    } else {
      pass(`${apiPath} → ${res.status}`);
    }
  } catch (error) {
    fail(`${apiPath} → ${error instanceof Error ? error.message : String(error)}`);
  }
}

console.log("\n→ Newsletter-Bestätigung (Locale-Redirect)…");
try {
  const res = await check("GET", `${BASE}/api/newsletter/confirm?token=invalid&locale=en`);
  const location = res.headers.get("location") ?? "";
  if (!location.includes("/en/newsletter/fehler")) {
    fail(`Newsletter-Redirect ohne Locale: ${location}`);
  } else {
    pass(`Newsletter-Redirect → ${location}`);
  }
} catch (error) {
  fail(`Newsletter-Redirect → ${error instanceof Error ? error.message : String(error)}`);
}

console.log("\n→ CRM-Auth…");
try {
  const res = await check("POST", `${BASE}/api/crm/auth`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: "wrong-password" }),
  });
  if (res.status !== 401) {
    fail(`/api/crm/auth → erwartet 401, erhalten ${res.status}`);
  } else {
    pass("/api/crm/auth konfiguriert (401 bei falschem Passwort)");
  }
} catch (error) {
  fail(`/api/crm/auth → ${error instanceof Error ? error.message : String(error)}`);
}

console.log("\n→ Portal-Auth…");
try {
  const res = await check("POST", `${BASE}/api/portal/auth/login`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "nobody@example.com", password: "wrongpass1" }),
  });
  if (res.status === 503) {
    fail("/api/portal/auth/login → Portal nicht konfiguriert");
  } else if (res.status !== 401 && res.status !== 404) {
    fail(`/api/portal/auth/login → erwartet 401/404, erhalten ${res.status}`);
  } else {
    pass(`/api/portal/auth/login konfiguriert (${res.status})`);
  }
} catch (error) {
  fail(`/api/portal/auth/login → ${error instanceof Error ? error.message : String(error)}`);
}

console.log("\n→ KI-Assistent…");
try {
  const res = await check("POST", `${BASE}/api/assistant`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: "Hallo, ich brauche eine Website." }],
      sessionId: "e2e-verify-session-01",
      locale: "de",
    }),
  });
  const body = await res.json();
  if (res.status === 503) {
    fail("/api/assistant → OpenAI nicht konfiguriert");
  } else if (!body.success || !body.message) {
    fail(`/api/assistant → unerwartete Antwort (${res.status})`);
  } else {
    pass("/api/assistant liefert Antwort");
  }
} catch (error) {
  fail(`/api/assistant → ${error instanceof Error ? error.message : String(error)}`);
}

console.log("\n→ Terminbuchung (Verfügbarkeit + Buchung)…");
try {
  let booked = false;

  for (let day = 21; day <= 28 && !booked; day += 1) {
    const date = `2026-08-${String(day).padStart(2, "0")}`;
    const availabilityRes = await check(
      "GET",
      `${BASE}/api/booking/availability?date=${date}`
    );
    const availability = await availabilityRes.json();
    const slot = availability?.slots?.find((entry) => entry.available)?.time;

    if (!slot) continue;

    const bookingRes = await check("POST", `${BASE}/api/booking`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "E2E Test",
        email: "e2e-booking@avyzor.local",
        date,
        time: slot,
        consent: true,
        website: "",
      }),
    });
    const bookingBody = await bookingRes.json();

    if (bookingRes.status === 200 && bookingBody.success) {
      pass(`/api/booking → Termin ${date} ${slot} gebucht`);
      booked = true;
    } else if (bookingRes.status === 409) {
      continue;
    } else {
      fail(`/api/booking → HTTP ${bookingRes.status} (${date})`);
      booked = true;
    }
  }

  if (!booked) {
    warn("Kein freier Termin in Testzeitraum – Buchungstest übersprungen");
  }
} catch (error) {
  fail(`/api/booking → ${error instanceof Error ? error.message : String(error)}`);
}

console.log("\n→ Formulare…");
const resendConfigured = Boolean((process.env.RESEND_API_KEY ?? "").trim());

try {
  const contactRes = await check("POST", `${BASE}/api/contact`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "E2E Test",
      email: "e2e-contact@avyzor.local",
      message: "Automatischer E2E-Test der Kontaktformular-API.",
      consent: true,
      website: "",
    }),
  });
  if (contactRes.status === 200) {
    pass("/api/contact → in Supabase gespeichert");
  } else {
    fail(`/api/contact → HTTP ${contactRes.status}`);
  }
} catch (error) {
  fail(`/api/contact → ${error instanceof Error ? error.message : String(error)}`);
}

try {
  const quoteRes = await check("POST", `${BASE}/api/quote`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "E2E Test",
      email: "e2e-quote@avyzor.local",
      service: "Premium-Website",
      description: "Automatischer E2E-Test der Angebotsformular-API.",
      consent: true,
      website: "",
    }),
  });
  if (quoteRes.status === 200) {
    pass("/api/quote → in Supabase gespeichert");
  } else {
    fail(`/api/quote → HTTP ${quoteRes.status}`);
  }
} catch (error) {
  fail(`/api/quote → ${error instanceof Error ? error.message : String(error)}`);
}

if (!resendConfigured) {
  warn("RESEND_API_KEY fehlt – Newsletter Double-Opt-In und E-Mail-Benachrichtigungen deaktiviert");
} else {
  pass("Resend konfiguriert");
}

console.log("\n→ Supabase Setup…");
try {
  const res = await check("GET", `${BASE}/api/supabase/health`);
  const body = await res.json();
  if (!body.connected || !body.schema) {
    fail("Supabase-Verbindung oder Schema unvollständig");
  } else {
    pass(`Supabase verbunden (${body.tables?.length ?? 0} Tabellen)`);
  }
} catch (error) {
  fail(`Supabase → ${error instanceof Error ? error.message : String(error)}`);
}

console.log("");
if (failures.length > 0) {
  console.error(`❌ E2E-Smoke-Test fehlgeschlagen (${failures.length} Fehler)`);
  process.exit(1);
}

if (warnings.length > 0) {
  console.warn(`⚠ E2E-Smoke-Test mit ${warnings.length} Hinweis(en) bestanden`);
} else {
  console.log("✅ E2E-Smoke-Test vollständig bestanden");
}

#!/usr/bin/env node
/**
 * Führt Unit-, Integrations- und E2E-Tests aus und erzeugt einen Testbericht.
 */

import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const reportsDir = path.join(root, "tests", "reports");
mkdirSync(reportsDir, { recursive: true });

function runStep(label, command, args, env = {}) {
  const startedAt = Date.now();
  const result = spawnSync(command, args, {
    cwd: root,
    env: { ...process.env, ...env },
    encoding: "utf8",
    stdio: "pipe",
  });
  const durationMs = Date.now() - startedAt;

  return {
    label,
    command: `${command} ${args.join(" ")}`.trim(),
    exitCode: result.status ?? 1,
    durationMs,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

const steps = [];

console.log("▶ Unit- und Integrationstests (Vitest) …");
steps.push(runStep("Vitest", "npx", ["vitest", "run"]));

console.log("▶ Production Build …");
steps.push(runStep("Build", "npm", ["run", "build"]));

console.log("▶ End-to-End-Tests (Playwright) …");
steps.push(
  runStep("Playwright", "npx", ["playwright", "test"], {
    CI: "true",
  })
);

const summary = {
  generatedAt: new Date().toISOString(),
  overallSuccess: steps.every((step) => step.exitCode === 0),
  steps: steps.map(({ label, command, exitCode, durationMs }) => ({
    label,
    command,
    success: exitCode === 0,
    exitCode,
    durationMs,
  })),
};

writeFileSync(
  path.join(reportsDir, "test-summary.json"),
  JSON.stringify(summary, null, 2)
);

const reportLines = [
  "# AVYZOR Testbericht",
  "",
  `Erstellt: ${new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}`,
  "",
  "## Zusammenfassung",
  "",
  summary.overallSuccess
    ? "✅ Alle Test-Suites erfolgreich"
    : "❌ Mindestens eine Test-Suite fehlgeschlagen",
  "",
  "| Suite | Status | Dauer |",
  "| --- | --- | ---: |",
  ...summary.steps.map((step) => {
    const status = step.success ? "✅ bestanden" : "❌ fehlgeschlagen";
    const seconds = (step.durationMs / 1000).toFixed(1);
    return `| ${step.label} | ${status} | ${seconds}s |`;
  }),
  "",
  "## Abgedeckte Bereiche",
  "",
  "- **Unit-Tests:** Validierung, Sicherheit, Lead-Erkennung, Terminverfügbarkeit, CRM-Mapping",
  "- **Integrationstests:** Kontakt-API, Assistant-API, Buchungs-API, Portal-Login, CRM-Auth",
  "- **E2E-Tests:** Kontaktformular, KI-Chat, Lead-Erkennung, Terminbuchung, Login",
  "",
  "## Artefakte",
  "",
  "- `tests/reports/vitest-junit.xml`",
  "- `tests/reports/playwright-junit.xml`",
  "- `tests/reports/playwright-html/` (HTML-Report)",
  "- `tests/reports/test-summary.json`",
  "",
];

writeFileSync(path.join(reportsDir, "TESTBERICHT.md"), reportLines.join("\n"));

for (const step of steps) {
  const status = step.exitCode === 0 ? "OK" : "FEHLER";
  console.log(`\n[${status}] ${step.label} (${(step.durationMs / 1000).toFixed(1)}s)`);
  if (step.stdout.trim()) console.log(step.stdout.trim());
  if (step.stderr.trim()) console.error(step.stderr.trim());
}

console.log(`\nTestbericht: tests/reports/TESTBERICHT.md`);

process.exit(summary.overallSuccess ? 0 : 1);

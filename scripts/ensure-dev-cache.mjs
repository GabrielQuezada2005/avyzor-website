/**
 * Entfernt veraltete .next-Caches, wenn vendor-chunks fehlen.
 * Verhindert: Cannot find module './vendor-chunks/next.js'
 * sowie GET /de 500 ("missing required error components") bei laufenden Alt-Instanzen.
 */
import { execSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const nextDir = join(process.cwd(), ".next");
const vendorNext = join(nextDir, "server/vendor-chunks/next.js");
const webpackCache = join(process.cwd(), "node_modules/.cache");

function stopDevServerOnPort(port) {
  try {
    const pids = execSync(`lsof -ti :${port}`, { encoding: "utf8" })
      .trim()
      .split("\n")
      .filter(Boolean);
    if (pids.length === 0) return;

    console.warn(
      `[avyzor] Beende veralteten Dev-Server auf Port ${port} (PID ${pids.join(", ")})…`
    );
    execSync(`kill -9 ${pids.join(" ")}`, { stdio: "ignore" });
  } catch {
    // Port frei oder kill nicht möglich
  }
}

if (existsSync(nextDir) && !existsSync(vendorNext)) {
  console.warn(
    "[avyzor] Veralteter .next-Cache erkannt (vendor-chunks fehlen) – bereinige…"
  );

  // Laufende Alt-Instanz auf 3000 hält kaputte Chunks → GET /de 500
  stopDevServerOnPort(3000);

  rmSync(nextDir, { recursive: true, force: true });

  if (existsSync(webpackCache)) {
    rmSync(webpackCache, { recursive: true, force: true });
  }
}

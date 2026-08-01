/**
 * Bereinigt .next vor dev/build und beendet Alt-Dev-Server.
 *
 * Verhindert u. a.:
 * - Cannot find module './vendor-chunks/lucide-react.js'
 * - GET /_next/static/... 404 (Hash-Mismatch durch parallele Instanzen)
 * - webpack pack ENOENT nach build+dev-Mix
 */
import { execSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const mode = process.argv[2] === "build" ? "build" : "dev";
const nextDir = join(process.cwd(), ".next");
const vendorDir = join(nextDir, "server/vendor-chunks");
const webpackCache = join(process.cwd(), "node_modules/.cache");

/** Kritische Dev-Chunks – fehlt einer, ist der Cache korrupt. */
const REQUIRED_VENDOR_CHUNKS = [
  "next.js",
  "lucide-react.js",
  "clsx.js",
  "tailwind-merge.js",
  "framer-motion.js",
];

/** Dev-Ports – Alt-Instanzen verursachen 404 auf _next/static. */
const DEV_PORTS = [3000, 3001, 3002, 3003, 3004, 3005, 3006];

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

function stopStaleDevServers() {
  for (const port of DEV_PORTS) {
    stopDevServerOnPort(port);
  }
}

function isProductionBuildCache() {
  return existsSync(join(nextDir, "BUILD_ID"));
}

function isStaleDevCache() {
  if (!existsSync(nextDir)) return false;
  if (isProductionBuildCache()) return true;
  if (!existsSync(vendorDir)) return true;
  return REQUIRED_VENDOR_CHUNKS.some(
    (file) => !existsSync(join(vendorDir, file))
  );
}

function cleanNextCache(reason) {
  console.warn(`[avyzor] ${reason}`);
  rmSync(nextDir, { recursive: true, force: true });
  if (existsSync(webpackCache)) {
    rmSync(webpackCache, { recursive: true, force: true });
  }
}

// Immer Alt-Instanzen beenden (verhindert _next/static 404 durch Port-Mix)
stopStaleDevServers();

if (mode === "build") {
  // Production-Build braucht sauberen Cache; Dev-artifacts → MODULE_NOT_FOUND
  if (existsSync(nextDir)) {
    cleanNextCache("Bereinige .next vor Production-Build…");
  }
} else if (isStaleDevCache()) {
  cleanNextCache(
    "Veralteter .next-Cache (vendor-chunks fehlen, Production-Mix oder korrupt) – bereinige…"
  );
}

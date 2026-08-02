/**
 * Bereinigt .next vor dev/build und beendet Alt-Dev-Server.
 *
 * Verhindert u. a.:
 * - TypeError: __webpack_modules__[moduleId] is not a function
 * - Cannot find module './1682.js'
 * - Cannot find module './vendor-chunks/lucide-react.js'
 * - GET /_next/static/... 404 (Hash-Mismatch durch parallele Instanzen)
 * - webpack pack ENOENT nach build+dev-Mix
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const modeArg = process.argv[2] ?? "dev";
const mode =
  modeArg === "build" ? "build" : modeArg === "clean" ? "clean" : "dev";
const nextDir = join(process.cwd(), ".next");
const vendorDir = join(nextDir, "server/vendor-chunks");
const serverDir = join(nextDir, "server");
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
const DEV_PORTS = [3000, 3001, 3002, 3003, 3004, 3005, 3006, 3099];

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

  // Verwaiste next-dev-Prozesse (z. B. anderer Port) beenden
  for (const pattern of ["next dev", "next-server"]) {
    try {
      execSync(`pkill -f "${pattern}"`, { stdio: "ignore" });
    } catch {
      // Kein passender Prozess
    }
  }
}

function isProductionBuildCache() {
  return existsSync(join(nextDir, "BUILD_ID"));
}

function hasPagesRouterArtifacts() {
  return existsSync(join(serverDir, "pages/_document.js"));
}

function hasMissingVendorChunks() {
  if (!existsSync(vendorDir)) return true;
  return REQUIRED_VENDOR_CHUNKS.some(
    (file) => !existsSync(join(vendorDir, file))
  );
}

function collectJsFiles(dir) {
  if (!existsSync(dir)) return [];

  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectJsFiles(fullPath));
    } else if (entry.name.endsWith(".js")) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * Prüft, ob webpack-runtime oder Page-Bundles auf fehlende Chunk-Dateien verweisen.
 * Typischer Fehler: Cannot find module './1682.js'
 */
function hasMissingServerChunks() {
  if (!existsSync(serverDir)) return false;

  const chunkPattern = /require\("\.\/(\d+\.js)"\)|\.\/(\d+\.js)/g;
  const referencedChunks = new Set();

  for (const filePath of collectJsFiles(serverDir)) {
    const source = readFileSync(filePath, "utf8");
    for (const match of source.matchAll(chunkPattern)) {
      const chunkName = match[1] ?? match[2];
      if (chunkName) referencedChunks.add(chunkName);
    }
  }

  for (const chunkName of referencedChunks) {
    if (!existsSync(join(serverDir, chunkName))) {
      return true;
    }
  }

  return false;
}

function isStaleDevCache() {
  if (!existsSync(nextDir)) return false;
  if (isProductionBuildCache()) return true;
  if (hasPagesRouterArtifacts()) return true;
  if (hasMissingVendorChunks()) return true;
  if (hasMissingServerChunks()) return true;
  return false;
}

function purgeWebpackPersistentCache() {
  const cacheDir = join(nextDir, "cache");
  if (!existsSync(cacheDir)) return;

  console.warn(
    "[avyzor] Entferne veralteten Webpack-Persistent-Cache (.next/cache)…"
  );
  rmSync(cacheDir, { recursive: true, force: true });
}

function cleanNextCache(reason) {
  console.warn(`[avyzor] ${reason}`);
  rmSync(nextDir, { recursive: true, force: true });
  if (existsSync(webpackCache)) {
    rmSync(webpackCache, { recursive: true, force: true });
  }
}

stopStaleDevServers();

if (mode === "clean") {
  cleanNextCache("Vollständige Cache-Bereinigung…");
} else if (mode === "build") {
  // Production-Build braucht sauberen Cache; Dev-artifacts → MODULE_NOT_FOUND
  if (existsSync(nextDir)) {
    cleanNextCache("Bereinige .next vor Production-Build…");
  }
} else if (isStaleDevCache()) {
  cleanNextCache(
    "Veralteter .next-Cache (Production-Mix, fehlende Chunks oder korrupt) – bereinige…"
  );
} else if (existsSync(nextDir)) {
  // Verhindert ENOENT auf .pack.gz und moduleId-Mismatch nach vorherigen Sessions
  purgeWebpackPersistentCache();
}

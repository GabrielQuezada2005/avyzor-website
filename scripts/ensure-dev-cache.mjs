/**
 * Entfernt veraltete .next-Caches, wenn vendor-chunks fehlen.
 * Verhindert: Cannot find module './vendor-chunks/next.js'
 */
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const nextDir = join(process.cwd(), ".next");
const vendorNext = join(nextDir, "server/vendor-chunks/next.js");

if (existsSync(nextDir) && !existsSync(vendorNext)) {
  console.warn(
    "[avyzor] Veralteter .next-Cache erkannt (vendor-chunks fehlen) – bereinige…"
  );
  rmSync(nextDir, { recursive: true, force: true });
}

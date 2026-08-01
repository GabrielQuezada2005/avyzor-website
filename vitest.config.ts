import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["tests/setup.ts"],
    include: ["tests/unit/**/*.test.ts", "tests/integration/**/*.test.ts"],
    exclude: ["tests/e2e/**", "node_modules/**"],
    reporters: ["default", "junit"],
    outputFile: {
      junit: "tests/reports/vitest-junit.xml",
    },
    coverage: {
      provider: "v8",
      reportsDirectory: "tests/reports/coverage",
      include: ["src/lib/**"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

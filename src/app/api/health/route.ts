import { NextResponse } from "next/server";
import { checkProductionEnvironment } from "@/lib/env.server";
import { isFormBackendReady, isSupabaseConfigured } from "@/lib/env";
import { isCrmAdminConfigured, isPortalAuthConfigured } from "@/lib/env.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const productionCheck = checkProductionEnvironment();

  const checks = {
    supabase: isSupabaseConfigured(),
    forms: isFormBackendReady(),
    crm: isCrmAdminConfigured(),
    portal: isPortalAuthConfigured(),
  };

  const healthy = Object.values(checks).every(Boolean);

  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? "1.0.0",
      environment: process.env.NODE_ENV ?? "development",
      checks,
      production: productionCheck,
    },
    {
      status: healthy ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

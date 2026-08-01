import { NextResponse } from "next/server";
import { testSupabaseConnection } from "@/lib/supabase/connection-test.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const result = await testSupabaseConnection();

  return NextResponse.json(
    {
      connected: result.ok,
      env: result.env,
      anonClient: result.anonClient,
      adminClient: result.adminClient,
      schema: result.schema,
      tables: result.tables,
      missingTables: result.missingTables,
      error: result.error ?? null,
      timestamp: new Date().toISOString(),
    },
    {
      status: result.ok ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    }
  );
}

import { NextResponse } from "next/server";
import { clearPortalSessionCookie } from "@/lib/portal/session.server";

export const runtime = "nodejs";

export async function POST() {
  clearPortalSessionCookie();
  return NextResponse.json({ success: true });
}

import "server-only";

import { createClient } from "@supabase/supabase-js";
import { env, isSupabaseConfigured } from "@/lib/env";

const REQUIRED_TABLES = [
  "leads",
  "newsletter_subscribers",
  "quote_requests",
  "bookings",
  "crm_leads",
  "crm_quotes",
  "crm_email_logs",
  "crm_appointments",
  "crm_payments",
  "portal_users",
] as const;

export type SupabaseConnectionCheck = {
  ok: boolean;
  env: {
    url: boolean;
    anonKey: boolean;
    serviceRoleKey: boolean;
  };
  anonClient: boolean;
  adminClient: boolean;
  schema: boolean;
  tables: string[];
  missingTables: string[];
  error?: string;
};

function isPlaceholder(value: string, markers: string[]): boolean {
  if (!value.trim()) return true;
  const lower = value.toLowerCase();
  return markers.some((marker) => lower.includes(marker));
}

export function getSupabaseEnvStatus() {
  const url = env.supabase.url.trim();
  const anonKey = env.supabase.anonKey.trim();
  const serviceRoleKey = env.supabase.serviceRoleKey.trim();

  return {
    url: Boolean(url) && !isPlaceholder(url, ["your-project"]),
    anonKey: Boolean(anonKey) && !isPlaceholder(anonKey, ["your-anon"]),
    serviceRoleKey:
      Boolean(serviceRoleKey) &&
      !isPlaceholder(serviceRoleKey, ["your-service", "your_key"]),
  };
}

export async function testSupabaseConnection(): Promise<SupabaseConnectionCheck> {
  const envStatus = getSupabaseEnvStatus();
  const emptySchema = {
    schema: false,
    tables: [] as string[],
    missingTables: [...REQUIRED_TABLES],
  };

  if (!envStatus.url) {
    return {
      ok: false,
      env: envStatus,
      anonClient: false,
      adminClient: false,
      ...emptySchema,
      error: "NEXT_PUBLIC_SUPABASE_URL fehlt oder ist ungültig",
    };
  }

  if (!envStatus.anonKey) {
    return {
      ok: false,
      env: envStatus,
      anonClient: false,
      adminClient: false,
      ...emptySchema,
      error: "NEXT_PUBLIC_SUPABASE_ANON_KEY fehlt oder ist ungültig",
    };
  }

  if (!envStatus.serviceRoleKey) {
    return {
      ok: false,
      env: envStatus,
      anonClient: false,
      adminClient: false,
      ...emptySchema,
      error: "SUPABASE_SERVICE_ROLE_KEY fehlt oder ist ungültig",
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      env: envStatus,
      anonClient: false,
      adminClient: false,
      ...emptySchema,
      error: "Supabase-Konfiguration unvollständig",
    };
  }

  const anonClient = createClient(env.supabase.url, env.supabase.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error: anonError } = await anonClient.auth.getSession();
  if (anonError) {
    return {
      ok: false,
      env: envStatus,
      anonClient: false,
      adminClient: false,
      ...emptySchema,
      error: `Anon-Client: ${anonError.message}`,
    };
  }

  const adminClient = createClient(
    env.supabase.url,
    env.supabase.serviceRoleKey,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );

  const { error: adminError } = await adminClient
    .from("leads")
    .select("id", { head: true, count: "exact" });

  if (adminError) {
    return {
      ok: false,
      env: envStatus,
      anonClient: true,
      adminClient: false,
      schema: false,
      tables: [],
      missingTables: REQUIRED_TABLES.slice(),
      error: `Datenbank: ${adminError.message}`,
    };
  }

  const missingTables: string[] = [];

  for (const table of REQUIRED_TABLES) {
    const { error } = await adminClient
      .from(table)
      .select("id", { head: true, count: "exact" });

    if (error) {
      missingTables.push(table);
    }
  }

  if (missingTables.length > 0) {
    return {
      ok: false,
      env: envStatus,
      anonClient: true,
      adminClient: true,
      schema: false,
      tables: REQUIRED_TABLES.filter((table) => !missingTables.includes(table)),
      missingTables,
      error: `Fehlende Tabellen: ${missingTables.join(", ")}`,
    };
  }

  return {
    ok: true,
    env: envStatus,
    anonClient: true,
    adminClient: true,
    schema: true,
    tables: [...REQUIRED_TABLES],
    missingTables: [],
  };
}

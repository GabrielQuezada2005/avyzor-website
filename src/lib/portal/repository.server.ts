import "server-only";

import { supabaseAdmin } from "@/lib/supabase";
import { isSupabaseConfigured } from "@/lib/env";
import { getCrmLeadByEmail } from "@/lib/crm/repository.server";
import { upsertCrmLead } from "@/lib/crm/repository.server";
import { PORTAL_USERS_TABLE } from "./constants";
import { hashPortalPassword, verifyPortalPassword } from "./auth.server";
import type {
  PortalRegisterInput,
  PortalRole,
  PortalUser,
  PortalUserRow,
} from "./types";

function assertSupabaseReady(): void {
  if (!isSupabaseConfigured() || !supabaseAdmin) {
    throw new Error("Supabase ist nicht konfiguriert.");
  }
}

function mapPortalUser(row: PortalUserRow): PortalUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    company: row.company,
    role: row.role as PortalRole,
    leadId: row.lead_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function linkOrCreateLead(input: {
  email: string;
  name: string;
  company?: string | null;
}): Promise<string | null> {
  const email = normalizeEmail(input.email);
  const existing = await getCrmLeadByEmail(email);

  if (existing) {
    return existing.id;
  }

  const lead = await upsertCrmLead({
    sessionId: `portal:${email}`,
    name: input.name,
    email,
    company: input.company ?? null,
    source: "manual",
    completenessScore: 29,
  });

  return lead.id;
}

export async function getPortalUserByEmail(
  email: string
): Promise<(PortalUser & { passwordHash: string }) | null> {
  if (!isSupabaseConfigured() || !supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from(PORTAL_USERS_TABLE)
    .select("*")
    .eq("email", normalizeEmail(email))
    .maybeSingle();

  if (error || !data) return null;

  const user = mapPortalUser(data as PortalUserRow);
  return { ...user, passwordHash: (data as PortalUserRow).password_hash };
}

export async function getPortalUserById(id: string): Promise<PortalUser | null> {
  if (!isSupabaseConfigured() || !supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from(PORTAL_USERS_TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return mapPortalUser(data as PortalUserRow);
}

export async function registerPortalUser(
  input: PortalRegisterInput
): Promise<PortalUser> {
  assertSupabaseReady();

  const email = normalizeEmail(input.email);
  const existing = await getPortalUserByEmail(email);
  if (existing) {
    throw new Error("Diese E-Mail-Adresse ist bereits registriert.");
  }

  const leadId = await linkOrCreateLead({
    email,
    name: input.name.trim(),
    company: input.company?.trim() || null,
  });

  const passwordHash = await hashPortalPassword(input.password);

  const { data, error } = await supabaseAdmin!
    .from(PORTAL_USERS_TABLE)
    .insert({
      email,
      password_hash: passwordHash,
      name: input.name.trim(),
      company: input.company?.trim() || null,
      role: "customer",
      lead_id: leadId,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`Registrierung fehlgeschlagen: ${error?.message}`);
  }

  return mapPortalUser(data as PortalUserRow);
}

export async function authenticatePortalUser(
  email: string,
  password: string
): Promise<PortalUser | null> {
  const user = await getPortalUserByEmail(email);
  if (!user) return null;

  const valid = await verifyPortalPassword(password, user.passwordHash);
  if (!valid) return null;

  const { passwordHash: _hash, ...portalUser } = user;
  return portalUser;
}

export async function updatePortalUserLeadLink(
  userId: string,
  leadId: string
): Promise<void> {
  assertSupabaseReady();

  await supabaseAdmin!
    .from(PORTAL_USERS_TABLE)
    .update({ lead_id: leadId, updated_at: new Date().toISOString() })
    .eq("id", userId);
}

/**
 * Admin – Typen
 */

export interface AdminDashboardStats {
  newLeads: number;
  activeCustomers: number;
  quotes: number;
  appointments: number;
  revenueCents: number;
  revenueIsPlaceholder: boolean;
  updatedAt: string;
}

export interface AdminServiceStatus {
  supabase: boolean;
  stripe: boolean;
  resend: boolean;
  portal: boolean;
  crm: boolean;
}

export type AdminNavId =
  | "overview"
  | "crm"
  | "appointments"
  | "payments"
  | "settings";

export interface AdminNavItem {
  id: AdminNavId;
  label: string;
  href: string;
  external?: boolean;
}

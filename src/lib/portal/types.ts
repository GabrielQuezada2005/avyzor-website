/**
 * Kundenportal – Typen
 */

export type PortalRole = "admin" | "employee" | "customer";

export interface PortalUser {
  id: string;
  email: string;
  name: string;
  company: string | null;
  role: PortalRole;
  leadId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PortalUserRow {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  company: string | null;
  role: string;
  lead_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface PortalSession {
  userId: string;
  email: string;
  name: string;
  role: PortalRole;
  leadId: string | null;
}

export interface PortalRegisterInput {
  email: string;
  password: string;
  name: string;
  company?: string;
}

export interface PortalLoginInput {
  email: string;
  password: string;
}

export interface PortalOfferView {
  id: string;
  quoteNumber: string;
  serviceTitle: string;
  priceAmount: number;
  priceCurrency: string;
  validUntil: string;
  status: string;
  createdAt: string;
}

export interface PortalAppointmentView {
  id: string;
  scheduledDate: string;
  scheduledTime: string;
  service: string | null;
  status: string;
  timezone: string;
}

export interface PortalInvoiceView {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: "draft" | "open" | "paid";
  dueDate: string | null;
  createdAt: string;
}

export interface PortalProjectView {
  leadId: string | null;
  status: string;
  statusLabel: string;
  service: string | null;
  completenessScore: number;
  timeline: string | null;
  updatedAt: string;
}

export interface PortalMessageView {
  id: string;
  subject: string;
  templateId: string;
  status: string;
  createdAt: string;
  preview: string | null;
}

export interface PortalDashboardData {
  user: PortalSession;
  offers: PortalOfferView[];
  appointments: PortalAppointmentView[];
  invoices: PortalInvoiceView[];
  project: PortalProjectView | null;
  messages: PortalMessageView[];
}

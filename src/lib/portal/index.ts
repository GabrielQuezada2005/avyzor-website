/**
 * Kundenportal – Öffentliche API (client-sichere Exports)
 */

export {
  PORTAL_SESSION_COOKIE,
  PORTAL_ROLES,
  PORTAL_ROLE_LABELS,
  PORTAL_MIN_PASSWORD_LENGTH,
} from "./constants";

export type {
  PortalRole,
  PortalSession,
  PortalDashboardData,
  PortalOfferView,
  PortalAppointmentView,
  PortalInvoiceView,
  PortalProjectView,
  PortalMessageView,
} from "./types";

export const PORTAL_NAV_ITEMS = [
  { href: "/portal/dashboard", label: "Übersicht" },
  { href: "/portal/offers", label: "Angebote" },
  { href: "/portal/appointments", label: "Termine" },
  { href: "/portal/invoices", label: "Rechnungen" },
  { href: "/portal/projects", label: "Projektstatus" },
  { href: "/portal/messages", label: "Nachrichten" },
] as const;

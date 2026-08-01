/**
 * Admin – Navigation & Konstanten
 */

import type { AdminNavItem } from "./types";

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { id: "overview", label: "Übersicht", href: "/admin" },
  { id: "crm", label: "CRM", href: "/admin/crm" },
  { id: "appointments", label: "Termine", href: "/admin/appointments" },
  { id: "payments", label: "Zahlungen", href: "/admin/payments" },
  { id: "settings", label: "Einstellungen", href: "/admin/settings" },
];

export const ADMIN_PORTAL_LINK: AdminNavItem = {
  id: "overview",
  label: "Kundenportal",
  href: "/portal",
  external: true,
};

export const ADMIN_QUICK_LINKS = [
  {
    title: "CRM",
    description: "Leads verwalten, Angebote & E-Mails",
    href: "/admin/crm",
    external: false,
    accent: "gold",
  },
  {
    title: "Kundenportal",
    description: "Portal für Kunden öffnen",
    href: "/portal",
    external: true,
    accent: "blue",
  },
  {
    title: "Termine",
    description: "Gebuchte Beratungstermine",
    href: "/admin/appointments",
    external: false,
    accent: "green",
  },
  {
    title: "Zahlungen",
    description: "Stripe-Zahlungen & Status",
    href: "/admin/payments",
    external: false,
    accent: "purple",
  },
  {
    title: "Einstellungen",
    description: "Systemstatus & Konfiguration",
    href: "/admin/settings",
    external: false,
    accent: "neutral",
  },
] as const;

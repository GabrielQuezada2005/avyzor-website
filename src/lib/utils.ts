import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { defaultLocale, locales, type Locale } from "@/i18n/locale-config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function resolveLocaleFromPath(pathname: string): Locale {
  const segment = pathname.split("/").filter(Boolean)[0];
  if (segment && locales.includes(segment as Locale)) {
    return segment as Locale;
  }
  return defaultLocale;
}

function isLocaleHomePath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  if (pathname === "/") return true;
  if (segments.length !== 1) return false;
  return locales.includes(segments[0] as Locale);
}

export function scrollToSection(sectionId: string): void {
  if (typeof window === "undefined") return;

  const element = document.getElementById(sectionId);

  if (isLocaleHomePath(window.location.pathname) && element) {
    element.scrollIntoView({ behavior: "smooth" });
    return;
  }

  const locale = resolveLocaleFromPath(window.location.pathname);
  window.location.href = `/${locale}#${sectionId}`;
}

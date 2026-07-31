"use client";

/**
 * Internationalisierung – Sprachumschalter
 *
 * Minimalistisches Premium-Design ohne Flaggen.
 * Zeigt Locale-Kürzel (DE, EN, ES, FR, IT).
 */

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTransition } from "react";

const LOCALE_LABELS: Record<Locale, string> = {
  de: "DE",
  en: "EN",
  es: "ES",
  fr: "FR",
  it: "IT",
};

interface LanguageSwitcherProps {
  compact?: boolean;
  className?: string;
}

export function LanguageSwitcher({
  compact = false,
  className,
}: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(nextLocale: Locale) {
    if (nextLocale === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <div
      role="group"
      aria-label="Sprache wählen"
      className={cn(
        "flex items-center gap-0.5 p-0.5 rounded-lg border border-white/10 bg-dark-800/40",
        isPending && "opacity-70",
        className
      )}
    >
      {locales.map((loc) => {
        const isActive = loc === locale;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => handleChange(loc)}
            aria-label={loc.toUpperCase()}
            aria-current={isActive ? "true" : undefined}
            disabled={isPending}
            className={cn(
              "font-medium transition-all duration-200 rounded-md",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50",
              compact
                ? "px-1.5 py-0.5 text-[10px]"
                : "px-2 py-1 text-xs",
              isActive
                ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                : "text-white/45 hover:text-white/80 hover:bg-white/5 border border-transparent"
            )}
          >
            {LOCALE_LABELS[loc]}
          </button>
        );
      })}
    </div>
  );
}

"use client";

/**
 * Internationalisierung – Sprachumschalter
 *
 * Kompakter Premium-Button mit Dropdown.
 * Sprachen zentral in LANGUAGE_OPTIONS – locale setzen, sobald Routing existiert.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { ChevronDown, Globe } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTransition } from "react";

interface LanguageOption {
  id: string;
  label: string;
  /** Gesetzt, sobald next-intl-Locale verfügbar ist */
  locale?: Locale;
}

/** Erweiterbare Sprachliste – neue Einträge hier ergänzen. */
export const LANGUAGE_OPTIONS: readonly LanguageOption[] = [
  { id: "de", label: "Deutsch", locale: "de" },
  { id: "en", label: "English", locale: "en" },
  { id: "es", label: "Español", locale: "es" },
  { id: "fr", label: "Français", locale: "fr" },
  { id: "it", label: "Italiano", locale: "it" },
  { id: "ru", label: "Русский" },
  { id: "pl", label: "Polski" },
  { id: "tr", label: "Türkçe" },
  { id: "nl", label: "Nederlands" },
  { id: "pt", label: "Português" },
  { id: "ar", label: "العربية" },
  { id: "zh", label: "中文" },
  { id: "ja", label: "日本語" },
  { id: "ko", label: "한국어" },
];

interface LanguageSwitcherProps {
  className?: string;
  /** Volle Breite im Mobile-Drawer */
  fullWidth?: boolean;
}

function findOptionByLocale(locale: Locale): LanguageOption {
  return (
    LANGUAGE_OPTIONS.find((option) => option.locale === locale) ??
    LANGUAGE_OPTIONS[0]
  );
}

export function LanguageSwitcher({
  className,
  fullWidth = false,
}: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const activeOption = useMemo(() => findOptionByLocale(locale), [locale]);

  function handleSelect(option: LanguageOption) {
    if (!option.locale || option.locale === locale) {
      setIsOpen(false);
      return;
    }

    startTransition(() => {
      router.replace(pathname, { locale: option.locale });
      setIsOpen(false);
    });
  }

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div
      ref={rootRef}
      className={cn("relative shrink-0", fullWidth && "w-full", className)}
    >
      <button
        type="button"
        aria-label="Sprache wählen"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        disabled={isPending}
        onClick={() => setIsOpen((open) => !open)}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border border-white/10 bg-dark-800/40",
          "px-3 py-2 text-sm font-medium text-white/70",
          "transition-all duration-200 hover:border-gold-500/30 hover:text-gold-400",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50",
          isPending && "opacity-70",
          fullWidth && "w-full justify-between"
        )}
      >
        <span className="inline-flex min-w-0 items-center gap-2">
          <Globe className="h-4 w-4 shrink-0 text-gold-400/80" aria-hidden />
          <span className="truncate">{activeOption.label}</span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-white/45 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label="Sprache wählen"
          className={cn(
            "absolute right-0 top-full z-50 mt-2 max-h-72 min-w-[12rem] overflow-y-auto rounded-xl",
            "border border-white/10 bg-dark-900/95 py-1 shadow-premium backdrop-blur-xl",
            fullWidth && "left-0 right-0 min-w-0"
          )}
        >
          {LANGUAGE_OPTIONS.map((option) => {
            const isActive = option.locale === locale;
            const isAvailable = Boolean(option.locale);

            return (
              <li key={option.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  disabled={isPending || !isAvailable}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "flex w-full items-center px-3 py-2.5 text-left text-sm transition-colors duration-200",
                    isActive
                      ? "bg-gold-500/15 text-gold-400"
                      : isAvailable
                        ? "text-white/70 hover:bg-white/5 hover:text-gold-400"
                        : "cursor-not-allowed text-white/25"
                  )}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

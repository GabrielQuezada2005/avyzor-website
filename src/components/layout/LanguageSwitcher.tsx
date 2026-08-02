"use client";

/**
 * Internationalisierung – Sprachumschalter
 *
 * Lädt verfügbare Sprachen aus locale-config.ts.
 */

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Globe } from "lucide-react";
import {
  LOCALE_DEFINITIONS,
  getLocaleDefinition,
  type Locale,
} from "@/i18n/locale-config";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
  /** Volle Breite im Mobile-Drawer */
  fullWidth?: boolean;
  /** Desktop: Kurzcode (DE, PT, AR) statt vollem Sprachnamen im Trigger */
  compact?: boolean;
}

export function LanguageSwitcher({
  className,
  fullWidth = false,
  compact = !fullWidth,
}: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("common.languageSwitcher");
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const activeOption = useMemo(
    () => getLocaleDefinition(locale) ?? LOCALE_DEFINITIONS[0],
    [locale]
  );

  function handleSelect(nextLocale: Locale) {
    if (nextLocale === locale) {
      setIsOpen(false);
      return;
    }

    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
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

  const triggerLabel = compact ? activeOption.shortLabel : activeOption.label;

  return (
    <div
      ref={rootRef}
      className={cn("relative shrink-0", fullWidth && "w-full", className)}
    >
      <button
        type="button"
        aria-label={t("currentLanguage", { language: activeOption.label })}
        title={activeOption.label}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        disabled={isPending}
        onClick={() => setIsOpen((open) => !open)}
        className={cn(
          "relative inline-flex items-center gap-2 rounded-lg border border-white/10 bg-dark-800/40",
          "px-3 py-2 text-sm font-medium text-white/70",
          "transition-all duration-200 hover:border-gold-500/30 hover:text-gold-400",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50",
          isPending && "opacity-70",
          compact && !fullWidth && "w-[5.25rem] justify-center gap-1.5 px-2",
          fullWidth && "w-full justify-between"
        )}
      >
        <span
          className={cn(
            "inline-flex min-w-0 items-center gap-1.5",
            compact && !fullWidth && "pl-0.5"
          )}
        >
          <Globe className="h-4 w-4 shrink-0 text-gold-400/80" aria-hidden />
          <span
            className={cn(
              compact && !fullWidth
                ? "font-semibold tracking-wide text-white/80"
                : "truncate"
            )}
          >
            {triggerLabel}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-white/45 transition-transform duration-200",
            compact && !fullWidth && "absolute right-1.5 h-3.5 w-3.5",
            isOpen && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label={t("listAriaLabel")}
          className={cn(
            "absolute right-0 top-full z-50 mt-2 max-h-72 min-w-[12rem] overflow-y-auto rounded-xl",
            "border border-white/10 bg-dark-900/95 py-1 shadow-premium backdrop-blur-xl",
            fullWidth && "left-0 right-0 min-w-0"
          )}
        >
          {LOCALE_DEFINITIONS.map((option) => {
            const isActive = option.code === locale;

            return (
              <li key={option.code} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  aria-label={t("switchTo", { language: option.label })}
                  disabled={isPending}
                  onClick={() => handleSelect(option.code)}
                  className={cn(
                    "flex w-full items-center px-3 py-2.5 text-left text-sm transition-colors duration-200",
                    isActive
                      ? "bg-gold-500/15 text-gold-400"
                      : "text-white/70 hover:bg-white/5 hover:text-gold-400"
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

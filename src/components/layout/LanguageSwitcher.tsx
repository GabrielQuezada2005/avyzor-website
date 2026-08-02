"use client";

/**
 * Internationalisierung – Sprachumschalter
 *
 * Erhält die Sprachliste als Prop vom Server-Layout (immer aktuell, 16 Locales).
 */

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Globe } from "lucide-react";
import {
  getLocaleDefinition,
  type LanguageOption,
  type Locale,
} from "@/i18n/locale-config";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  /** Vom Server-Layout übergeben – vermeidet veraltete Client-Bundles. */
  options: readonly LanguageOption[];
  className?: string;
  /** Volle Breite im Mobile-Drawer */
  fullWidth?: boolean;
  /** Desktop: Kurzcode (DE, PT, AR) statt vollem Sprachnamen im Trigger */
  compact?: boolean;
}

export function LanguageSwitcher({
  options,
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
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [menuStyle, setMenuStyle] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const activeOption = useMemo(
    () =>
      getLocaleDefinition(locale) ??
      options.find((option) => option.code === locale) ??
      options[0],
    [locale, options]
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
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen || !triggerRef.current) {
      setMenuStyle(null);
      return;
    }

    function updatePosition() {
      const trigger = triggerRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const menuWidth = fullWidth
        ? rect.width
        : Math.max(rect.width, 192);

      setMenuStyle({
        top: rect.bottom + 8,
        left: fullWidth ? rect.left : rect.right - menuWidth,
        width: menuWidth,
      });
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, fullWidth]);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (
        rootRef.current?.contains(target) ||
        listRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
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

  const dropdown =
    isOpen &&
    menuStyle &&
    mounted &&
    createPortal(
      <ul
        ref={listRef}
        role="listbox"
        aria-label={t("listAriaLabel")}
        style={{
          top: menuStyle.top,
          left: menuStyle.left,
          width: menuStyle.width,
        }}
        className={cn(
          "fixed z-[100] max-h-72 overflow-y-auto rounded-xl py-1",
          "border border-white/10 bg-dark-900/95 shadow-premium backdrop-blur-xl"
        )}
      >
        {options.map((option) => {
          const isActive = option.code === locale;

          return (
            <li key={option.code} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={isActive}
                aria-label={option.label}
                title={option.label}
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
      </ul>,
      document.body
    );

  return (
    <div
      ref={rootRef}
      className={cn("relative shrink-0", fullWidth && "w-full", className)}
    >
      <button
        ref={triggerRef}
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
          compact &&
            !fullWidth &&
            "min-w-[4.75rem] max-w-[5.5rem] justify-center gap-1 px-2 pr-6",
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
            "pointer-events-none absolute right-1.5 h-3.5 w-3.5 shrink-0 text-white/45 transition-transform duration-200",
            !compact && "relative right-auto h-4 w-4",
            isOpen && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      {dropdown}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { NAV_IDS, NAV_HREFS } from "@/lib/i18n/structures";
import { SITE_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import type { LanguageOption } from "@/i18n/locale-config";
import { cn, scrollToSection } from "@/lib/utils";

interface HeaderProps {
  languageOptions: readonly LanguageOption[];
}

export function Header({ languageOptions }: HeaderProps) {
  const tNav = useTranslations("nav");
  const t = useTranslations("header");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <motion.header
      initial={false}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-500 ease-out-expo",
        isScrolled
          ? "bg-dark-900/90 backdrop-blur-2xl border-b border-white/[0.06] shadow-premium-lg"
          : "bg-dark-900/40 backdrop-blur-md border-b border-white/[0.03]"
      )}
    >
      <div className="container-premium mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 sm:gap-3 group"
          >
            <Image
              src="/logos/avyzor-logo.png"
              alt="AVYZOR Logo"
              width={40}
              height={40}
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain transition-transform duration-500 ease-out-expo group-hover:scale-[1.03]"
              priority
            />
            <span className="font-display text-lg sm:text-xl font-bold tracking-[0.12em] sm:tracking-[0.15em] text-white group-hover:text-gold-400 transition-colors duration-500 ease-out-expo">
              AVYZOR
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex flex-1 items-center justify-center gap-1 xl:gap-2 min-w-0 px-4"
            aria-label={t("mainNav")}
          >
            {NAV_IDS.map((id) => (
              <Link
                key={id}
                href={NAV_HREFS[id]}
                className="relative px-3 py-2 text-sm text-white/65 hover:text-gold-400 transition-[color,transform] duration-500 ease-out-expo group whitespace-nowrap hover:-translate-y-px"
              >
                {tNav(id)}
                <span className="absolute bottom-0 left-3 right-3 h-px scale-x-0 bg-gold-gradient group-hover:scale-x-100 transition-transform duration-500 ease-out-expo origin-left" />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex shrink-0 items-center gap-2 xl:gap-3">
            <LanguageSwitcher options={languageOptions} compact />
            <Button
              variant="secondary"
              size="sm"
              className="whitespace-nowrap hidden xl:inline-flex"
              onClick={() =>
                SITE_CONFIG.calendly
                  ? window.open(SITE_CONFIG.calendly, "_blank")
                  : scrollToSection("kontakt")
              }
            >
              {t("bookConsultation")}
            </Button>
            <Button
              size="sm"
              className="whitespace-nowrap"
              onClick={() => scrollToSection("kontakt")}
            >
              {t("startProject")}
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden shrink-0 p-2 -mr-2 text-white/80 hover:text-gold-400 transition-colors"
            aria-label={isMobileOpen ? t("menuClose") : t("menuOpen")}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-navigation"
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-dark-950/90 backdrop-blur-xl"
              onClick={() => setIsMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.nav
              id="mobile-navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-dark-900/95 backdrop-blur-2xl border-l border-white/[0.06] p-6 sm:p-8 pt-20"
              aria-label={t("mobileNav")}
            >
              <div className="flex flex-col gap-1">
                {NAV_IDS.map((id, i) => (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={NAV_HREFS[id]}
                      onClick={() => setIsMobileOpen(false)}
                      className="block py-3 px-2 text-base text-white/75 hover:text-gold-400 transition-colors rounded-lg hover:bg-white/[0.03]"
                    >
                      {tNav(id)}
                    </Link>
                  </motion.div>
                ))}

                <div className="pt-4 pb-2">
                  <LanguageSwitcher
                    options={languageOptions}
                    fullWidth
                    compact={false}
                  />
                </div>

                <div className="pt-4 mt-2 border-t border-white/[0.08] flex flex-col gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsMobileOpen(false);
                      if (SITE_CONFIG.calendly) {
                        window.open(SITE_CONFIG.calendly, "_blank");
                      } else {
                        scrollToSection("kontakt");
                      }
                    }}
                  >
                    {t("bookConsultation")}
                  </Button>
                  <Button
                    onClick={() => {
                      setIsMobileOpen(false);
                      scrollToSection("kontakt");
                    }}
                  >
                    {t("startProject")}
                  </Button>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { cn, scrollToSection } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
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
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-dark-900/80 backdrop-blur-xl border-b border-white/5 shadow-premium"
          : "bg-transparent"
      )}
    >
      <div className="container-premium mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="relative z-50 flex items-center gap-3 group">
            <Image
              src="/logos/avyzor-logo.png"
              alt="AVYZOR Logo"
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
              priority
            />
            <span className="font-display text-xl font-bold tracking-[0.15em] text-white group-hover:text-gold-400 transition-colors">
              AVYZOR
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Hauptnavigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm text-white/70 hover:text-gold-400 transition-colors duration-300 group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold-gradient group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                window.open(SITE_CONFIG.calendly, "_blank")
              }
            >
              Beratung buchen
            </Button>
            <Button
              size="sm"
              onClick={() => scrollToSection("kontakt")}
            >
              Projekt starten
            </Button>
          </div>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden relative z-50 p-2 text-white"
            aria-label={isMobileOpen ? "Menü schließen" : "Menü öffnen"}
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
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-dark-950/95 backdrop-blur-xl"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.nav
              id="mobile-navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-dark-900 border-l border-white/5 p-8 pt-24"
              aria-label="Mobile Navigation"
            >
              <div className="flex flex-col gap-6">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className="text-lg text-white/80 hover:text-gold-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsMobileOpen(false);
                      window.open(SITE_CONFIG.calendly, "_blank");
                    }}
                  >
                    Beratung buchen
                  </Button>
                  <Button
                    onClick={() => {
                      setIsMobileOpen(false);
                      scrollToSection("kontakt");
                    }}
                  >
                    Projekt starten
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

"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/forms/ContactForm";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { BookingForm } from "@/components/forms/BookingForm";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Mail, FileText, Calendar, ExternalLink } from "lucide-react";
import { CONTACT_TAB_IDS } from "@/lib/i18n/structures";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

const tabIcons = {
  contact: Mail,
  quote: FileText,
  booking: Calendar,
} as const;

type TabId = (typeof CONTACT_TAB_IDS)[number];

export function Contact() {
  const t = useTranslations("contact");
  const [activeTab, setActiveTab] = useState<TabId>("contact");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let nextIndex = index;

      if (e.key === "ArrowRight") {
        nextIndex = (index + 1) % CONTACT_TAB_IDS.length;
      } else if (e.key === "ArrowLeft") {
        nextIndex = (index - 1 + CONTACT_TAB_IDS.length) % CONTACT_TAB_IDS.length;
      } else if (e.key === "Home") {
        nextIndex = 0;
      } else if (e.key === "End") {
        nextIndex = CONTACT_TAB_IDS.length - 1;
      } else {
        return;
      }

      e.preventDefault();
      setActiveTab(CONTACT_TAB_IDS[nextIndex]);
      tabRefs.current[nextIndex]?.focus();
    },
    []
  );

  return (
    <section id="kontakt" className="section-padding relative">
      <div className="container-premium mx-auto">
        <SectionHeading
          subtitle={t("subtitle")}
          title={t("title")}
          description={t("description")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div
              role="tablist"
              aria-label={t("tabsAriaLabel")}
              className="flex gap-2 mb-6 p-1 glass rounded-xl"
            >
              {CONTACT_TAB_IDS.map((id, index) => {
                const Icon = tabIcons[id];
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    ref={(el) => {
                      tabRefs.current[index] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`tab-${id}`}
                    aria-selected={isActive}
                    aria-controls={`tabpanel-${id}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActiveTab(id)}
                    onKeyDown={(e) => handleTabKeyDown(e, index)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300",
                      isActive
                        ? "bg-gold-500/20 text-gold-400"
                        : "text-white/50 hover:text-white/80"
                    )}
                  >
                    <Icon size={16} aria-hidden="true" />
                    {t(`tabs.${id}`)}
                  </button>
                );
              })}
            </div>

            <div className="glass rounded-2xl p-8">
              {CONTACT_TAB_IDS.map((id) => (
                <div
                  key={id}
                  role="tabpanel"
                  id={`tabpanel-${id}`}
                  aria-labelledby={`tab-${id}`}
                  hidden={activeTab !== id}
                >
                  {activeTab === id && (
                    <>
                      {id === "contact" && <ContactForm />}
                      {id === "quote" && <QuoteForm />}
                      {id === "booking" && <BookingForm />}
                    </>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">
                {t("sidebar.calendly.title")}
              </h3>
              <p className="text-white/50 text-sm mb-4">
                {t("sidebar.calendly.description")}
              </p>
              <a
                href={SITE_CONFIG.calendly}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors"
              >
                {t("sidebar.calendly.button")}
                <ExternalLink size={14} aria-hidden="true" />
              </a>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">
                {t("sidebar.direct.title")}
              </h3>
              <div className="space-y-3 text-sm">
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="block text-white/50 hover:text-gold-400 transition-colors"
                >
                  {SITE_CONFIG.email}
                </a>
                {SITE_CONFIG.phone ? (
                  <a
                    href={`tel:${SITE_CONFIG.phoneHref}`}
                    className="block text-white/50 hover:text-gold-400 transition-colors"
                  >
                    {SITE_CONFIG.phone}
                  </a>
                ) : null}
              </div>
            </div>

            <div className="glass-gold rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-2">
                {t("sidebar.newsletter.title")}
              </h3>
              <p className="text-white/50 text-sm mb-4">
                {t("sidebar.newsletter.description")}
              </p>
              <NewsletterForm />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

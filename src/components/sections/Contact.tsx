"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/forms/ContactForm";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { BookingForm } from "@/components/forms/BookingForm";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Mail, FileText, Calendar, ExternalLink } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "contact", label: "Kontakt", icon: Mail },
  { id: "quote", label: "Angebot", icon: FileText },
  { id: "booking", label: "Termin", icon: Calendar },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function Contact() {
  const [activeTab, setActiveTab] = useState<TabId>("contact");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let nextIndex = index;

      if (e.key === "ArrowRight") {
        nextIndex = (index + 1) % tabs.length;
      } else if (e.key === "ArrowLeft") {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (e.key === "Home") {
        nextIndex = 0;
      } else if (e.key === "End") {
        nextIndex = tabs.length - 1;
      } else {
        return;
      }

      e.preventDefault();
      setActiveTab(tabs[nextIndex].id);
      tabRefs.current[nextIndex]?.focus();
    },
    []
  );

  return (
    <section id="kontakt" className="section-padding relative">
      <div className="container-premium mx-auto">
        <SectionHeading
          subtitle="Kontakt"
          title="Lassen Sie uns sprechen"
          description="Ob Projektanfrage, Angebot oder Termin – wir sind für Sie da."
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
              aria-label="Kontaktformular-Tabs"
              className="flex gap-2 mb-6 p-1 glass rounded-xl"
            >
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    ref={(el) => {
                      tabRefs.current[index] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`tab-${tab.id}`}
                    aria-selected={isActive}
                    aria-controls={`tabpanel-${tab.id}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActiveTab(tab.id)}
                    onKeyDown={(e) => handleTabKeyDown(e, index)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300",
                      isActive
                        ? "bg-gold-500/20 text-gold-400"
                        : "text-white/50 hover:text-white/80"
                    )}
                  >
                    <Icon size={16} aria-hidden="true" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="glass rounded-2xl p-8">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  role="tabpanel"
                  id={`tabpanel-${tab.id}`}
                  aria-labelledby={`tab-${tab.id}`}
                  hidden={activeTab !== tab.id}
                >
                  {activeTab === tab.id && (
                    <>
                      {tab.id === "contact" && <ContactForm />}
                      {tab.id === "quote" && <QuoteForm />}
                      {tab.id === "booking" && <BookingForm />}
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
                Calendly Terminbuchung
              </h3>
              <p className="text-white/50 text-sm mb-4">
                Buchen Sie direkt einen Termin in unserem Kalender.
              </p>
              <a
                href={SITE_CONFIG.calendly}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors"
              >
                Termin wählen
                <ExternalLink size={14} aria-hidden="true" />
              </a>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Direkter Kontakt</h3>
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
              <h3 className="text-white font-semibold mb-2">Newsletter</h3>
              <p className="text-white/50 text-sm mb-4">
                KI-Trends, Tipps und exklusive Insights.
              </p>
              <NewsletterForm />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

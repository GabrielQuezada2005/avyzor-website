"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Check, Star, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import {
  PRICING_PLAN_IDS,
  PRICING_HIGHLIGHTED,
} from "@/lib/i18n/structures";
import { PRICING_AMOUNTS } from "@/lib/i18n/pricing-data";
import { formatPrice } from "@/lib/i18n/format";
import { scrollToSection } from "@/lib/utils";

export function Pricing() {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [fallbackMessage, setFallbackMessage] = useState<string | null>(null);

  const neukundeFeatures = t.raw("neukunde.features") as string[];

  const handleCheckout = async (planId: string) => {
    setLoadingPlan(planId);
    setFallbackMessage(null);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setFallbackMessage(t("stripeError"));
      setTimeout(() => scrollToSection("kontakt"), 1500);
    } catch {
      setFallbackMessage(t("stripeConnectionError"));
      scrollToSection("kontakt");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="preise" className="section-padding relative bg-dark-950/50">
      <div className="container-premium mx-auto">
        <SectionHeading
          subtitle={t("subtitle")}
          title={t("title")}
          description={t("description")}
        />

        {fallbackMessage && (
          <div
            role="status"
            aria-live="polite"
            className="max-w-2xl mx-auto mb-8 p-4 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-400 text-sm text-center"
          >
            {fallbackMessage}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative max-w-4xl mx-auto mb-10 rounded-2xl p-[1px] bg-gradient-to-r from-gold-500/40 via-gold-300/60 to-gold-500/40"
        >
          <div className="relative rounded-2xl bg-dark-900/90 backdrop-blur-xl p-6 md:p-8">
            <div className="absolute -top-3 left-6 flex items-center gap-1.5 px-3 py-1 bg-gold-gradient rounded-full text-dark-900 text-xs font-bold">
              <Sparkles size={12} aria-hidden="true" />
              {t("neukunde.badge")}
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-2">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {t("neukunde.name")}
                </h3>
                <p className="text-white/50 text-sm mb-4 md:mb-0 max-w-xl">
                  {t("neukunde.description")}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-4 shrink-0">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-bold text-gradient-gold">
                    {formatPrice(PRICING_AMOUNTS.neukunde, locale)}
                  </span>
                  <span className="text-white/40 text-sm">{t("onceLabel")}</span>
                </div>
                <Button
                  size="md"
                  className="w-full sm:w-auto md:w-full min-w-[180px]"
                  onClick={() => scrollToSection("kontakt")}
                >
                  {t("neukunde.cta")}
                </Button>
              </div>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 mt-6 pt-6 border-t border-white/5">
              {neukundeFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-white/60"
                >
                  <Check
                    size={14}
                    className="text-gold-400 shrink-0"
                    aria-hidden="true"
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PRICING_PLAN_IDS.map((planId, index) => {
            const highlighted = planId === PRICING_HIGHLIGHTED;
            const features = t.raw(`plans.${planId}.features`) as string[];

            return (
              <motion.div
                key={planId}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl p-8 transition-all duration-500 ${
                  highlighted
                    ? "glass-gold shadow-gold scale-[1.02] lg:scale-105"
                    : "glass hover:border-gold-500/20"
                }`}
              >
                {highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 px-4 py-1 bg-gold-gradient rounded-full text-dark-900 text-xs font-bold">
                    <Star size={12} fill="currentColor" aria-hidden="true" />
                    {t("popularBadge")}
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {t(`plans.${planId}.name`)}
                  </h3>
                  <p className="text-white/50 text-sm mb-4">
                    {t(`plans.${planId}.description`)}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gradient-gold">
                      {formatPrice(PRICING_AMOUNTS[planId], locale)}
                    </span>
                    <span className="text-white/40 text-sm">{t("onceLabel")}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-white/70"
                    >
                      <Check
                        size={16}
                        className="text-gold-400 mt-0.5 shrink-0"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={highlighted ? "primary" : "secondary"}
                  className="w-full"
                  isLoading={loadingPlan === planId}
                  onClick={() => handleCheckout(planId)}
                >
                  {t(`plans.${planId}.cta`)}
                </Button>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-white/40 text-sm mt-12"
        >
          {t("footerNote")}
        </motion.p>
      </div>
    </section>
  );
}

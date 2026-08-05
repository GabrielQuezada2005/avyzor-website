"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WHY_IDS, WHY_ICONS } from "@/lib/i18n/structures";
import { getLucideIcon } from "@/lib/i18n/icons";
import { fadeUpScale, reducedFade, staggerContainer } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-is-mounted";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

export function WhyAvyzor() {
  const t = useTranslations("why");
  const gridReveal = useScrollReveal(staggerContainer);
  const reduceMotion = usePrefersReducedMotion();
  const itemVariants = reduceMotion ? reducedFade : fadeUpScale;

  return (
    <section id="warum-avyzor" className="section-padding relative">
      <div className="container-premium mx-auto">
        <SectionHeading
          subtitle={t("subtitle")}
          title={t("title")}
          description={t("description")}
        />

        <motion.div
          {...gridReveal}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto"
        >
          {WHY_IDS.map((id) => {
            const Icon = getLucideIcon(WHY_ICONS[id]);

            return (
              <motion.div
                key={id}
                variants={itemVariants}
                className="flex gap-6 p-6 md:p-8 rounded-2xl glass group hover:border-gold-500/25 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-xl bg-gold-500/10 flex items-center justify-center shrink-0 group-hover:bg-gold-500/20 group-hover:shadow-gold-soft transition-all duration-300">
                  {Icon && (
                    <Icon size={28} className="text-gold-400 group-hover:scale-110 transition-transform duration-300" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {t(`items.${id}.title`)}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {t(`items.${id}.description`)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

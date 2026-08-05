"use client";

import { useCallback } from "react";
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

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduceMotion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      e.currentTarget.style.setProperty("--mouse-x", `${x}%`);
      e.currentTarget.style.setProperty("--mouse-y", `${y}%`);
    },
    [reduceMotion]
  );

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
                onMouseMove={handleMouseMove}
                className="premium-card-3d flex gap-6 group cursor-default"
              >
                <div className="w-14 h-14 rounded-xl bg-gold-500/10 flex items-center justify-center shrink-0 group-hover:bg-gold-500/20 group-hover:shadow-gold-soft transition-all duration-500 ease-out-expo">
                  {Icon && (
                    <Icon
                      size={28}
                      className="text-gold-400 group-hover:scale-110 transition-transform duration-500 ease-out-expo"
                    />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-gold-400 transition-colors duration-500 ease-out-expo">
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

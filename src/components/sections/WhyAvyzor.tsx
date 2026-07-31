"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WHY_IDS, WHY_ICONS } from "@/lib/i18n/structures";
import { getLucideIcon } from "@/lib/i18n/icons";

export function WhyAvyzor() {
  const t = useTranslations("why");

  return (
    <section id="warum-avyzor" className="section-padding relative">
      <div className="container-premium mx-auto">
        <SectionHeading
          subtitle={t("subtitle")}
          title={t("title")}
          description={t("description")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {WHY_IDS.map((id, index) => {
            const Icon = getLucideIcon(WHY_ICONS[id]);

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-6 p-6 rounded-2xl glass hover:border-gold-500/20 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-xl bg-gold-500/10 flex items-center justify-center shrink-0">
                  {Icon && (
                    <Icon size={28} className="text-gold-400" />
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
        </div>
      </div>
    </section>
  );
}

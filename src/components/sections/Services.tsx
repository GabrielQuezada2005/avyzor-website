"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SERVICE_IDS, SERVICE_ICONS } from "@/lib/i18n/structures";
import { getLucideIcon } from "@/lib/i18n/icons";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function Services() {
  const t = useTranslations("services");

  return (
    <section id="leistungen" className="section-padding relative">
      <div className="container-premium mx-auto">
        <SectionHeading
          subtitle={t("subtitle")}
          title={t("title")}
          description={t("description")}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {SERVICE_IDS.map((id) => {
            const Icon = getLucideIcon(SERVICE_ICONS[id]);
            const features = t.raw(`items.${id}.features`) as string[];

            return (
              <motion.div
                key={id}
                variants={itemVariants}
                className="premium-card group cursor-default"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-6 group-hover:bg-gold-500/20 transition-colors">
                  {Icon && (
                    <Icon size={24} className="text-gold-400" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-gold-400 transition-colors">
                  {t(`items.${id}.title`)}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-4">
                  {t(`items.${id}.description`)}
                </p>
                <ul className="space-y-2">
                  {features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-white/40"
                    >
                      <span className="w-1 h-1 rounded-full bg-gold-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

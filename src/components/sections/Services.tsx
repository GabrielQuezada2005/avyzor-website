"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SERVICE_IDS, SERVICE_ICONS } from "@/lib/i18n/structures";
import { getLucideIcon } from "@/lib/i18n/icons";
import { staggerContainer, fadeUpScale, reducedFade } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-is-mounted";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

function ServiceCard({
  id,
  title,
  description,
  features,
}: {
  id: string;
  title: string;
  description: string;
  features: string[];
}) {
  const Icon = getLucideIcon(SERVICE_ICONS[id as keyof typeof SERVICE_ICONS]);
  const reduceMotion = usePrefersReducedMotion();

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
    <motion.div
      variants={reduceMotion ? reducedFade : fadeUpScale}
      onMouseMove={handleMouseMove}
      className="premium-card-3d group cursor-default h-full"
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gold-500/10 flex items-center justify-center mb-5 sm:mb-6 group-hover:bg-gold-500/20 group-hover:shadow-gold-soft transition-all duration-500">
        {Icon && (
          <Icon
            size={24}
            className="text-gold-400 group-hover:scale-110 transition-transform duration-300"
          />
        )}
      </div>

      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3 group-hover:text-gold-400 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-white/50 text-sm leading-relaxed mb-4 sm:mb-5">
        {description}
      </p>

      <ul className="space-y-2">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2.5 text-sm text-white/45 group-hover:text-white/55 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0 mt-1.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function Services() {
  const t = useTranslations("services");
  const gridReveal = useScrollReveal(staggerContainer);

  return (
    <section id="leistungen" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-gold-top pointer-events-none opacity-40" />

      <div className="container-premium mx-auto relative z-10">
        <SectionHeading
          subtitle={t("subtitle")}
          title={t("title")}
          description={t("description")}
        />

        <motion.div
          {...gridReveal}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8"
        >
          {SERVICE_IDS.map((id) => {
            const features = t.raw(`items.${id}.features`) as string[];

            return (
              <ServiceCard
                key={id}
                id={id}
                title={t(`items.${id}.title`)}
                description={t(`items.${id}.description`)}
                features={features}
              />
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

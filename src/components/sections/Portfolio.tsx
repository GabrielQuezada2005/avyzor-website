"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PORTFOLIO_IDS, PORTFOLIO_IMAGES } from "@/lib/i18n/structures";
import { scrollToSection } from "@/lib/utils";

export function Portfolio() {
  const t = useTranslations("portfolio");
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  return (
    <section id="portfolio" className="section-padding relative bg-dark-950/50">
      <div className="container-premium mx-auto">
        <SectionHeading
          subtitle={t("subtitle")}
          title={t("title")}
          description={t("description")}
        />

        <p className="text-center text-white/30 text-xs mb-8 max-w-2xl mx-auto">
          {t("disclaimer")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PORTFOLIO_IDS.map((id, index) => {
            const results = t.raw(`items.${id}.results`) as string[];

            return (
              <motion.button
                key={id}
                type="button"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => scrollToSection("kontakt")}
                className="group relative rounded-2xl overflow-hidden glass text-left w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50"
                aria-label={`${t(`items.${id}.title`)} – ${t("requestLabel")}`}
              >
                <div className="relative h-64 overflow-hidden">
                  {failedImages[id] ? (
                    <div className="absolute inset-0 bg-gradient-to-br from-dark-700 via-dark-800 to-dark-900 flex items-center justify-center">
                      <span className="text-gold-400/40 text-sm font-medium tracking-wider uppercase">
                        {t(`items.${id}.category`)}
                      </span>
                    </div>
                  ) : (
                    <Image
                      src={PORTFOLIO_IMAGES[id]}
                      alt={t(`items.${id}.title`)}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, [id]: true }))
                      }
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-gold-500/20 backdrop-blur-sm border border-gold-500/30 rounded-full text-gold-400 text-xs font-medium">
                    {t(`items.${id}.category`)}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-white group-hover:text-gold-400 transition-colors">
                      {t(`items.${id}.title`)}
                    </h3>
                    <ArrowRight
                      size={18}
                      className="text-white/30 group-hover:text-gold-400 group-hover:translate-x-1 transition-all mt-1"
                    />
                  </div>
                  <p className="text-white/50 text-sm mb-4">
                    {t(`items.${id}.description`)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {results.map((result) => (
                      <span
                        key={result}
                        className="px-3 py-1 bg-gold-500/10 rounded-full text-gold-400 text-xs font-medium"
                      >
                        {result}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQ_IDS } from "@/lib/i18n/structures";
import { easeOutExpo } from "@/lib/motion";
import { useInViewMotion } from "@/lib/use-scroll-reveal";
import { useIsMounted, usePrefersReducedMotion } from "@/lib/use-is-mounted";
import { cn } from "@/lib/utils";

function FaqItem({
  id,
  index,
  isOpen,
  didInteract,
  onToggle,
}: {
  id: (typeof FAQ_IDS)[number];
  index: number;
  isOpen: boolean;
  didInteract: boolean;
  onToggle: () => void;
}) {
  const t = useTranslations("faq");
  const mounted = useIsMounted();
  const reduceMotion = usePrefersReducedMotion();
  const reveal = useInViewMotion(
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.05, ease: easeOutExpo },
    }
  );

  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  return (
    <motion.div {...reveal} className="glass rounded-xl overflow-hidden">
      <button
        id={buttonId}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-white font-medium pr-4">
          {t(`items.${id}.question`)}
        </span>
        <ChevronDown
          size={20}
          aria-hidden="true"
          className={cn(
            "text-gold-400 shrink-0 transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={
              mounted && didInteract && !reduceMotion
                ? { height: 0, opacity: 0 }
                : false
            }
            animate={{ height: "auto", opacity: 1 }}
            exit={
              reduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }
            }
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-white/60 text-sm leading-relaxed">
              {t(`items.${id}.answer`)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  const t = useTranslations("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [didInteract, setDidInteract] = useState(false);

  return (
    <section id="faq" className="section-padding relative bg-dark-950/50">
      <div className="container-premium mx-auto">
        <SectionHeading
          subtitle={t("subtitle")}
          title={t("title")}
          description={t("description")}
        />

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQ_IDS.map((id, index) => {
            const isOpen = openIndex === index;

            return (
              <FaqItem
                key={id}
                id={id}
                index={index}
                isOpen={isOpen}
                didInteract={didInteract}
                onToggle={() => {
                  setDidInteract(true);
                  setOpenIndex(isOpen ? null : index);
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

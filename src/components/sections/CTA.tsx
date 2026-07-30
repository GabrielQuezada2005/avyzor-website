"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/constants";
import { scrollToSection } from "@/lib/utils";

interface CTAProps {
  title?: string;
  description?: string;
}

export function CTA({
  title = "Bereit für Ihr Premium-Projekt?",
  description = "Lassen Sie uns gemeinsam etwas Außergewöhnliches schaffen. Ihre digitale Transformation beginnt hier.",
}: CTAProps) {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-gold pointer-events-none" />

      <div className="container-premium mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-gold rounded-3xl p-12 md:p-16 text-center max-w-4xl mx-auto"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => scrollToSection("kontakt")}
            >
              Jetzt Projekt starten
              <ArrowRight size={20} />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => window.open(SITE_CONFIG.calendly, "_blank")}
            >
              Beratung buchen
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

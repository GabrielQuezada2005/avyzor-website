"use client";

import { motion } from "framer-motion";
import { Award, Brain, TrendingUp, Users, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WHY_AVYZOR } from "@/lib/constants";

const iconMap: Record<string, LucideIcon> = {
  Award,
  Brain,
  TrendingUp,
  Users,
};

export function WhyAvyzor() {
  return (
    <section id="warum-avyzor" className="section-padding relative">
      <div className="container-premium mx-auto">
        <SectionHeading
          subtitle="Warum AVYZOR"
          title="Der Unterschied, der zählt"
          description="Wir sind keine Agentur von der Stange. Wir sind Ihr Partner für digitale Exzellenz."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {WHY_AVYZOR.map((item, index) => {
            const Icon = iconMap[item.icon];
            return (
              <motion.div
                key={item.title}
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
                    {item.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {item.description}
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

"use client";

import { motion } from "framer-motion";
import {
  Globe,
  Bot,
  Zap,
  Calendar,
  Link as LinkIcon,
  Search,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SERVICES } from "@/lib/constants";

const iconMap: Record<string, LucideIcon> = {
  Globe,
  Bot,
  Zap,
  Calendar,
  Link: LinkIcon,
  Search,
  Shield,
};

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
  return (
    <section id="leistungen" className="section-padding relative">
      <div className="container-premium mx-auto">
        <SectionHeading
          subtitle="Leistungen"
          title="Was wir für Sie tun"
          description="Vom Premium-Auftritt bis zur vollautomatisierten KI-Lösung – alles aus einer Hand."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {SERVICES.map((service) => {
            const Icon = iconMap[service.icon];
            return (
              <motion.div
                key={service.id}
                variants={itemVariants}
                className="premium-card group cursor-default"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-6 group-hover:bg-gold-500/20 transition-colors">
                  {Icon && (
                    <Icon size={24} className="text-gold-400" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-gold-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
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

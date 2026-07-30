"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  subtitle?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  subtitle,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={cn(
        "mb-16",
        align === "center" && "text-center",
        className
      )}
    >
      {subtitle && (
        <span className="inline-block text-gold-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
          {subtitle}
        </span>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
      <div
        className={cn(
          "mt-6 h-px w-24 bg-gold-gradient",
          align === "center" && "mx-auto"
        )}
      />
    </motion.div>
  );
}

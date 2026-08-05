"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { scrollViewport } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-is-mounted";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

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
  const reveal = useScrollReveal();
  const reduceMotion = usePrefersReducedMotion();

  return (
    <motion.div
      {...reveal}
      className={cn(
        "mb-12 md:mb-16 lg:mb-20",
        align === "center" && "text-center",
        className
      )}
    >
      {subtitle && (
        <span className="inline-block text-gold-400 text-xs md:text-sm font-semibold tracking-[0.2em] uppercase mb-4 px-3 py-1.5 rounded-full glass-gold">
          {subtitle}
        </span>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight text-balance">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-white/55 text-base md:text-lg leading-relaxed text-pretty",
            align === "center" && "max-w-2xl mx-auto"
          )}
        >
          {description}
        </p>
      )}
      <motion.div
        // reduceMotion is false during SSR/first paint — keeps scaleX identical
        initial={reduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
        animate={reduceMotion ? { scaleX: 1 } : undefined}
        whileInView={{ scaleX: 1 }}
        viewport={scrollViewport}
        transition={{
          duration: reduceMotion ? 0 : 0.8,
          ease: [0.16, 1, 0.3, 1],
          delay: reduceMotion ? 0 : 0.2,
        }}
        className={cn(
          "mt-6 md:mt-8 h-px w-20 bg-gold-gradient origin-center",
          align === "center" && "mx-auto"
        )}
      />
    </motion.div>
  );
}

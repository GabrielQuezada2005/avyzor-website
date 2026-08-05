"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { SITE_CONFIG } from "@/lib/constants";
import { easeOutExpo } from "@/lib/motion";
import { useIsMounted, usePrefersReducedMotion } from "@/lib/use-is-mounted";
import { cn, scrollToSection } from "@/lib/utils";

/**
 * Hero entrance must NOT use Framer `initial="hidden"`.
 * Framer respects prefers-reduced-motion on the client during hydrate while SSR
 * still emits opacity:0 — that mismatch wipes the tree in real browsers.
 * CSS hero-enter runs only after mount (identical SSR + first client paint).
 */
function HeroEnter({
  className,
  delayClass,
  children,
}: {
  className?: string;
  delayClass?: string;
  children: React.ReactNode;
}) {
  const mounted = useIsMounted();
  const reduceMotion = usePrefersReducedMotion();
  const play = mounted && !reduceMotion;

  return (
    <div
      className={cn(className, play && "hero-enter", play && delayClass)}
      // Deterministic pre-mount styles — same on server and first client render.
      style={
        mounted
          ? undefined
          : { opacity: 0, transform: "translateY(28px)" }
      }
    >
      {children}
    </div>
  );
}

export function Hero() {
  const t = useTranslations("hero");
  const stats = t.raw("stats") as { value: string; label: string }[];
  const mounted = useIsMounted();
  const reduceMotion = usePrefersReducedMotion();
  const bounce = mounted && !reduceMotion;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <AnimatedBackground />

      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-transparent to-dark-900 pointer-events-none" />

      <div className="container-premium mx-auto px-4 md:px-8 pt-32 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <HeroEnter
            delayClass="hero-enter-delay-0"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-gold mb-8"
          >
            <Sparkles size={16} className="text-gold-400" />
            <span className="text-sm text-gold-400 font-medium tracking-wide">
              {t("badge")}
            </span>
          </HeroEnter>

          <HeroEnter delayClass="hero-enter-delay-1">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="block">{t("title1")}</span>
              <span className="block text-gradient-gold-animated animate-shimmer">
                {t("title2")}
              </span>
            </h1>
          </HeroEnter>

          <HeroEnter delayClass="hero-enter-delay-2">
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t("description")}
            </p>
          </HeroEnter>

          <HeroEnter
            delayClass="hero-enter-delay-3"
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" onClick={() => scrollToSection("kontakt")}>
              {t("cta1")}
              <ArrowRight size={20} />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => window.open(SITE_CONFIG.calendly, "_blank")}
            >
              {t("cta2")}
            </Button>
          </HeroEnter>

          <HeroEnter
            delayClass="hero-enter-delay-4"
            className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <AnimatedCounter value={stat.value} />
                <div className="text-sm text-white/40 mt-1">{stat.label}</div>
              </div>
            ))}
          </HeroEnter>
        </div>
      </div>

      <div
        className={cn(
          "absolute bottom-8 left-1/2 -translate-x-1/2",
          bounce && "hero-enter hero-enter-delay-mouse"
        )}
        style={mounted ? undefined : { opacity: 0 }}
      >
        <motion.div
          initial={false}
          animate={bounce ? { y: [0, 8, 0] } : { y: 0 }}
          transition={{
            duration: 2.4,
            repeat: bounce ? Infinity : 0,
            ease: easeOutExpo,
          }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-2 bg-gold-400 rounded-full shadow-[0_0_12px_rgba(201,162,39,0.55)]" />
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMounted, usePrefersReducedMotion } from "@/lib/use-is-mounted";

interface AnimatedBackgroundProps {
  className?: string;
}

export function AnimatedBackground({ className }: AnimatedBackgroundProps) {
  const mounted = useIsMounted();
  const reduceMotion = usePrefersReducedMotion();
  const { scrollY } = useScroll();

  const yPrimary = useTransform(scrollY, [0, 800], [0, 100]);
  const ySecondary = useTransform(scrollY, [0, 800], [0, -70]);
  const yCenter = useTransform(scrollY, [0, 800], [0, 40]);
  const parallaxOn = mounted && !reduceMotion;

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className
      )}
    >
      <div className="absolute inset-0 bg-mesh-gradient opacity-80" />

      <motion.div
        initial={false}
        className="hero-glow w-[600px] h-[600px] -top-1/4 -left-1/4 will-change-transform"
        style={parallaxOn ? { y: yPrimary } : undefined}
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, 80, 0],
                scale: [1, 1.08, 1],
              }
        }
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        initial={false}
        className="hero-glow w-[500px] h-[500px] -bottom-1/4 -right-1/4 opacity-70 will-change-transform"
        style={parallaxOn ? { y: ySecondary } : undefined}
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, -60, 0],
                scale: [1, 1.12, 1],
              }
        }
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        initial={false}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(201, 162, 39, 0.04) 0%, transparent 55%)",
          ...(parallaxOn ? { y: yCenter } : {}),
        }}
        animate={
          reduceMotion
            ? undefined
            : {
                scale: [1, 1.1, 1],
                opacity: [0.6, 0.9, 0.6],
              }
        }
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201,162,39,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,162,39,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 70%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.012]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

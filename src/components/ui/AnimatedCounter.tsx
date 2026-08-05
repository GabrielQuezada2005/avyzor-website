"use client";

import { useEffect, useMemo, useState } from "react";
import { useIsMounted, usePrefersReducedMotion } from "@/lib/use-is-mounted";
import { cn } from "@/lib/utils";

type ParsedStat = {
  end: number;
  suffix: string;
  prefix: string;
};

/** Parses display values like "50+", "98%", "10k€+", "€10k+" into animatable parts. */
export function parseStatValue(value: string): ParsedStat {
  const trimmed = value.trim();
  const match = trimmed.match(/^([^0-9]*)(\d+(?:[.,]\d+)?)(.*)$/);
  if (!match) {
    return { end: 0, prefix: "", suffix: trimmed };
  }

  const [, prefix, numeric, suffix] = match;
  const end = Number(numeric.replace(",", "."));
  return {
    end: Number.isFinite(end) ? end : 0,
    prefix,
    suffix,
  };
}

function formatStat(value: number, parsed: ParsedStat): string {
  const rounded = Number.isInteger(parsed.end)
    ? Math.round(value)
    : Math.round(value * 10) / 10;
  return `${parsed.prefix}${rounded}${parsed.suffix}`;
}

/** easeOutExpo */
function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

interface AnimatedCounterProps {
  value: string;
  className?: string;
  /** Delay before counting starts (ms) — lets page entrance finish first. */
  startDelay?: number;
  /** Count duration in ms. */
  duration?: number;
}

/**
 * Counts up to the target stat after mount.
 * SSR and first paint render the final value (no hydration mismatch).
 */
export function AnimatedCounter({
  value,
  className,
  startDelay = 750,
  duration = 1500,
}: AnimatedCounterProps) {
  const mounted = useIsMounted();
  const reduceMotion = usePrefersReducedMotion();
  const parsed = useMemo(() => parseStatValue(value), [value]);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!mounted) return;

    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    let cancelled = false;
    let frame = 0;
    let startTime = 0;

    const timeout = window.setTimeout(() => {
      if (cancelled) return;
      startTime = performance.now();
      setDisplay(formatStat(0, parsed));

      const tick = (now: number) => {
        if (cancelled) return;
        const progress = Math.min(1, (now - startTime) / duration);
        setDisplay(formatStat(parsed.end * easeOutExpo(progress), parsed));
        if (progress < 1) {
          frame = window.requestAnimationFrame(tick);
        }
      };

      frame = window.requestAnimationFrame(tick);
    }, startDelay);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      window.cancelAnimationFrame(frame);
    };
  }, [mounted, reduceMotion, value, startDelay, duration, parsed]);

  return (
    <span
      className={cn("stat-value tabular-nums", className)}
      aria-label={value}
    >
      {display}
    </span>
  );
}

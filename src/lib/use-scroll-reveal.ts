"use client";

import type { TargetAndTransition, Variants } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/use-is-mounted";
import { fadeUp, reducedFade, scrollViewport } from "@/lib/motion";

type ScrollRevealProps = {
  variants: Variants;
  initial: false | "hidden";
  animate: false | "hidden" | undefined;
  whileInView: "visible";
  viewport: typeof scrollViewport;
};

const STATIC_IN_VIEW: TargetAndTransition = {
  opacity: 1,
  x: 0,
  y: 0,
  scale: 1,
};

/**
 * Scroll-reveal props that keep SSR/first paint VISIBLE (no opacity:0 in HTML).
 * Opacity animation starts only after mount — avoids black homepage on reload.
 */
export function useScrollReveal(
  variants: Variants = fadeUp,
  viewport = scrollViewport
): ScrollRevealProps {
  const reduceMotion = usePrefersReducedMotion();

  if (reduceMotion) {
    return {
      variants: reducedFade,
      initial: false,
      animate: "visible",
      whileInView: "visible",
      viewport,
    };
  }

  return {
    variants,
    // Never apply opacity:0 after mount — that blacks out in-view content on reload.
    // whileInView still animates to "visible" when sections enter the viewport.
    initial: false,
    animate: false,
    whileInView: "visible",
    viewport,
  };
}

/**
 * Inline whileInView props with the same SSR-visible hydration guard.
 * Return type is loose due to Framer Motion TargetAndTransition typing.
 */
export function useInViewMotion(
  _hidden: TargetAndTransition,
  visible: TargetAndTransition,
  viewport = scrollViewport
): Record<string, unknown> {
  const reduceMotion = usePrefersReducedMotion();

  if (reduceMotion) {
    return {
      initial: false,
      animate: STATIC_IN_VIEW,
      whileInView: STATIC_IN_VIEW,
      viewport,
    };
  }

  return {
    initial: false,
    animate: false,
    whileInView: visible,
    viewport,
  };
}

/** Mount-triggered entrance — SSR/first paint stay visible (no opacity:0). */
export function useMountMotion(
  hidden: TargetAndTransition,
  visible: TargetAndTransition
): {
  initial: false;
  animate: TargetAndTransition;
} {
  const reduceMotion = usePrefersReducedMotion();

  return {
    initial: false,
    // Before mount, reduceMotion is false — keep first paint identical to SSR.
    animate: reduceMotion ? STATIC_IN_VIEW : visible,
  };
}

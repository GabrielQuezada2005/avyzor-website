import type { Transition, Variants } from "framer-motion";

/** Easing curves for premium feel */
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;
export const easeOutQuart = [0.25, 1, 0.5, 1] as const;

/** Default viewport config for scroll-triggered animations */
export const scrollViewport = { once: true, margin: "-80px" } as const;

/** Stagger container for grid/card reveals */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

/** Fade up reveal */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

/** Fade up with scale */
export const fadeUpScale: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: easeOutExpo },
  },
};

/** Slide in from left */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

/** Slide in from right */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

/** Hero entrance sequence */
export const heroStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

export const heroItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeOutExpo },
  },
};

/** Instant variants when prefers-reduced-motion is on */
export const reducedFade: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};

/** Spring transition for interactive elements */
export const springTransition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 25,
};

/** Card hover spring */
export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -4,
    transition: springTransition,
  },
};

/** Soft gold glow used on primary control hover */
export const goldHoverGlow =
  "0 8px 28px rgba(201, 162, 39, 0.28), 0 0 40px rgba(201, 162, 39, 0.18)";

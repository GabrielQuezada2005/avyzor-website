"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/** True only after client mount — keeps SSR and first client render identical. */
export function useIsMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

/**
 * prefers-reduced-motion, deferred until after mount.
 * Framer's useReducedMotion() is null on SSR but true on client when the OS
 * setting is on — gating whileTap/whileHover on it drops tabIndex and causes
 * hydration NotFoundError / AggregateError wipes in real browsers.
 */
export function usePrefersReducedMotion(): boolean {
  const mounted = useIsMounted();
  const reduceMotion = useReducedMotion();
  return Boolean(mounted && reduceMotion);
}

"use client";

import { useEffect, useState } from "react";
import { ContactMenu } from "@/components/layout/ContactMenu";
import { ContactMenuBoundary } from "@/components/layout/ContactMenuBoundary";

/**
 * Client-only mount for the floating contact menu.
 * Avoids next/dynamic({ ssr:false }) as a second layout sibling (hydration wipe risk)
 * while keeping AssistantWidgetLazy unchanged.
 */
export function ContactMenuMount() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  if (!ready) return null;

  return (
    <ContactMenuBoundary>
      <ContactMenu />
    </ContactMenuBoundary>
  );
}

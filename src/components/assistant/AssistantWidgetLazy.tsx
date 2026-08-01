"use client";

import dynamic from "next/dynamic";

/** Lazy geladen – verbessert FCP/LCP ohne Funktionsänderung. */
export const AssistantWidgetLazy = dynamic(
  () =>
    import("@/components/assistant/AssistantWidget").then(
      (module) => module.AssistantWidget
    ),
  { ssr: false }
);

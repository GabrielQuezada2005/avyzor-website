"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const t = useTranslations("common");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-gold-400 text-sm font-medium tracking-widest uppercase mb-4">
          {t("errorTitle")}
        </p>
        <p className="text-white/50 mb-8">{t("errorGeneric")}</p>
        <Button size="lg" onClick={() => reset()}>
          {t("errorRetry")}
        </Button>
      </div>
    </div>
  );
}

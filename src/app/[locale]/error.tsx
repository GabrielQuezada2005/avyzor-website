"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import { logClientError } from "@/lib/logging/client";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const t = useTranslations("common");

  useEffect(() => {
    logClientError("Locale error boundary", error, { digest: error.digest });
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-gold-400 text-sm font-medium tracking-widest uppercase mb-4">
          {t("errorCode")}
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
          {t("errorTitle")}
        </h1>
        <p className="text-white/50 mb-4">{t("errorGeneric")}</p>
        {error.digest && (
          <p className="text-white/30 text-xs mb-8 font-mono">Ref: {error.digest}</p>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" onClick={() => reset()}>
            {t("errorRetry")}
          </Button>
          <Link href="/">
            <Button variant="secondary" size="lg">
              <ArrowLeft size={18} />
              {t("errorHome")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

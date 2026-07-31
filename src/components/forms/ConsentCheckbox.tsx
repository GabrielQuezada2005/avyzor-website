"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface ConsentCheckboxProps {
  id: string;
  error?: string;
  className?: string;
}

export function ConsentCheckbox({ id, error, className }: ConsentCheckboxProps) {
  const t = useTranslations("forms.consent");
  const label = t("label");
  const privacyLink = t("privacyLink");
  const [beforeLink, afterLink] = label.split(privacyLink);

  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          id={id}
          name="consent"
          value="true"
          required
          className="mt-1 w-4 h-4 rounded border-white/20 bg-dark-700 text-gold-500 focus:ring-gold-500/50 focus:ring-offset-0"
        />
        <span className="text-sm text-white/60 leading-relaxed">
          {beforeLink}
          <Link
            href="/datenschutz"
            className="text-gold-400 hover:text-gold-300 underline underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            {privacyLink}
          </Link>
          {afterLink}
        </span>
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

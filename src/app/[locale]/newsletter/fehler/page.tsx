import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AlertCircle } from "lucide-react";
import { NEWSLETTER_ERROR_REASONS } from "@/lib/i18n/structures";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "newsletter.error" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    robots: { index: false, follow: false },
  };
}

export default async function NewsletterErrorPage({
  searchParams,
}: {
  searchParams: { reason?: string };
}) {
  const t = await getTranslations("newsletter.error");

  const reason = searchParams.reason;
  const message =
    reason &&
    NEWSLETTER_ERROR_REASONS.includes(
      reason as (typeof NEWSLETTER_ERROR_REASONS)[number]
    )
      ? t(`reasons.${reason}`)
      : t("defaultMessage");

  return (
    <div className="pt-32 pb-20">
      <div className="container-premium mx-auto px-4 md:px-8 max-w-lg text-center">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
        <h1 className="font-display text-3xl font-bold text-white mb-4">
          {t("title")}
        </h1>
        <p className="text-white/60 mb-8">{message}</p>
        <Link
          href="/#kontakt"
          className="text-gold-400 hover:text-gold-300 transition-colors text-sm"
        >
          {t("retryLink")}
        </Link>
      </div>
    </div>
  );
}

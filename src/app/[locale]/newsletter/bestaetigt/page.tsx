import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buildLocalizedPageMetadata } from "@/lib/seo";
import { CheckCircle } from "lucide-react";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "newsletter.confirmed" });

  return buildLocalizedPageMetadata({
    locale,
    path: "/newsletter/bestaetigt",
    title: t("metaTitle"),
    description: t("metaDescription"),
    robots: { index: false, follow: false },
  });
}

export default async function NewsletterConfirmedPage() {
  const t = await getTranslations("newsletter.confirmed");

  return (
    <div className="pt-32 pb-20">
      <div className="container-premium mx-auto px-4 md:px-8 max-w-lg text-center">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
        <h1 className="font-display text-3xl font-bold text-white mb-4">
          {t("title")}
        </h1>
        <p className="text-white/60 mb-8">{t("description")}</p>
        <Link
          href="/"
          className="text-gold-400 hover:text-gold-300 transition-colors text-sm"
        >
          {t("backHome")}
        </Link>
      </div>
    </div>
  );
}

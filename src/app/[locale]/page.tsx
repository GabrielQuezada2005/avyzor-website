import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Pricing } from "@/components/sections/Pricing";
import { WhyAvyzor } from "@/components/sections/WhyAvyzor";
import { Portfolio } from "@/components/sections/Portfolio";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { Contact } from "@/components/sections/Contact";
import { CTA } from "@/components/sections/CTA";
import { buildLocalizedPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" });

  return buildLocalizedPageMetadata({
    locale,
    path: "",
    title: t("title"),
    description: t("description"),
    keywords: t.raw("keywords") as string[],
    ogImageAlt: t("ogImageAlt"),
  });
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Pricing />
      <WhyAvyzor />
      <Portfolio />
      <Testimonials />
      <FAQ />
      <Contact />
      <CTA />
    </>
  );
}

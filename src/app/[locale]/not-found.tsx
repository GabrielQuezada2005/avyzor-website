import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-gold-400 text-sm font-medium tracking-widest uppercase mb-4">
          {t("code")}
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
          {t("title")}
        </h1>
        <p className="text-white/50 mb-8">{t("description")}</p>
        <Link href="/">
          <Button size="lg">
            <ArrowLeft size={18} />
            {t("backHome")}
          </Button>
        </Link>
      </div>
    </div>
  );
}

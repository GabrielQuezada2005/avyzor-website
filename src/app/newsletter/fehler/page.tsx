import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Newsletter-Fehler",
  description: "Bei der Newsletter-Bestätigung ist ein Fehler aufgetreten.",
  robots: { index: false, follow: false },
};

export default function NewsletterErrorPage({
  searchParams,
}: {
  searchParams: { reason?: string };
}) {
  const messages: Record<string, string> = {
    invalid: "Der Bestätigungslink ist ungültig.",
    not_found: "Der Bestätigungslink ist abgelaufen oder wurde bereits verwendet.",
    server: "Ein technischer Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
  };

  const message =
    messages[searchParams.reason ?? ""] ??
    "Bei der Bestätigung ist ein Fehler aufgetreten.";

  return (
    <div className="pt-32 pb-20">
      <div className="container-premium mx-auto px-4 md:px-8 max-w-lg text-center">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
        <h1 className="font-display text-3xl font-bold text-white mb-4">
          Bestätigung fehlgeschlagen
        </h1>
        <p className="text-white/60 mb-8">{message}</p>
        <Link
          href="/#kontakt"
          className="text-gold-400 hover:text-gold-300 transition-colors text-sm"
        >
          ← Newsletter erneut anmelden
        </Link>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Newsletter bestätigt",
  description: "Ihre Newsletter-Anmeldung bei AVYZOR wurde bestätigt.",
  robots: { index: false, follow: false },
};

export default function NewsletterConfirmedPage() {
  return (
    <div className="pt-32 pb-20">
      <div className="container-premium mx-auto px-4 md:px-8 max-w-lg text-center">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
        <h1 className="font-display text-3xl font-bold text-white mb-4">
          Anmeldung bestätigt
        </h1>
        <p className="text-white/60 mb-8">
          Vielen Dank! Sie erhalten ab sofort unsere exklusiven KI-Insights und
          Premium-Updates.
        </p>
        <Link
          href="/"
          className="text-gold-400 hover:text-gold-300 transition-colors text-sm"
        >
          ← Zurück zur Startseite
        </Link>
      </div>
    </div>
  );
}

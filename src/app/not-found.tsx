import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * Root 404 – erforderlich für next-intl Routing.
 * Bei pass-through Root-Layout muss diese Seite eigenes html/body enthalten.
 */
export default function NotFound() {
  return (
    <html lang="de">
      <body className="antialiased bg-dark-900 text-white">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <p className="text-gold-400 text-sm font-medium tracking-widest uppercase mb-4">
              404
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Seite nicht gefunden
            </h1>
            <p className="text-white/50 mb-8">
              Die angeforderte Seite existiert nicht oder wurde verschoben.
            </p>
            <Link
              href="/de"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-500 text-dark-900 font-medium hover:bg-gold-400 transition-colors"
            >
              <ArrowLeft size={18} />
              Zur Startseite
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}

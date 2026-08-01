"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { logClientError } from "@/lib/logging/client";
import "./globals.css";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    logClientError("Root error boundary", error, { digest: error.digest });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark-900 text-white">
      <div className="text-center max-w-md">
        <p className="text-gold-400 text-sm font-medium tracking-widest uppercase mb-4">
          500
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
          Ein Fehler ist aufgetreten
        </h1>
        <p className="text-white/50 mb-4">
          Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.
        </p>
        {error.digest && (
          <p className="text-white/30 text-xs mb-8 font-mono">Ref: {error.digest}</p>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-500 text-dark-900 font-medium hover:bg-gold-400 transition-colors"
          >
            Erneut versuchen
          </button>
          <Link
            href="/de"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/15 text-white/80 font-medium hover:border-gold-500/30 hover:text-gold-300 transition-colors"
          >
            <ArrowLeft size={18} />
            Zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}

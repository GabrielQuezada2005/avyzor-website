"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark-900 text-white">
      <div className="text-center max-w-md">
        <p className="text-gold-400 text-sm font-medium tracking-widest uppercase mb-4">
          Fehler
        </p>
        <p className="text-white/50 mb-8">
          Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es
          erneut.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-500 text-dark-900 font-medium hover:bg-gold-400 transition-colors"
        >
          Erneut versuchen
        </button>
      </div>
    </div>
  );
}

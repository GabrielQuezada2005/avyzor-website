import { Inter, Playfair_Display } from "next/font/google";

/** Primärschrift – preload für schnelleren First Paint (LCP). */
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  adjustFontFallback: true,
  preload: true,
});

/** Display-Schrift – sekundär, kein Preload (geringerer Blocking-Impact). */
export const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  adjustFontFallback: true,
  preload: false,
});

export const fontVariables = `${inter.variable} ${playfair.variable}`;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#FFF9E6",
          100: "#FFF0BF",
          200: "#FFE080",
          300: "#FFD040",
          400: "#E8B923",
          500: "#C9A227",
          600: "#A8861F",
          700: "#876917",
          800: "#664D10",
          900: "#453308",
        },
        dark: {
          950: "#030303",
          900: "#0A0A0A",
          800: "#111111",
          700: "#1A1A1A",
          600: "#242424",
          500: "#2E2E2E",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #C9A227 0%, #FFE080 50%, #C9A227 100%)",
        "dark-gradient":
          "linear-gradient(180deg, #0A0A0A 0%, #111111 50%, #0A0A0A 100%)",
        "radial-gold":
          "radial-gradient(ellipse at center, rgba(201, 162, 39, 0.15) 0%, transparent 70%)",
      },
      animation: {
        shimmer: "shimmer 3s ease-in-out infinite",
        "pulse-gold": "pulse-gold 4s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "pulse-gold": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      boxShadow: {
        gold: "0 0 40px rgba(201, 162, 39, 0.3)",
        "gold-lg": "0 0 80px rgba(201, 162, 39, 0.2)",
        premium: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
};

export default config;

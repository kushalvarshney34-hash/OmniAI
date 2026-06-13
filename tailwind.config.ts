import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090B",
        foreground: "#FAFAFA",
        card: {
          DEFAULT: "#111113",
          foreground: "#FAFAFA",
        },
        border: "#27272A",
        primary: {
          DEFAULT: "#7C3AED",
          foreground: "#FAFAFA",
        },
        secondary: {
          DEFAULT: "#8B5CF6",
          foreground: "#FAFAFA",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        muted: {
          DEFAULT: "#A1A1AA",
          foreground: "#A1A1AA",
        },
        accent: {
          DEFAULT: "#27272A",
          foreground: "#FAFAFA",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      boxShadow: {
        glow: "0 0 20px rgba(124, 58, 237, 0.3)",
        "glow-danger": "0 0 20px rgba(239, 68, 68, 0.4)",
        card: "0 4px 24px rgba(0, 0, 0, 0.4)",
        float: "0 8px 32px rgba(0, 0, 0, 0.5)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)",
        "gradient-card": "linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(17,17,19,0.8) 100%)",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "cursor-blink": "cursor-blink 1s step-end infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 10px rgba(124, 58, 237, 0.3)" },
          "50%": { boxShadow: "0 0 25px rgba(124, 58, 237, 0.6)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "cursor-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

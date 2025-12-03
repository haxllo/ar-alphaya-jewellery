import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      colors: {
        // NEW: Minimal Luxury Palette
        // Primary Background
        "neutral-soft": "#F9F9F9",
        
        // Text
        "deep-black": "#111111",
        
        // Accent Metal (Gold)
        "metal-gold": {
          DEFAULT: "#D6C39E",
          light: "#E8DCC4",
          dark: "#C4B88C",
        },
        
        // Deep Background
        "forest-deep": {
          DEFAULT: "#0D1505",
          light: "#1A2810",
        },

        // Semantic colors (mapped to new palette)
        background: "#F9F9F9",
        foreground: "#111111",
        muted: {
          DEFAULT: "#C4B88C",
          foreground: "#0D1505",
        },
        border: "#D6C39E",
        accent: {
          DEFAULT: "#D6C39E",
          foreground: "#111111",
        },
        button: {
          DEFAULT: "#111111",
          foreground: "#F9F9F9",
        },
        secondary: {
          DEFAULT: "#0D1505",
          foreground: "#F9F9F9",
        },
        
        // Keep compatibility with old color names (will migrate gradually)
        primary: {
          DEFAULT: "#111111",
          foreground: "#F9F9F9",
        },
        gold: {
          DEFAULT: "#D6C39E",
          light: "#E8DCC4",
          dark: "#C4B88C",
        },
      },
      boxShadow: {
        luxe: "0 20px 45px -20px rgba(17, 17, 17, 0.15)",
        subtle: "0 12px 30px -18px rgba(17, 17, 17, 0.10)",
        gold: "0 10px 25px -5px rgba(214, 195, 158, 0.3)",
      },
      backgroundImage: {
        "hero-radial": "radial-gradient(circle at top right, rgba(214, 195, 158, 0.2), transparent 55%)",
        "hero-linear": "linear-gradient(135deg, rgba(13, 21, 5, 0.95), rgba(26, 40, 16, 0.65))",
        "gold-gradient": "linear-gradient(135deg, #F9F9F9 0%, #D6C39E 100%)",
        "gold-radial": "radial-gradient(circle at center, #E8DCC4, #D6C39E)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.34, 0.04, 0, 1)",
      },
    },
  },
  plugins: [],
};
export default config;

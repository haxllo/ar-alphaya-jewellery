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
        // Amber Mirage Theme - Warm, radiant, and grounded
        "amber-mirage": {
          soft: "#FFF5E1",      // Soft cream - backgrounds
          warm: "#EBC176",      // Warm gold - primary accent
          gold: "#C48B28",      // Deep gold - secondary accent
          brown: "#5A3C0B",     // Rich brown - text/dark elements
          50: "#FFFBF5",
          100: "#FFF5E1",
          200: "#F9E8C5",
          300: "#EBC176",
          400: "#E0A84D",
          500: "#C48B28",
          600: "#A67420",
          700: "#7D5718",
          800: "#5A3C0B",
          900: "#3D2807",
        },
        primary: {
          50: "#FFFBF5",
          100: "#FFF5E1",
          200: "#F9E8C5",
          300: "#EBC176",
          400: "#E0A84D",
          500: "#C48B28",
          600: "#A67420",
          700: "#7D5718",
          800: "#5A3C0B",
          900: "#3D2807",
        },
        // Semantic colors
        background: "#FFF5E1",
        foreground: "#5A3C0B",
        muted: {
          DEFAULT: "#A67420",
          foreground: "#7D5718",
        },
        border: "#EBC176",
        accent: {
          DEFAULT: "#C48B28",
          foreground: "#FFF5E1",
        },
        button: {
          DEFAULT: "#C48B28",
          foreground: "#FFF5E1",
        },
        secondary: {
          DEFAULT: "#FFF5E1",
          foreground: "#5A3C0B",
        },
        gold: {
          50: "#FFFBF5",
          100: "#FFF5E1",
          200: "#F9E8C5",
          300: "#EBC176",
          400: "#E0A84D",
          500: "#C48B28",
          600: "#A67420",
          700: "#7D5718",
          800: "#5A3C0B",
          900: "#3D2807",
        },
        nocturne: {
          50: "#FFFBF5",
          100: "#F9F5ED",
          200: "#EDE6D9",
          300: "#D9CCBA",
          400: "#B8A48C",
          500: "#8B7355",
          600: "#6B5742",
          700: "#5A3C0B",
          800: "#3D2807",
          900: "#2A1A05",
        },
      },
      boxShadow: {
        luxe: "0 20px 45px -20px rgba(196, 139, 40, 0.35)",
        subtle: "0 12px 30px -18px rgba(196, 139, 40, 0.25)",
        amber: "0 10px 25px -5px rgba(235, 193, 118, 0.4)",
      },
      backgroundImage: {
        "hero-radial": "radial-gradient(circle at top right, rgba(235, 193, 118, 0.3), transparent 55%)",
        "hero-linear": "linear-gradient(135deg, rgba(196, 139, 40, 0.92), rgba(90, 60, 11, 0.55))",
        "amber-gradient": "linear-gradient(135deg, #FFF5E1 0%, #EBC176 100%)",
        "amber-radial": "radial-gradient(circle at center, #EBC176, #C48B28)",
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

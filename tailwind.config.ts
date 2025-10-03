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
        // Clean black and white theme matching original site
        primary: {
          50: "#ffffff",   // Pure white
          100: "#f9fafb",  // Off white
          200: "#f3f4f6",  // Very light gray
          300: "#e5e7eb",  // Light gray
          400: "#9ca3af",  // Medium gray
          500: "#6b7280",  // Base gray
          600: "#4b5563",  // Dark gray
          700: "#374151",  // Very dark gray
          800: "#1f2937",  // Almost black
          900: "#121212",  // Pure black
        },
        // Semantic colors matching original website
        background: "#ffffff",
        foreground: "#121212",
        muted: {
          DEFAULT: "#6b7280",
          foreground: "#4b5563",
        },
        border: "#e5e7eb",
        accent: {
          DEFAULT: "#121212",
          foreground: "#ffffff",
        },
        // Button colors matching original
        button: {
          DEFAULT: "#121212",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#ffffff",
          foreground: "#121212",
        },
        gold: {
          50: "#fbf7f2",
          100: "#f6ecdf",
          200: "#ecd4b7",
          300: "#e0bb8f",
          400: "#d7a873",
          500: "#c98f4d",
          600: "#a26f34",
          700: "#7a5222",
          800: "#523614",
          900: "#291b0a",
        },
        nocturne: {
          50: "#f4f5f7",
          100: "#e3e6ea",
          200: "#c8ccd5",
          300: "#a8adb9",
          400: "#7e8697",
          500: "#5f697c",
          600: "#495166",
          700: "#363d52",
          800: "#242a3a",
          900: "#121523",
        },
      },
      boxShadow: {
        luxe: "0 20px 45px -20px rgba(18, 18, 18, 0.35)",
        subtle: "0 12px 30px -18px rgba(18, 18, 18, 0.25)",
      },
      backgroundImage: {
        "hero-radial": "radial-gradient(circle at top right, rgba(233, 220, 204, 0.4), transparent 55%)",
        "hero-linear": "linear-gradient(135deg, rgba(18, 18, 18, 0.92), rgba(18, 18, 18, 0.55))",
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

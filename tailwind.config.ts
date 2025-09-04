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
      },
    },
  },
  plugins: [],
};
export default config;

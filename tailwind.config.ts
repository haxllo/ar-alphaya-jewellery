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
        // AR Alphaya Brand Colors
        primary: {
          50: "#f8f9fa",   // Lightest gray
          100: "#e9ecef",  // Very light gray
          200: "#dee2e6",  // Light gray
          300: "#ced4da",  // Medium light gray
          400: "#adb5bd",  // Medium gray
          500: "#6c757d",  // Base gray
          600: "#495057",  // Dark gray
          700: "#343a40",  // Very dark gray
          800: "#212529",  // Almost black
          900: "#000000",  // Pure black for accents
        },
        // Semantic colors using the palette
        background: "#f8f9fa",
        foreground: "#212529",
        muted: {
          DEFAULT: "#6c757d",
          foreground: "#495057",
        },
        border: "#dee2e6",
        accent: {
          DEFAULT: "#343a40",
          foreground: "#f8f9fa",
        },
      },
    },
  },
  plugins: [],
};
export default config;

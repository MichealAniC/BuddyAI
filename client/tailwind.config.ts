import type { Config } from "tailwindcss";
import { colors, spacing, typography, radius, shadows } from "./src/styles/design-tokens";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors,
      spacing,
      fontFamily: {
        sans: [
          typography.fontFamily.sans,
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        mono: [typography.fontFamily.mono, "ui-monospace", "monospace"],
      },
      borderRadius: radius,
      boxShadow: shadows,
    },
  },
  plugins: [],
};

export default config;

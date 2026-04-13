import { heroui } from "@heroui/theme";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /^(bg|text|border|fill)-(light|dark)-/,
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        manrope: "var(--font-manrope)",
      },
      colors: {
        light: {
          background: "var(--background)",
          foreground: "var(--foreground)",

          textPrimary: "#333232",
          textSecondary: "#8C8C8C",
          textError: "#D92D20",
          textMuted: "#ACACAC",

          borderPrimary: "#E0E0E0",
          borderSecondary: "#D0D0D0",
          borderDivider: "#CCCCCC",

          backgroundColor: "#F5F5F7",
          backgroundHover: "#a1a1aa",
          backgroundProfileCard: "#FAFAFA",

          buttonPrimary: "#6457F9",
          buttonActive: "#2C2C2C",
          buttonHover: "#424242",

          footerBg: "#000000",
          iconPrimary: "#333232",
          iconMuted: "#8C8C8C",
        },
        dark: {
          background: "#18181B", // Slightly lighter black for better contrast
          foreground: "#1F1F22", // Dark gray foreground to soften harsh contrast

          textPrimary: "#EDEDED", // Softer off-white for better readability
          textSecondary: "#B3B3B3", // Slightly brighter gray for improved clarity
          textError: "#FF5A5F", // More vibrant red for a striking error color
          textMuted: "#9E9E9E", // Medium gray for subtle text elements

          borderPrimary: "#2E2E32", // Modern soft-dark borders
          borderSecondary: "#424242", // Slightly lighter border for depth
          borderDivider: "#505050", // More contrast in dividers for clear sections

          backgroundColor: "#202127", // Deep dark blue-gray for a premium look
          backgroundHover: "#2A2A2E", // Hover effect with a rich dark tone

          buttonPrimary: "#8B5CF6", // A fresh, modern violet
          buttonActive: "#6D28D9", // Darker violet for active states
          buttonHover: "#7C3AED", // Bright hover effect for a sleek look

          footerBg: "#101014", // Ultra-dark footer for a seamless experience
          iconPrimary: "#EAEAEA", // Brighter icons for visibility
          iconMuted: "#A1A1A1", // Soft gray-muted icons for balance
        },
      },
      fontSize: {
        "2.5xl": ["1.675rem", { lineHeight: "2.15rem" }],
        //   font-size: 1.5rem /* 24px */;
        // line-height: 2rem
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
} satisfies Config;

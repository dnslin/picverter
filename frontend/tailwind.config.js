import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 温暖的白天模式配色
        warm: {
          50: "#fefdfb",
          100: "#fef7ed",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        // 焦糖色调
        caramel: {
          50: "#fdf8f6",
          100: "#f2e8e5",
          200: "#eaddd7",
          300: "#e0cfc5",
          400: "#d2bab0",
          500: "#bfa094",
          600: "#a18072",
          700: "#977669",
          800: "#846358",
          900: "#43302b",
        },
        // 温暖中性色
        "warm-gray": {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: "#fcfcfc", // 更柔和的浅灰白色
            foreground: "#2d2d2d", // 柔和的深灰色文字
            primary: {
              50: "#fef9f5",
              100: "#fef2e8",
              200: "#fde4cc",
              300: "#fbd0a5",
              400: "#f8b572",
              500: "#f59e0b", // 柔和的琥珀色
              600: "#d97706",
              700: "#b45309",
              800: "#92400e",
              900: "#78350f",
              DEFAULT: "#f59e0b",
              foreground: "#fef9f5",
            },
            secondary: {
              50: "#f8fafc",
              100: "#f1f5f9",
              200: "#e2e8f0",
              300: "#cbd5e1",
              400: "#94a3b8",
              500: "#64748b", // 柔和的石板色
              600: "#475569",
              700: "#334155",
              800: "#1e293b",
              900: "#0f172a",
              DEFAULT: "#64748b",
              foreground: "#f8fafc",
            },
            default: {
              50: "#fcfcfc",
              100: "#f8f9fa",
              200: "#f1f3f4",
              300: "#e8eaed",
              400: "#dadce0",
              500: "#9aa0a6",
              600: "#80868b",
              700: "#5f6368",
              800: "#3c4043",
              900: "#202124",
              DEFAULT: "#f8f9fa",
              foreground: "#3c4043",
            },
          },
        },
        dark: {
          colors: {
            background: "#1a1a1a", // 温和的深灰色背景
            foreground: "#f5f5f5", // 柔和的浅色文字
            primary: {
              50: "#f0f9ff",
              100: "#e0f2fe",
              200: "#bae6fd",
              300: "#7dd3fc",
              400: "#38bdf8",
              500: "#0ea5e9", // 柔和的天蓝色
              600: "#0284c7",
              700: "#0369a1",
              800: "#075985",
              900: "#0c4a6e",
              DEFAULT: "#0ea5e9",
              foreground: "#f0f9ff",
            },
            secondary: {
              50: "#f8fafc",
              100: "#f1f5f9",
              200: "#e2e8f0",
              300: "#cbd5e1",
              400: "#94a3b8",
              500: "#64748b", // 柔和的石板色
              600: "#475569",
              700: "#334155",
              800: "#1e293b",
              900: "#0f172a",
              DEFAULT: "#64748b",
              foreground: "#f8fafc",
            },
          },
        },
      },
    }),
  ],
};

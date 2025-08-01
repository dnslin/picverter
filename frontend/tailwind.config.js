import { heroui } from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 温暖的白天模式配色
        warm: {
          50: '#fefdfb',
          100: '#fef7ed',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // 焦糖色调
        caramel: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cfc5',
          400: '#d2bab0',
          500: '#bfa094',
          600: '#a18072',
          700: '#977669',
          800: '#846358',
          900: '#43302b',
        },
        // 温暖中性色
        'warm-gray': {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
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
            background: "#faf9f7", // 更温暖的米白色
            foreground: "#3c2415", // 深咖啡色文字
            primary: {
              50: "#fef7ed",
              100: "#fef0db",
              200: "#fce0b6",
              300: "#fac986",
              400: "#f6a54a",
              500: "#ea580c", // 温暖橙色
              600: "#d2410c",
              700: "#b91c1c",
              800: "#991b1b",
              900: "#7c2d12",
              DEFAULT: "#ea580c",
              foreground: "#fef7ed",
            },
            secondary: {
              50: "#fdf8f6",
              100: "#f4ede8",
              200: "#e6d5cc",
              300: "#d5baa7",
              400: "#c29882",
              500: "#a67c5a", // 温暖棕色
              600: "#8b6138",
              700: "#72502a",
              800: "#5a4023",
              900: "#4a341c",
              DEFAULT: "#a67c5a",
              foreground: "#fdf8f6",
            },
            default: {
              50: "#faf9f7",
              100: "#f5f3f0",
              200: "#e8e4df",
              300: "#d9d3cc",
              400: "#b8ada3",
              500: "#978c7e",
              600: "#7a6e5d",
              700: "#655a4a",
              800: "#524839",
              900: "#433a2e",
              DEFAULT: "#f5f3f0",
              foreground: "#433a2e",
            },
          },
        },
        dark: {
          colors: {
            background: "#0f0e0d", // 更深的背景
            foreground: "#faf9f7",
            primary: {
              50: "#f0fdf5",
              100: "#dcfce8",
              200: "#bbf7d0",
              300: "#86efac",
              400: "#4ade80",
              500: "#22c55e", // 翠绿色
              600: "#16a34a",
              700: "#15803d",
              800: "#166534",
              900: "#14532d",
              DEFAULT: "#22c55e",
              foreground: "#0f0e0d",
            },
            secondary: {
              50: "#f0fdfa",
              100: "#ccfbf1",
              200: "#99f6e4",
              300: "#5eead4",
              400: "#2dd4bf",
              500: "#14b8a6", // 青色
              600: "#0d9488",
              700: "#0f766e",
              800: "#115e59",
              900: "#134e4a",
              DEFAULT: "#14b8a6",
              foreground: "#f0fdfa",
            },
          },
        },
      },
    })
  ],
}

import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-dark": "#2A2A2A",
        "brand-peach": "#FCE6E3",
        "brand-peachHover": "#F8D8D3",
        "brand-gray": "#A8A8A8",
        "brand-bg": "#FAFAFC",
        brand: {
          50: "#f2f7f6",
          100: "#dceae7",
          200: "#b8d5cf",
          300: "#8cb8ad",
          400: "#63998d",
          500: "#497f74",
          600: "#37645c",
          700: "#2f504a",
          800: "#2a423d",
          900: "#253935"
        }
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta-sans)", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};

export default config;
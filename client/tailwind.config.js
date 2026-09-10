/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["Space Grotesk", "Inter", "sans-serif"],
      },
      colors: {
        brand: {
          50:  "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#fd6701", // Official NFcard Logo Orange
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#431407",
        },
        orange: {
          50:  "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#fd6701",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#431407",
        },
        gold: {
          50:  "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        }
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
        "4xl": "28px",
      },
      boxShadow: {
        "card":   "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.05)",
        "card-hover": "0 4px 20px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.06)",
        "glow-brand": "0 0 30px rgba(253,103,1,0.30), 0 4px 16px rgba(253,103,1,0.20)",
        "glow-orange": "0 0 30px rgba(253,103,1,0.30), 0 4px 16px rgba(253,103,1,0.20)",
        "glow-gold": "0 0 30px rgba(245,158,11,0.3), 0 4px 16px rgba(245,158,11,0.2)",
      },
      animation: {
        "float": "float3d 5s ease-in-out infinite",
        "pulse-glow": "chipPulse 2.5s ease-in-out infinite",
        "fade-up": "fadeInUp 0.5s ease-out forwards",
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [],
};
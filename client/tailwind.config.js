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
          50:  "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
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
        "glow-emerald": "0 0 30px rgba(5,150,105,0.25), 0 4px 16px rgba(5,150,105,0.15)",
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
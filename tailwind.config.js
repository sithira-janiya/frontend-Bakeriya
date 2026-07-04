/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // crust resolves to CSS variables so toggling `.dark` reskins the app
        crust: {
          50: "rgb(var(--c-50) / <alpha-value>)",
          100: "rgb(var(--c-100) / <alpha-value>)",
          200: "rgb(var(--c-200) / <alpha-value>)",
          300: "rgb(var(--c-300) / <alpha-value>)",
          400: "rgb(var(--c-400) / <alpha-value>)",
          500: "rgb(var(--c-500) / <alpha-value>)",
          600: "rgb(var(--c-600) / <alpha-value>)",
          700: "rgb(var(--c-700) / <alpha-value>)",
          800: "rgb(var(--c-800) / <alpha-value>)",
          900: "rgb(var(--c-900) / <alpha-value>)",
        },
        oven: {
          500: "#e8702a",
          600: "#d6551a",
          700: "#b2430f",
        },
      },
      fontFamily: {
        display: ["Quicksand", "sans-serif"],
        body: ["Nunito", "sans-serif"],
      },
      transitionTimingFunction: {
        "out-soft": "cubic-bezier(0.22, 1, 0.36, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      keyframes: {
        rise: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pop: {
          from: { opacity: "0", transform: "scale(0.94)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-l": {
          from: { opacity: "0", transform: "translateX(24px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        rise: "rise 320ms cubic-bezier(0.22, 1, 0.36, 1) both",
        pop: "pop 320ms cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "slide-l": "slide-l 320ms cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

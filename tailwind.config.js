/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        bg: {
          primary: "var(--color-bg-primary)",
          card: "var(--color-bg-card)",
          overlay: "var(--color-bg-overlay)",
          input: "var(--color-bg-input)",
          "button-primary": "var(--color-bg-button-primary)",
          "button-primary-hover": "var(--color-bg-button-primary-hover)",
          "button-disabled": "var(--color-bg-button-disabled)",
        },
        text: {
          primary: "var(--color-text-primary)",
          title: "var(--color-text-title)",
          subtitle: "var(--color-text-subtitle)",
          label: "var(--color-text-label)",
          input: "var(--color-text-input)",
          placeholder: "var(--color-text-placeholder)",
          "button-primary": "var(--color-text-button-primary)",
          link: "var(--color-text-link)",
          error: "var(--color-text-error)",
          helper: "var(--color-text-helper)",
        },
        border: {
          input: "var(--color-border-input)",
          "input-focus": "var(--color-border-input-focus)",
          "input-error": "var(--color-border-input-error)",
        },
        neutral: {
          0: "var(--color-neutral-0)",
          25: "var(--color-neutral-25)",
          100: "var(--color-neutral-100)",
          400: "var(--color-neutral-400)",
          600: "var(--color-neutral-600)",
          800: "var(--color-neutral-800)",
          900: "var(--color-neutral-900)",
          950: "var(--color-neutral-950)",
        },
      },
      borderRadius: {
        input: "var(--radius-input)",
        card: "var(--radius-card)",
        button: "var(--radius-button)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
    },
  },

  plugins: [],
};
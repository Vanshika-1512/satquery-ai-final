/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        geo: {
          bg: "#0B1118",
          secondary: "#101923",
          surface: "#141F2A",
          elevated: "#192633",
          border: "#273543",
          "border-light": "#36485C",
          text: "#E5EAF0",
          muted: "#9AA8B7",
          subtle: "#718096",
          accent: "#48A9A6",
          "accent-hover": "#3D9491",
          blue: "#648DB5",
          "blue-hover": "#54789B",
          success: "#6BA88B",
          warning: "#D3A35C",
          error: "#CF7777",
        },
      },
      fontFamily: {
        sans: ["'IBM Plex Sans'", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
      borderRadius: {
        DEFAULT: "4px",
        sm: "2px",
        md: "6px",
        lg: "8px",
        xl: "10px",
        "2xl": "12px",
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.35)",
        card: "0 2px 8px -1px rgba(0, 0, 0, 0.45)",
      },
    },
  },
  plugins: [],
}

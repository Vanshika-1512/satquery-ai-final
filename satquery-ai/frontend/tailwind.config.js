/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cosmos: {
          950: "#02050E",
          900: "#040916",
          850: "#071224",
          800: "#0c1b38",
          750: "#102347",
          700: "#172b52",
          600: "#224177",
          cyan: "#22d3ee",
        },
        // ── Background scale (warm dark brown) ──────────────
        space: {
          950: "#120D0A",  // deepest ink — page background
          900: "#1A1410",  // neutral dark
          850: "#1C1510",  // panel surface
          800: "#221812",  // slightly lighter panel
          700: "#2E2018",  // border / divider
          600: "#44342A",  // hover surface / muted
        },
        // ── Accent scale (warm earthy palette) ──────────────
        accent: {
          primary:   "#FFDBBB",   // Primary  — peach cream (CTAs, active states)
          secondary: "#CCBEB1",   // Secondary — warm beige (secondary text/elements)
          tertiary:  "#997E67",   // Tertiary  — warm brown (labels, muted)
          positive:  "#8FAF8A",   // Positive  — muted sage green
          negative:  "#C47A6A",   // Negative  — warm clay red
          cyan:   "#22d3ee",
          blue:   "#38bdf8",
          amber:  "#f59e0b",
          teal:   "#14b8a6",
          red:    "#ef4444",
        },
      },
      fontFamily: {
        sans:      ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        display:   ["Plus Jakarta Sans", "Space Grotesk", "system-ui", "sans-serif"],
        label:     ["Space Grotesk", "system-ui", "sans-serif"],
        mono:      ["IBM Plex Mono", "ui-monospace", "monospace"],
        serifHero: ["Playfair Display", "Cinzel", "serif"],
        cinzel:    ["Cinzel", "serif"],
      },
      boxShadow: {
        glow: "0 1px 0 rgba(255,219,187,0.20), 0 10px 24px -12px rgba(18,13,10,0.7)",
      },
    },
  },
  plugins: [],
}

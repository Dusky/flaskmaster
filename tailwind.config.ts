import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#1a1d29",
        surface: "#252936",
        "text-primary": "#e8e6e3",
        "text-secondary": "#9b9a97",
        gold: "#f4a261",
        "electric-blue": "#2a9d8f",
        danger: "#e63946",
        success: "#06d6a0",
        // Contestant colors
        contestant: {
          1: "#e76f51",
          2: "#8338ec",
          3: "#3a86ff",
          4: "#fb5607",
          5: "#06a77d",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        body: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["Consolas", "Monaco", "Courier New", "monospace"],
      },
      boxShadow: {
        card: "0 4px 6px rgba(0,0,0,0.1)",
        "card-hover": "0 8px 12px rgba(0,0,0,0.2)",
      },
      borderRadius: {
        card: "12px",
      },
    },
  },
  plugins: [],
};

export default config;

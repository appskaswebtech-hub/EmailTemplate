import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./src/emails/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#f4f4f5",
        ink: "#18181b",
        gold: {
          DEFAULT: "#eab308",
          light: "#fde68a",
          dark: "#a16207",
        },
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(24, 24, 27, 0.18)",
        "card-dark": "0 10px 30px -12px rgba(0, 0, 0, 0.6)",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./src/emails/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#f4f4f5",
        ink: "#18181b",
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(24, 24, 27, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;

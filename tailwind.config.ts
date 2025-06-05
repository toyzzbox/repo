import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,css}",
    "./app/(frontend)/**/*.{ts,tsx,css}",
    "./app/(backend)/**/*.{ts,tsx,css}",
    "./components/**/*.{ts,tsx,css}",
    "./pages/**/*.{ts,tsx,css}",
    "./src/**/*.{ts,tsx,css}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;

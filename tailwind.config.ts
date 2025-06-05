import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx,css}",
    "./src/app/(frontend)/**/*.{ts,tsx,css}",
    "./src/app/(backend)/**/*.{ts,tsx,css}",
    "./src/components/**/*.{ts,tsx,css}",
    "./src/pages/**/*.{ts,tsx,css}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;

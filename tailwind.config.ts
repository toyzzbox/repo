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
    extend: {
      typography: {
        DEFAULT: {
          css: {
            h1: {
              fontWeight: "700",
              fontSize: "2.25rem", // Tailwind'in text-4xl karşılığı
              marginBottom: "1rem",
            },
            h2: {
              fontWeight: "600",
              fontSize: "1.5rem",
              marginBottom: "0.75rem",
            },
            strong: {
              fontWeight: "600",
            },
            em: {
              fontStyle: "italic",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;

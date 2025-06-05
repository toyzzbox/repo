import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",      // Eğer pages dizini kullanıyorsan
    "./src/**/*.{ts,tsx}",        // Eğer başka klasörlerde component varsa
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

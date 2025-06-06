import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // ShadCN UI bileşenleri genellikle class tabanlı dark mode kullanır
  content: [
    "./src/app/**/*.{ts,tsx,js,jsx,mdx}",
    "./src/components/**/*.{ts,tsx,js,jsx}",
    "./src/lib/**/*.{ts,tsx,js,jsx}",
    // Eğer ShadCN UI bileşenlerini `node_modules` dışına taşıdıysanız buraya ekleyin:
    // "./components/ui/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "#e5e7eb",         // ✔️ border-border için tanım
        ring: "rgba(59, 130, 246)", // ✔️ outline-ring/50 için base tanım
        background: "#ffffff",
        foreground: "#111111",
      },
    },
  },
  plugins: [
    // Typography, forms veya aspect-ratio gibi ihtiyaçlara göre ekleyebilirsin:
    // require("@tailwindcss/forms"),
    // require("@tailwindcss/typography"),
    // require("@tailwindcss/aspect-ratio"),
  ],
};

export default config;

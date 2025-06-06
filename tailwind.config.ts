import { type Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(240, 5%, 90%)",
        input: "hsl(240, 5%, 90%)",
        ring: "hsl(240, 5%, 90%)",
        background: "hsl(0, 0%, 100%)",
        foreground: "hsl(240, 10%, 3.9%)",
        primary: {
          DEFAULT: "hsl(240, 5%, 60%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        muted: {
          DEFAULT: "hsl(240, 4%, 95%)",
          foreground: "hsl(240, 3.8%, 46.1%)",
        },
      },
    },
  },
  plugins: [],
};

export default config;

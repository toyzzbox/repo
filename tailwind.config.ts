/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}", // Next.js projesinde src yapısını kapsar
    ],
    theme: {
      extend: {
        colors: {
          primary: "#10B981", // örnek yeşil renk
          secondary: "#3B82F6", // örnek mavi renk
          destructive: "#DC2626", // örnek kırmızı renk
        },
      },
    },
    plugins: [],
  }
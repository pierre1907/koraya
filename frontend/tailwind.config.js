/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        koraya: {
          navy: "#1F3A5F",
          gold: "#B8860B",
        },
      },
    },
  },
  plugins: [],
};

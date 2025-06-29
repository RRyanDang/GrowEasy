/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'garden-green': '#22c55e',
        'garden-dark': '#15803d',
        'soil-brown': '#a16207',
      }
    },
  },
  plugins: [],
} 
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spotify: {
          base: "#121212",
          elevated: "#181818",
          highlight: "#282828",
          sidebar: "#000000",
          player: "#181818",
          green: "#1DB954",
          greenHover: "#1ed760",
          textPrimary: "#FFFFFF",
          textSecondary: "#B3B3B3",
          subdued: "#727272",
        },
      },
      fontFamily: {
        sans: ['Circular', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


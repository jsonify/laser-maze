/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        laser: {
          red: '#FF0000',
          purple: '#800080',
          blue: '#0000FF',
          green: '#00FF00',
          orange: '#FFA500',
          gray: '#444444'
        }
      }
    },
  },
  plugins: [],
}
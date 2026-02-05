/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          green: '#25D366',
          darkgreen: '#128C7E',
          lightgreen: '#DCF8C6',
          blue: '#34B7F1',
          gray: '#ECE5DD',
          darkgray: '#111B21'
        }
      }
    },
  },
  plugins: [],
}

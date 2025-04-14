/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          orange: '#FFA07A',
        },
        background: {
          cream: '#FFF5E1',
        },
        accent: {
          blue: '#AEDFF7',
          green: '#C5E1A5',
        },
      },
    },
  },
  plugins: [],
} 
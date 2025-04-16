/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background-cream': '#FFF5E1',
        'primary-orange': '#FFA07A',
        'accent-blue': '#AEDFF7',
        'accent-green': '#C5E1A5',
      },
    },
  },
  plugins: [],
} 
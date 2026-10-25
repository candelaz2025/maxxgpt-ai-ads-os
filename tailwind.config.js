/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#07090d',
          900: '#0c0f17',
          850: '#111520',
          800: '#171c2b',
          700: '#232a3f',
          600: '#343e5c',
        },
        gold: {
          100: '#fcf8ec',
          200: '#f7eece',
          300: '#f0de9d',
          400: '#e5c765',
          500: '#d4af37', // signature champagne gold
          600: '#b89228',
          700: '#92701d',
        },
        accent: {
          teal: '#14b8a6',
          cyan: '#06b6d4',
          rose: '#f43f5e',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Prompt', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

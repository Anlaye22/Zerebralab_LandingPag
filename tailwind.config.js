/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./public/**/*.html",
    "./assets/**/*.{html,js,ts,jsx,tsx}",
  ],
  safelist: ['hidden', 'block', 'active'],
  theme: { extend: {
        fontFamily: {
        galyon: ['Galyon', 'sans-serif'],
      },
    } 
  },
  plugins: [],
}

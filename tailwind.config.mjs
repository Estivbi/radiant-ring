/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { 950: '#09090b', 900: '#101013', 800: '#17171c', 700: '#222229', 600: '#34343d' },
        bone: { DEFAULT: '#ece6da', dim: '#b5ae9f', mute: '#7d7869' },
        blood: { DEFAULT: '#b3262d', bright: '#d8363f', deep: '#5e1216' },
        brass: '#c9a45c',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

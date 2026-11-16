/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Colores definidos como variables CSS (global.css) para poder cambiar de tema.
        ink: { 950: 'rgb(var(--ink-950) / <alpha-value>)', 900: 'rgb(var(--ink-900) / <alpha-value>)', 800: 'rgb(var(--ink-800) / <alpha-value>)', 700: 'rgb(var(--ink-700) / <alpha-value>)', 600: 'rgb(var(--ink-600) / <alpha-value>)' },
        bone: { DEFAULT: 'rgb(var(--bone) / <alpha-value>)', dim: 'rgb(var(--bone-dim) / <alpha-value>)', mute: 'rgb(var(--bone-mute) / <alpha-value>)' },
        blood: { DEFAULT: 'rgb(var(--blood) / <alpha-value>)', bright: 'rgb(var(--blood-bright) / <alpha-value>)', deep: 'rgb(var(--blood-deep) / <alpha-value>)' },
        brass: 'rgb(var(--brass) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

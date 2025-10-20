/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'blue-200': '#90cdf4',
        'green-400': '#4fd1c5',
        'green-500': '#38b2ac',
        'green-600': '#319795',
        'purple-500': '#9f7aea',
        'purple-600': '#805ad5',
        'pink-500': '#ed64a6',
        'pink-600': '#d53f8c',
        'teal-500': '#38b2ac',
        'teal-700': '#2c7a7b',
      },
    },
  },
  plugins: [],
}
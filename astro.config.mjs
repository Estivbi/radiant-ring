// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// Sitio estático + funciones serverless solo para /api/* (prerender = false).
export default defineConfig({
  site: 'https://www.custodiojoseperez.com',
  adapter: vercel({ webAnalytics: { enabled: false } }),
  integrations: [tailwind(), react()],
  security: { checkOrigin: true },
});

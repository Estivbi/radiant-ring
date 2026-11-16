import type { APIRoute } from 'astro';
export const prerender = false;
// Destino de las reglas de vercel.json que rechazan bots de IA / scrapers.
export const ALL: APIRoute = () => new Response('Forbidden', { status: 403, headers: { 'cache-control': 'no-store' } });

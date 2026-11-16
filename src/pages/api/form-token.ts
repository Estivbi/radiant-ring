import type { APIRoute } from 'astro';
import { issueFormToken, rateLimit, clientIp } from '../../lib/security';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const rl = await rateLimit(`tok:${clientIp(request)}`, 30, 600);
  if (!rl.ok) return new Response(null, { status: 429 });
  return new Response(JSON.stringify({ t: issueFormToken() }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
};

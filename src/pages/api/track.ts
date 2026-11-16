import type { APIRoute } from 'astro';
import { rateLimit, clientIp, env } from '../../lib/security';
import { normalizeEvent, incr } from '../../lib/metrics';

export const prerender = false;
const ok = () => new Response(null, { status: 204 });

export const POST: APIRoute = async ({ request }) => {
  // Origen propio (evita que terceros inflen las cifras desde otros sitios)
  try {
    const host = new URL(request.headers.get('origin') || '').hostname;
    const allowed = ['www.custodiojoseperez.com', 'custodiojoseperez.com', 'localhost', '127.0.0.1'];
    if (!allowed.includes(host) && !host.endsWith('.vercel.app') && host !== env('VERCEL_URL')) return new Response(null, { status: 403 });
  } catch { return new Response(null, { status: 403 }); }

  // Máx. 60 eventos / 10 min por IP: una persona real no llega ni de lejos
  const rl = await rateLimit(`trk:${clientIp(request)}`, 60, 600);
  if (!rl.ok) return ok();

  let ev: string | null = null;
  try { ev = normalizeEvent((await request.json())?.e); } catch { /* ignorar */ }
  if (ev) await incr(ev);
  return ok();
};

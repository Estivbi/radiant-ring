import type { APIRoute } from 'astro';
import { incr } from '../../lib/metrics';
import { checkFormToken, rateLimit, clientIp, verifyTurnstile, clean, isEmail, spamScore, esc, env } from '../../lib/security';

export const prerender = false;

const json = (body: object, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...extra },
  });

const ALLOWED_HOSTS = ['www.custodiojoseperez.com', 'custodiojoseperez.com', 'localhost', '127.0.0.1'];
const MAX_BODY = 8 * 1024;

export const POST: APIRoute = async ({ request }) => {
  const ip = clientIp(request);

  // 1. Origen: solo desde nuestras propias páginas (anti-CSRF y anti-scripts externos).
  const origin = request.headers.get('origin');
  try {
    const host = origin ? new URL(origin).hostname : '';
    const okHost = ALLOWED_HOSTS.includes(host) || (env('VERCEL_URL') && host === env('VERCEL_URL')) || host.endsWith('.vercel.app');
    if (!origin || !okHost) return json({ ok: false, error: 'forbidden' }, 403);
  } catch { return json({ ok: false, error: 'forbidden' }, 403); }

  // 2. Solo JSON y con tamaño acotado.
  if (!(request.headers.get('content-type') || '').startsWith('application/json')) return json({ ok: false, error: 'bad_request' }, 415);
  if (Number(request.headers.get('content-length') || 0) > MAX_BODY) return json({ ok: false, error: 'too_large' }, 413);

  // 3. Rate limit: por IP (8 / 10 min) y global (60 / hora) contra ataques distribuidos.
  const [a, g] = await Promise.all([rateLimit(`c:${ip}`, 8, 600), rateLimit('c:global', 60, 3600)]);
  if (!a.ok || !g.ok) return json({ ok: false, error: 'rate_limited' }, 429, { 'retry-after': String(a.retryAfter) });

  let raw: any;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY) return json({ ok: false, error: 'too_large' }, 413);
    raw = JSON.parse(text);
  } catch { return json({ ok: false, error: 'bad_request' }, 400); }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return json({ ok: false, error: 'bad_request' }, 400);

  // 4. Honeypot: los bots rellenan campos ocultos. Respondemos "ok" para no darles pistas.
  if (typeof raw.website === 'string' && raw.website !== '') return json({ ok: true });

  // 5. Token firmado: el formulario debe haberse cargado al menos 3 s antes.
  const tk = checkFormToken(raw.t);
  if (!tk.ok) return json({ ok: false, error: tk.reason === 'too_fast' ? 'too_fast' : 'token' }, 400);

  // 6. CAPTCHA Turnstile.
  if (!(await verifyTurnstile(raw.cf, ip))) return json({ ok: false, error: 'captcha' }, 400);

  // 7. Validación y saneado estrictos.
  const name = clean(raw.name, 80);
  const email = clean(raw.email, 254).toLowerCase();
  const topic = ['lectores', 'prensa', 'compra', 'otro'].includes(raw.topic) ? raw.topic : 'otro';
  const message = clean(raw.message, 3000);
  if (name.length < 2 || !isEmail(email) || message.length < 10 || raw.consent !== true)
    return json({ ok: false, error: 'invalid' }, 422);

  // 8. Heurística de spam / inyección de prompts. Se descarta en silencio.
  if (spamScore(name, message) >= 3) return json({ ok: true });

  // 9. Envío (Resend). Contenido escapado: el mensaje nunca se interpreta como HTML.
  const key = env('RESEND_API_KEY'), to = env('CONTACT_TO');
  if (!key || !to) {
    if (import.meta.env.PROD) return json({ ok: false, error: 'server' }, 500);
    console.log('[contact:dev]', { name, email, topic, message });
    return json({ ok: true });
  }
  const labels: Record<string, string> = { lectores: 'Mensaje de lector', prensa: 'Prensa / eventos', compra: 'Compra directa', otro: 'Otro' };
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env('CONTACT_FROM') || 'Web Custodio <onboarding@resend.dev>',
        to: [to],
        reply_to: email,
        subject: `[Web] ${labels[topic]} — ${name.replace(/[\r\n]/g, ' ')}`,
        html: `<p><b>${esc(name)}</b> &lt;${esc(email)}&gt;<br>Tema: ${labels[topic]}</p><pre style="white-space:pre-wrap;font:inherit">${esc(message)}</pre>`,
        text: `${name} <${email}>\nTema: ${labels[topic]}\n\n${message}`,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) { console.error('resend', r.status, await r.text()); return json({ ok: false, error: 'server' }, 502); }
  } catch (e) { console.error('resend', e); return json({ ok: false, error: 'server' }, 502); }

  await incr('contact_sent');
  return json({ ok: true });
};

// Cualquier otro método: 405.
export const ALL: APIRoute = () => new Response(null, { status: 405, headers: { allow: 'POST' } });

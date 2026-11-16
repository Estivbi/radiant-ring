// Utilidades anti-abuso para el formulario de contacto (sin dependencias).
import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto';

const env = (k: string): string | undefined => (import.meta.env as any)[k] ?? process.env[k];

/** Secreto para firmar los tokens de formulario. Obligatorio en producción. */
function secret(): string {
  const s = env('FORM_SECRET');
  if (!s) {
    if (import.meta.env.PROD) throw new Error('FORM_SECRET no configurado');
    return 'dev-only-secret';
  }
  return s;
}

const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('hex');

/** Token = timestamp.nonce.firma. Demuestra que el formulario se cargó hace X segundos. */
export function issueFormToken(): string {
  const payload = `${Date.now()}.${randomBytes(8).toString('hex')}`;
  return `${payload}.${sign(payload)}`;
}

export function checkFormToken(token: unknown, minAgeMs = 3000, maxAgeMs = 2 * 60 * 60 * 1000) {
  if (typeof token !== 'string') return { ok: false, reason: 'token' } as const;
  const parts = token.split('.');
  if (parts.length !== 3) return { ok: false, reason: 'token' } as const;
  const [ts, nonce, sig] = parts;
  const expected = sign(`${ts}.${nonce}`);
  const a = Buffer.from(sig), b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return { ok: false, reason: 'token' } as const;
  const age = Date.now() - Number(ts);
  if (!Number.isFinite(age) || age < minAgeMs) return { ok: false, reason: 'too_fast' } as const;
  if (age > maxAgeMs) return { ok: false, reason: 'expired' } as const;
  return { ok: true } as const;
}

// ---------- Rate limiting ----------
// Producción: Upstash Redis por REST (UPSTASH_REDIS_REST_URL/TOKEN; Marketplace de Vercel).
// Sin Redis: memoria por instancia (mejor que nada, no es global).
const mem = new Map<string, { n: number; reset: number }>();

export async function rateLimit(key: string, limit: number, windowSec: number) {
  const url = env('UPSTASH_REDIS_REST_URL') ?? env('KV_REST_API_URL');
  const token = env('UPSTASH_REDIS_REST_TOKEN') ?? env('KV_REST_API_TOKEN');
  if (url && token) {
    try {
      const k = `rl:${key}`;
      const r = await fetch(`${url}/pipeline`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify([['INCR', k], ['EXPIRE', k, String(windowSec), 'NX']]),
        signal: AbortSignal.timeout(2500),
      });
      const data = await r.json();
      const n = Number(data?.[0]?.result);
      if (Number.isFinite(n)) return { ok: n <= limit, retryAfter: windowSec };
    } catch { /* cae a memoria */ }
  }
  const now = Date.now();
  const e = mem.get(key);
  if (!e || e.reset < now) {
    mem.set(key, { n: 1, reset: now + windowSec * 1000 });
    if (mem.size > 5000) for (const [k, v] of mem) if (v.reset < now) mem.delete(k);
    return { ok: true, retryAfter: windowSec };
  }
  e.n++;
  return { ok: e.n <= limit, retryAfter: Math.ceil((e.reset - now) / 1000) };
}

export function clientIp(request: Request): string {
  const h = request.headers;
  return (h.get('x-vercel-forwarded-for') || h.get('x-real-ip') || h.get('x-forwarded-for')?.split(',')[0] || 'unknown').trim();
}

// ---------- Turnstile (Cloudflare) ----------
export async function verifyTurnstile(token: unknown, ip: string) {
  const sec = env('TURNSTILE_SECRET_KEY');
  if (!sec) return import.meta.env.PROD ? false : true; // en producción es obligatorio
  if (typeof token !== 'string' || !token || token.length > 2048) return false;
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret: sec, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(4000),
    });
    return Boolean((await r.json())?.success);
  } catch { return false; }
}

// ---------- Validación y heurísticas ----------
const CTRL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​-‏‪-‮⁦-⁩]/g;
export const clean = (s: unknown, max: number) =>
  (typeof s === 'string' ? s : '').replace(CTRL, '').normalize('NFC').trim().slice(0, max);

export const isEmail = (s: string) => /^[^\s@<>()",;:\\]+@[^\s@<>()",;:\\]+\.[a-z]{2,}$/i.test(s) && s.length <= 254;

export function spamScore(name: string, message: string): number {
  let s = 0;
  const links = (message.match(/https?:\/\/|www\./gi) || []).length;
  if (links > 2) s += 2;
  if (links > 0) s += 1;
  if (/\b(viagra|casino|crypto|bitcoin|seo|backlinks?|forex|loan|escort|porn|telegram|whatsapp me)\b/i.test(message)) s += 3;
  if (/(ignore (all|any|previous)|system prompt|as an ai|you are (now )?chatgpt|<\/?(script|iframe)|assistant:|\[INST\])/i.test(name + ' ' + message)) s += 3; // prompt-injection / XSS
  if (/(.)\1{9,}/.test(message)) s += 1;
  if (message.length < 10) s += 1;
  return s;
}

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

export { env };

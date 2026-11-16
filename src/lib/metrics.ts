// Contadores anónimos (sin cookies, sin IP, sin datos personales) en Upstash Redis.
// Un hash por día: m:AAAA-MM-DD  →  { evento: nº }
import { env } from './security';

export const EVENTS = new Set([
  'visit', 'amazon_click', 'instagram_click', 'press_click', 'direct_buy_click', 'contact_sent',
]);
const BOOKS = new Set(['granada-oscura', 'mitos-y-leyendas', 'triangulo-del-sur', 'andalucia-negra', 'unas-navidades-diferentes']);

const conf = () => {
  const url = env('UPSTASH_REDIS_REST_URL') ?? env('KV_REST_API_URL');
  const token = env('UPSTASH_REDIS_REST_TOKEN') ?? env('KV_REST_API_TOKEN');
  return url && token ? { url, token } : null;
};
const day = (d = new Date()) => d.toISOString().slice(0, 10);

/** Valida y normaliza el nombre del evento ("amazon_click:granada-oscura"); null si no es válido. */
export function normalizeEvent(ev: unknown): string | null {
  if (typeof ev !== 'string' || ev.length > 60) return null;
  const [name, arg] = ev.split(':');
  if (!EVENTS.has(name)) return null;
  if (arg === undefined) return name;
  if ((name === 'amazon_click' || name === 'direct_buy_click') && BOOKS.has(arg)) return ev;
  if (name === 'press_click' && /^[0-9]$/.test(arg)) return ev;
  return null;
}

export async function incr(event: string) {
  const c = conf();
  if (!c) return; // sin Redis no se guarda nada
  const k = `m:${day()}`;
  const cmds: string[][] = [['HINCRBY', k, event, '1'], ['EXPIRE', k, String(400 * 86400)]];
  if (event.includes(':')) cmds.unshift(['HINCRBY', k, event.split(':')[0], '1']); // total del grupo
  try {
    await fetch(`${c.url}/pipeline`, {
      method: 'POST', headers: { Authorization: `Bearer ${c.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(cmds), signal: AbortSignal.timeout(2500),
    });
  } catch { /* las métricas nunca deben romper la web */ }
}

export const metricsEnabled = () => conf() !== null;

/** Últimos `days` días, del más antiguo al más reciente. */
export async function readDays(days = 30): Promise<{ date: string; data: Record<string, number> }[]> {
  const c = conf();
  if (!c) return [];
  const dates = Array.from({ length: days }, (_, i) => day(new Date(Date.now() - (days - 1 - i) * 86400000)));
  const r = await fetch(`${c.url}/pipeline`, {
    method: 'POST', headers: { Authorization: `Bearer ${c.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(dates.map((d) => ['HGETALL', `m:${d}`])), signal: AbortSignal.timeout(5000),
  });
  const out = await r.json();
  return dates.map((date, i) => {
    const arr: string[] = out?.[i]?.result ?? [];
    const data: Record<string, number> = {};
    for (let j = 0; j < arr.length; j += 2) data[arr[j]] = Number(arr[j + 1]);
    return { date, data };
  });
}

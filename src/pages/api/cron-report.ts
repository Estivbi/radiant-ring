import type { APIRoute } from 'astro';
import { timingSafeEqual, createHash } from 'node:crypto';
import { env, esc } from '../../lib/security';
import { readDates, monthDates, metricsEnabled } from '../../lib/metrics';
import { sendMail } from '../../lib/mail';
import { books } from '../../data/books';

export const prerender = false;

const sha = (s: string) => createHash('sha256').update(s).digest();
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

type Totals = Record<string, number>;
const total = (days: { data: Record<string, number> }[]): Totals => {
  const t: Totals = {};
  for (const d of days) for (const [k, v] of Object.entries(d.data)) t[k] = (t[k] ?? 0) + v;
  return t;
};
const delta = (a = 0, b = 0) => (b === 0 ? (a > 0 ? 'nuevo' : '—') : `${a >= b ? '+' : ''}${Math.round(((a - b) / b) * 100)}% vs. mes anterior`);

// Lo llama Vercel Cron el día 1 de cada mes (vercel.json). Vercel envía "Authorization: Bearer CRON_SECRET".
export const GET: APIRoute = async ({ request }) => {
  const secret = env('CRON_SECRET');
  const given = (request.headers.get('authorization') || '').replace(/^Bearer /, '');
  if (!secret || !given || !timingSafeEqual(sha(given), sha(secret))) return new Response('Unauthorized', { status: 401 });
  if (!metricsEnabled()) return new Response('Métricas no configuradas', { status: 500 });
  const to = env('REPORT_TO') || env('CONTACT_TO');
  if (!to) return new Response('Falta REPORT_TO', { status: 500 });

  // Mes anterior completo y el anterior a ese, para comparar.
  const now = new Date();
  const y = now.getUTCMonth() === 0 ? now.getUTCFullYear() - 1 : now.getUTCFullYear();
  const m = (now.getUTCMonth() + 11) % 12;
  const [py, pm] = m === 0 ? [y - 1, 11] : [y, m - 1];
  const cur = total(await readDates(monthDates(y, m)));
  const prev = total(await readDates(monthDates(py, pm)));

  const rows: [string, string, number, number][] = [
    ['visit', 'Visitas (sesiones)', cur.visit ?? 0, prev.visit ?? 0],
    ['amazon_click', 'Clics hacia Amazon', cur.amazon_click ?? 0, prev.amazon_click ?? 0],
    ['contact_sent', 'Mensajes recibidos por el formulario', cur.contact_sent ?? 0, prev.contact_sent ?? 0],
    ['direct_buy_click', 'Pedidos de ejemplar firmado', cur.direct_buy_click ?? 0, prev.direct_buy_click ?? 0],
    ['instagram_click', 'Clics a Instagram', cur.instagram_click ?? 0, prev.instagram_click ?? 0],
    ['press_click', 'Clics a las entrevistas de RTVE', cur.press_click ?? 0, prev.press_click ?? 0],
  ];
  const perBook = books.map((b) => [b.short, cur[`amazon_click:${b.id}`] ?? 0] as const).sort((a, b) => b[1] - a[1]);
  const rate = cur.visit ? ((((cur.amazon_click ?? 0) / cur.visit) * 100).toFixed(1)).replace('.', ',') : '0';
  const mes = `${MESES[m]} de ${y}`;
  const site = 'https://www.custodiojoseperez.com';

  const html = `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:auto;color:#1c1814">
<h2 style="margin:0 0 4px">Informe de la web — ${esc(mes)}</h2>
<p style="color:#666;margin:0 0 20px">Resumen mensual de custodiojoseperez.com</p>
<table style="width:100%;border-collapse:collapse">${rows.map(([, l, a, b]) =>
  `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${esc(l)}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right"><b style="font-size:18px">${a}</b><br><span style="color:#888;font-size:12px">${esc(delta(a, b))}</span></td></tr>`).join('')}</table>
<p style="margin:20px 0 6px"><b>De cada 100 visitas, ${esc(rate)} pasaron a Amazon.</b></p>
<h3 style="margin:20px 0 6px">Clics a Amazon por libro</h3>
<ul style="padding-left:18px;margin:0">${perBook.map(([t, n]) => `<li>${esc(t)}: <b>${n}</b></li>`).join('')}</ul>
<p style="color:#666;font-size:13px;margin-top:24px">Un clic a Amazon es alguien que ha ido a comprar; la compra en sí solo se ve en vuestro panel de KDP. Compara estas cifras con las ventas de ${esc(MESES[m])}.</p>
<p style="font-size:13px">Más detalle (visitas por día, países, páginas): <a href="https://vercel.com/dashboard">panel de Vercel → Analytics</a> y Google Search Console.</p>
<p style="color:#999;font-size:12px">Datos anónimos, sin cookies. <a href="${site}">${site}</a></p></div>`;
  const text = `Informe de la web — ${mes}\n\n${rows.map(([, l, a, b]) => `${l}: ${a} (${delta(a, b)})`).join('\n')}\n\nDe cada 100 visitas, ${rate} pasaron a Amazon.\n\nClics a Amazon por libro:\n${perBook.map(([t, n]) => `- ${t}: ${n}`).join('\n')}\n\nLa compra final solo se ve en el panel de KDP.`;

  const ok = await sendMail({ to, subject: `Informe mensual de la web — ${mes}`, html, text });
  return new Response(ok ? 'Informe enviado' : 'Error al enviar', { status: ok ? 200 : 502 });
};

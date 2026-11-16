# custodiojoseperez.com

Web del escritor Custodio José Pérez Pérez. Astro 5 + Tailwind + una isla React (formulario) y funciones serverless en Vercel solo para `/api/*`.

## Comandos
`npm install` · `npm run dev` (localhost:4321) · `npm run build`

## Tema claro / oscuro
Por defecto sigue al sistema (`prefers-color-scheme`); el botón de la barra alterna y recuerda la elección en `localStorage`. Los colores son variables CSS en `src/styles/global.css` (`:root` oscuro, `:root[data-theme='light']` claro).

## Métricas
- **Visitas y páginas:** Vercel Analytics (sin cookies), en el panel de Vercel → Analytics.
- **Clics (Amazon por libro, Instagram, entrevistas, pedidos de ejemplar firmado, mensajes enviados):** contadores anónimos propios en Upstash Redis (`/api/track`), solo eventos de una lista cerrada, con comprobación de origen y límite por IP.
- **No hay panel público**: las cifras solo se ven en el informe mensual por correo (ver abajo).
- Las **compras reales** ocurren en Amazon y la web no las ve: se contrastan los clics con el panel de KDP.

## Correo (formulario e informe)
`src/lib/mail.ts` envía por **SMTP** (Gmail, Outlook, tu hosting…) con `SMTP_*`; Resend solo si no hay SMTP. Cada mensaje del formulario llega al buzón de `CONTACT_TO` con `Reply-To` = la persona que escribió, así que «Responder» contesta directo.

## Informe mensual
`vercel.json` programa `GET /api/cron-report` el día 1 de cada mes (07:17 UTC). Está protegido con `CRON_SECRET` (Vercel envía `Authorization: Bearer`) y manda **solo a `REPORT_TO`** (obligatorio, sin valor por defecto) el resumen del mes anterior con la comparación respecto al anterior. La persona que lo recibe lo revisa y lo reenvía a Custodio. Para generarlo a demanda: `curl -A "Mozilla/5.0" -H "Authorization: Bearer $CRON_SECRET" https://www.custodiojoseperez.com/api/cron-report` (envía el correo a `REPORT_TO`).

## Google Search Console
Verifica el dominio en https://search.google.com/search-console (recomendado: registro DNS TXT; alternativa: pon el código de la metaetiqueta en `PUBLIC_GSC_VERIFICATION`) y envía `https://www.custodiojoseperez.com/sitemap.xml`.

## Actualizar libros, enlaces y precios
Todo vive en `src/data/books.ts`. Por libro: `asin` (el enlace limpio `amazon.es/dp/ASIN` se genera solo), `price` (número en € o `null` para mostrar «Ver precio en Amazon») y `priceCheckedAt`.

## Formulario y protección anti-abuso
`POST /api/contact` aplica, en orden: comprobación de Origin → solo JSON ≤ 8 KB → rate limit por IP (8/10 min) y global (60/h) → honeypot → token HMAC firmado con tiempo mínimo de 3 s → Cloudflare Turnstile → validación/saneado estricto → heurística de spam y de inyección de prompts → envío por Resend con contenido escapado.
Variables en `.env.example`. En producción `FORM_SECRET` y Turnstile son obligatorios (si faltan, el formulario rechaza).

## Bots, IA y scrapers
- `public/robots.txt` y `public/ai.txt`: prohíben GPTBot, ClaudeBot, CCBot, Google-Extended, PerplexityBot, etc.
- `vercel.json`: devuelve 403 a esos user-agents y a clientes de scraping genéricos; cabeceras de seguridad (HSTS, CSP, X-Frame-Options…) y `X-Robots-Tag: noai, noimageai`.
- Recomendado además: en Vercel → Firewall activar **Bot Protection** y **AI Bots** (Managed Rulesets) y una regla de rate limit para `/api/*`.

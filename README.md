# custodiojoseperez.com

Web del escritor Custodio José Pérez Pérez. Astro 5 + Tailwind + una isla React (formulario) y funciones serverless en Vercel solo para `/api/*`.

## Comandos
`npm install` · `npm run dev` (localhost:4321) · `npm run build`

## Tema claro / oscuro
Por defecto sigue al sistema (`prefers-color-scheme`); el botón de la barra alterna y recuerda la elección en `localStorage`. Los colores son variables CSS en `src/styles/global.css` (`:root` oscuro, `:root[data-theme='light']` claro).

## Métricas
- **Visitas y páginas:** Vercel Analytics (sin cookies), en el panel de Vercel → Analytics.
- **Clics (Amazon por libro, Instagram, entrevistas, pedidos de ejemplar firmado, mensajes enviados):** contadores anónimos propios en Upstash Redis (`/api/track`), solo eventos de una lista cerrada, con comprobación de origen y límite por IP.
- **Panel para Custodio:** `/estadisticas?key=STATS_KEY` (variable de entorno `STATS_KEY`; página `noindex`, sin caché y con límite de intentos).
- Las **compras reales** ocurren en Amazon y la web no las ve: se contrastan los clics con el panel de KDP.

## Actualizar libros, enlaces y precios
Todo vive en `src/data/books.ts`. Por libro: `asin` (el enlace limpio `amazon.es/dp/ASIN` se genera solo), `price` (número en € o `null` para mostrar «Ver precio en Amazon») y `priceCheckedAt`.

## Formulario y protección anti-abuso
`POST /api/contact` aplica, en orden: comprobación de Origin → solo JSON ≤ 8 KB → rate limit por IP (8/10 min) y global (60/h) → honeypot → token HMAC firmado con tiempo mínimo de 3 s → Cloudflare Turnstile → validación/saneado estricto → heurística de spam y de inyección de prompts → envío por Resend con contenido escapado.
Variables en `.env.example`. En producción `FORM_SECRET` y Turnstile son obligatorios (si faltan, el formulario rechaza).

## Bots, IA y scrapers
- `public/robots.txt` y `public/ai.txt`: prohíben GPTBot, ClaudeBot, CCBot, Google-Extended, PerplexityBot, etc.
- `vercel.json`: devuelve 403 a esos user-agents y a clientes de scraping genéricos; cabeceras de seguridad (HSTS, CSP, X-Frame-Options…) y `X-Robots-Tag: noai, noimageai`.
- Recomendado además: en Vercel → Firewall activar **Bot Protection** y **AI Bots** (Managed Rulesets) y una regla de rate limit para `/api/*`.

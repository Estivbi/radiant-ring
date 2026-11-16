import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window { turnstile?: { render: (el: HTMLElement, o: object) => string; reset: (id?: string) => void }; }
}

const SITEKEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string | undefined;
type Status = 'idle' | 'sending' | 'ok' | 'error';

const ERRORS: Record<string, string> = {
  rate_limited: 'Has enviado demasiados mensajes. Inténtalo de nuevo en unos minutos.',
  too_fast: 'Has enviado el formulario demasiado rápido. Espera un momento y reinténtalo.',
  captcha: 'No hemos podido verificar que eres una persona. Recarga la verificación e inténtalo de nuevo.',
  invalid: 'Revisa los campos: nombre, email válido, mensaje (mín. 10 caracteres) y la casilla de privacidad.',
  token: 'La sesión del formulario ha caducado. Recarga la página.',
};

export default function ContactForm({ initialTopic = 'lectores', initialMessage = '' }: { initialTopic?: string; initialMessage?: string }) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [cf, setCf] = useState('');
  const [topic, setTopic] = useState(initialTopic);
  const [msg, setMsg] = useState(initialMessage);
  const tsRef = useRef<HTMLDivElement>(null);
  const widget = useRef<string>();

  // Precarga desde la URL (?tema=compra&msg=...), p. ej. desde la ficha de un libro.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const t = q.get('tema');
    if (t && ['lectores', 'compra', 'prensa', 'otro'].includes(t)) setTopic(t);
    const m = q.get('msg');
    if (m) setMsg(m.slice(0, 500));
  }, []);

  // Token firmado de carga del formulario (mide el tiempo humano real).
  useEffect(() => {
    fetch('/api/form-token').then((r) => r.json()).then((d) => setToken(d.t)).catch(() => {});
  }, []);

  // Cloudflare Turnstile (si hay clave pública configurada).
  useEffect(() => {
    if (!SITEKEY) return;
    const mount = () => {
      if (tsRef.current && window.turnstile && !widget.current)
        widget.current = window.turnstile.render(tsRef.current, { sitekey: SITEKEY, theme: 'dark', language: 'es', callback: setCf, 'expired-callback': () => setCf('') });
    };
    if (window.turnstile) return mount();
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true; s.onload = mount;
    document.head.appendChild(s);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending') return;
    const f = new FormData(e.currentTarget);
    setStatus('sending'); setError('');
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.get('name'), email: f.get('email'), topic: f.get('topic'), message: f.get('message'),
          consent: f.get('consent') === 'on', website: f.get('website'), t: token, cf,
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.ok) { setStatus('ok'); (e.target as HTMLFormElement).reset(); setMsg(''); return; }
      setError(ERRORS[d.error] ?? 'No hemos podido enviar el mensaje. Inténtalo de nuevo o escribe por Instagram.');
    } catch { setError('Error de conexión. Inténtalo de nuevo.'); }
    setStatus('error');
    window.turnstile?.reset(widget.current); setCf('');
    fetch('/api/form-token').then((r) => r.json()).then((d) => setToken(d.t)).catch(() => {});
  }

  if (status === 'ok')
    return (
      <div role="status" className="rounded-2xl border border-brass/40 bg-ink-800 p-8 text-center">
        <p className="font-display text-3xl">Mensaje enviado</p>
        <p className="mt-2 text-bone-dim">Gracias por escribir. Custodio lo leerá y te responderá en cuanto pueda.</p>
        <button className="btn btn-ghost mt-6" onClick={() => setStatus('idle')}>Enviar otro</button>
      </div>
    );

  const L = 'mb-1.5 block text-sm text-bone-dim';
  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate={false}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label className={L} htmlFor="cf-name">Nombre</label>
          <input id="cf-name" name="name" required minLength={2} maxLength={80} autoComplete="name" className="field" /></div>
        <div><label className={L} htmlFor="cf-email">Email</label>
          <input id="cf-email" name="email" type="email" required maxLength={254} autoComplete="email" className="field" /></div>
      </div>
      <div><label className={L} htmlFor="cf-topic">Motivo</label>
        <select id="cf-topic" name="topic" value={topic} onChange={(e) => setTopic(e.target.value)} className="field">
          <option value="lectores">Quiero decirle algo a Custodio</option>
          <option value="compra">Comprar un libro firmado</option>
          <option value="prensa">Prensa, entrevistas y eventos</option>
          <option value="otro">Otro</option>
        </select></div>
      <div><label className={L} htmlFor="cf-msg">Mensaje</label>
        <textarea id="cf-msg" name="message" required minLength={10} maxLength={3000} rows={6} value={msg} onChange={(e) => setMsg(e.target.value)} className="field resize-y" /></div>

      {/* Honeypot: invisible para personas, irresistible para bots */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', height: 0, overflow: 'hidden' }}>
        <label>No rellenar este campo<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <label className="flex items-start gap-3 text-sm text-bone-dim">
        <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-[#b3262d]" />
        <span>He leído la <a href="/privacidad" className="underline hover:text-bone">política de privacidad</a> y acepto que se usen mis datos para responderme.</span>
      </label>

      {SITEKEY && <div ref={tsRef} />}

      {error && <p role="alert" className="rounded-lg border border-blood/60 bg-blood-deep/40 px-4 py-3 text-sm">{error}</p>}

      <button type="submit" disabled={status === 'sending' || !token} className="btn btn-primary w-full disabled:opacity-60 sm:w-auto">
        {status === 'sending' ? 'Enviando…' : 'Enviar mensaje'}
      </button>
    </form>
  );
}

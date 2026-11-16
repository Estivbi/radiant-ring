// Envío de correo sin depender de un servicio de terceros: SMTP normal (Gmail, Outlook, el de tu hosting…).
// Si no hay SMTP configurado pero sí RESEND_API_KEY, usa Resend como alternativa.
import nodemailer from 'nodemailer';
import { env } from './security';

export interface Mail { to: string; subject: string; html: string; text: string; replyTo?: string; }

/** true = enviado (o registrado en consola en desarrollo). Nunca lanza. */
export async function sendMail(m: Mail): Promise<boolean> {
  const subject = m.subject.replace(/[\r\n]+/g, ' ').slice(0, 200); // anti inyección de cabeceras
  const host = env('SMTP_HOST'), user = env('SMTP_USER'), pass = env('SMTP_PASS');
  const from = env('MAIL_FROM') || (user ? `Web de Custodio <${user}>` : undefined);

  try {
    if (host && user && pass) {
      const port = Number(env('SMTP_PORT') || 465);
      const t = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass }, connectionTimeout: 8000, socketTimeout: 10000 });
      await t.sendMail({ from, to: m.to, replyTo: m.replyTo, subject, html: m.html, text: m.text });
      return true;
    }
    const key = env('RESEND_API_KEY');
    if (key) {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: from || 'Web Custodio <onboarding@resend.dev>', to: [m.to], reply_to: m.replyTo, subject, html: m.html, text: m.text }),
        signal: AbortSignal.timeout(8000),
      });
      if (!r.ok) console.error('resend', r.status, await r.text());
      return r.ok;
    }
  } catch (e) {
    console.error('mail', e);
    return false;
  }
  if (import.meta.env.PROD) { console.error('mail: sin SMTP_* ni RESEND_API_KEY'); return false; }
  console.log('[mail:dev]', { to: m.to, replyTo: m.replyTo, subject, text: m.text });
  return true;
}

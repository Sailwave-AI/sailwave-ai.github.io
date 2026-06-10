import type { APIRoute, APIContext } from 'astro';

// Ruta de servidor: se ejecuta en Cloudflare, no se prerenderiza.
export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Base del despliegue ('/' en Cloudflare). Se usa para las redirecciones.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

const clean = (value: unknown, max: number): string =>
  (value ?? '').toString().trim().slice(0, max);

const json = (body: unknown, status: number): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

const ok = (wantsJson: boolean, redirect: APIContext['redirect']): Response =>
  wantsJson ? json({ ok: true }, 200) : redirect(`${BASE}/?enviado=1#contacto`, 303);

const fail = (
  message: string,
  status: number,
  wantsJson: boolean,
  redirect: APIContext['redirect'],
): Response =>
  wantsJson ? json({ ok: false, error: message }, status) : redirect(`${BASE}/?error=1#contacto`, 303);

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json');
  const contentType = request.headers.get('content-type') ?? '';

  let raw: Record<string, unknown> = {};
  try {
    if (contentType.includes('application/json')) {
      raw = await request.json();
    } else {
      const form = await request.formData();
      raw = {
        nombre: form.get('nombre'),
        email: form.get('email'),
        negocio: form.get('negocio'),
        mensaje: form.get('mensaje'),
        _gotcha: form.get('_gotcha'),
      };
    }
  } catch {
    return fail('No he podido leer el formulario.', 400, wantsJson, redirect);
  }

  // Honeypot anti-spam: si el campo oculto viene relleno es un bot.
  // Fingimos éxito y no guardamos nada.
  if (clean(raw._gotcha, 200)) {
    return ok(wantsJson, redirect);
  }

  const nombre = clean(raw.nombre, 200);
  const email = clean(raw.email, 320);
  const negocio = clean(raw.negocio, 200);
  const mensaje = clean(raw.mensaje, 4000);

  if (!nombre || !email || !mensaje || !EMAIL_RE.test(email)) {
    return fail('Revisa el nombre, el email y el mensaje.', 422, wantsJson, redirect);
  }

  const db = locals.runtime?.env?.DB;
  if (!db) {
    console.error('[lead] Falta el binding D1 "DB". ¿Has configurado wrangler.jsonc?');
    return fail('El formulario no está disponible ahora mismo.', 503, wantsJson, redirect);
  }

  try {
    await db
      .prepare(
        `INSERT INTO leads (nombre, email, negocio, mensaje, fuente, user_agent, ip)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        nombre,
        email,
        negocio || null,
        mensaje,
        request.headers.get('referer'),
        request.headers.get('user-agent'),
        request.headers.get('cf-connecting-ip'),
      )
      .run();
  } catch (err) {
    console.error('[lead] Error guardando el lead:', err);
    return fail('No he podido guardar tu mensaje. Inténtalo de nuevo.', 500, wantsJson, redirect);
  }

  return ok(wantsJson, redirect);
};

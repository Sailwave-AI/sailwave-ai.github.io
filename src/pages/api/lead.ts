import type { APIRoute } from 'astro';
import { url } from '../../utils';

// Endpoint dinámico: no se prerenderiza, se ejecuta en el Worker de Cloudflare.
export const prerender = false;

const FIELDS = [
  'source',
  'nombre',
  'email',
  'negocio',
  'mensaje',
  'sector',
  'proceso',
  'horas',
  'metodo',
  'recomendacion',
] as const;

type Field = (typeof FIELDS)[number];
type LeadData = Partial<Record<Field, string>> & { _gotcha?: string };

function clean(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, 2000) : null;
}

export const POST: APIRoute = async ({ request, locals }) => {
  const contentType = request.headers.get('content-type') ?? '';
  const wantsJson =
    contentType.includes('application/json') ||
    (request.headers.get('accept') ?? '').includes('application/json');

  // Parseo del cuerpo (JSON desde el JS, form-urlencoded sin JS)
  let data: LeadData = {};
  try {
    if (contentType.includes('application/json')) {
      data = (await request.json()) as LeadData;
    } else {
      const form = await request.formData();
      data = Object.fromEntries(form) as LeadData;
    }
  } catch {
    return reply(wantsJson, 400, { ok: false, error: 'Cuerpo de la petición no válido.' });
  }

  // Honeypot anti-spam: si viene relleno, fingimos éxito y descartamos.
  if (clean(data._gotcha)) {
    return reply(wantsJson, 200, { ok: true });
  }

  const email = clean(data.email);
  if (!email || !email.includes('@')) {
    return reply(wantsJson, 400, { ok: false, error: 'Hace falta un email válido.' });
  }

  const db = locals.runtime?.env?.DB;

  if (!db) {
    // En `astro dev` no hay binding de D1; toleramos para poder probar el flujo.
    if (import.meta.env.DEV) {
      console.warn('[api/lead] Sin binding DB (dev): lead no guardado.', data);
      return reply(wantsJson, 200, { ok: true, stored: false });
    }
    return reply(wantsJson, 500, { ok: false, error: 'Almacenamiento no disponible.' });
  }

  try {
    await db
      .prepare(
        `INSERT INTO leads
           (source, nombre, email, negocio, mensaje, sector, proceso, horas, metodo, recomendacion, user_agent)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        clean(data.source) ?? 'contacto',
        clean(data.nombre),
        email,
        clean(data.negocio),
        clean(data.mensaje),
        clean(data.sector),
        clean(data.proceso),
        clean(data.horas),
        clean(data.metodo),
        clean(data.recomendacion),
        clean(request.headers.get('user-agent')),
      )
      .run();
  } catch (err) {
    console.error('[api/lead] Error al guardar el lead:', err);
    return reply(wantsJson, 500, { ok: false, error: 'No se pudo guardar el mensaje.' });
  }

  if (wantsJson) {
    return reply(true, 200, { ok: true });
  }
  // Envío sin JavaScript: redirige a la página de gracias.
  return new Response(null, {
    status: 303,
    headers: { Location: url('/gracias/') },
  });
};

function reply(json: boolean, status: number, body: Record<string, unknown>): Response {
  if (json) {
    return new Response(JSON.stringify(body), {
      status,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }
  // Fallback sin JS: éxito → /gracias/, error → vuelve al contacto.
  const location = body.ok ? url('/gracias/') : url('/#contacto');
  return new Response(null, { status: 303, headers: { Location: location } });
}

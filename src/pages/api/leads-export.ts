import type { APIRoute } from 'astro';

// Ruta de servidor protegida por token. Descarga los leads en JSON o CSV:
//   curl -H "Authorization: Bearer TU_TOKEN" https://eraldia.com/api/leads-export
//   https://eraldia.com/api/leads-export?format=csv&token=TU_TOKEN
export const prerender = false;

interface LeadRow {
  id: number;
  nombre: string;
  email: string;
  negocio: string | null;
  mensaje: string;
  fuente: string | null;
  user_agent: string | null;
  ip: string | null;
  created_at: string;
}

const csvCell = (value: unknown): string => {
  const text = (value ?? '').toString();
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export const GET: APIRoute = async ({ request, locals, url }) => {
  const env = locals.runtime?.env;
  const token = env?.LEADS_TOKEN;

  const provided =
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim() ??
    url.searchParams.get('token') ??
    '';

  if (!token || provided !== token) {
    return new Response('No autorizado', { status: 401 });
  }

  const db = env?.DB;
  if (!db) {
    return new Response('Base de datos no configurada', { status: 503 });
  }

  const { results } = await db
    .prepare('SELECT * FROM leads ORDER BY created_at DESC')
    .all<LeadRow>();

  if (url.searchParams.get('format') === 'csv') {
    const columns: (keyof LeadRow)[] = [
      'id', 'created_at', 'nombre', 'email', 'negocio', 'mensaje', 'fuente', 'user_agent', 'ip',
    ];
    const lines = [
      columns.join(','),
      ...results.map((row) => columns.map((col) => csvCell(row[col])).join(',')),
    ];
    return new Response(lines.join('\n'), {
      headers: {
        'content-type': 'text/csv; charset=utf-8',
        'content-disposition': 'attachment; filename="leads.csv"',
      },
    });
  }

  return new Response(JSON.stringify({ count: results.length, leads: results }, null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};

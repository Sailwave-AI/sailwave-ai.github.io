/// <reference path="../.astro/types.d.ts" />

// Bindings de Cloudflare disponibles en `Astro.locals.runtime.env`.
interface Env {
  // Base de datos de leads (D1). Ver wrangler.jsonc y migrations/.
  DB: import('@cloudflare/workers-types').D1Database;
  // Token para proteger la exportación de leads (/api/leads-export).
  // Configúralo con: npx wrangler secret put LEADS_TOKEN
  LEADS_TOKEN?: string;
}

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}

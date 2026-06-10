# Base de datos de leads

Los mensajes del formulario de contacto de la web se guardan en una base de
datos **Cloudflare D1** (SQLite serverless, plan gratuito). Sustituye a la
dependencia anterior de Formspree: ahora los datos son tuyos y viven junto al
worker que sirve la web.

```
 Formulario (/#contacto)
   │  POST (fetch o envío normal)
   ▼
 /api/lead  ──────────▶  D1 «eraldia-leads» · tabla leads
   │  (valida + honeypot)
   ▼
 /api/leads-export  ◀──  descarga de los leads (JSON o CSV, con token)
```

## Piezas

| Archivo | Qué hace |
|---|---|
| `migrations/0001_create_leads.sql` | Esquema de la tabla `leads`. |
| `wrangler.jsonc` → `d1_databases` | Enlaza la base con el binding `DB`. |
| `src/pages/api/lead.ts` | Recibe el formulario, valida y guarda el lead. |
| `src/pages/api/leads-export.ts` | Descarga los leads (protegido por token). |
| `src/pages/index.astro` | Formulario que envía a `/api/lead`. |

## Puesta en marcha (una sola vez)

1. **Crear la base** en tu cuenta de Cloudflare:

   ```bash
   npx wrangler d1 create eraldia-leads
   ```

   Copia el `database_id` que devuelve y pégalo en `wrangler.jsonc`
   (campo `database_id`, sustituyendo `REEMPLAZA_CON_EL_DATABASE_ID`).

2. **Aplicar la migración** (crea la tabla en la base remota):

   ```bash
   npx wrangler d1 migrations apply eraldia-leads --remote
   ```

3. **Definir el token de exportación** (para poder descargar los leads):

   ```bash
   npx wrangler secret put LEADS_TOKEN
   ```

4. **Desplegar**:

   ```bash
   npm run deploy
   ```

## Desarrollo local

La base local vive en `.wrangler/` (ignorada por git). Para probar:

```bash
npx wrangler d1 migrations apply eraldia-leads --local
npm run preview   # build + wrangler dev
```

El formulario tiene mejora progresiva: con JS envía por `fetch` y muestra el
mensaje de éxito sin recargar; sin JS hace un POST normal y el servidor
redirige a `/?enviado=1#contacto`.

> Nota: en GitHub Pages (despliegue estático) las rutas `/api/*` no se ejecutan.
> El formulario solo guarda leads en el despliegue de Cloudflare (eraldia.com).

## Consultar los leads

**Desde la terminal** (base remota):

```bash
npx wrangler d1 execute eraldia-leads --remote \
  --command="SELECT created_at, nombre, email, negocio FROM leads ORDER BY created_at DESC;"
```

**Por HTTP** (usando el `LEADS_TOKEN`):

```bash
# JSON
curl -H "Authorization: Bearer TU_TOKEN" https://eraldia.com/api/leads-export

# CSV (para abrir en una hoja de cálculo)
curl -o leads.csv "https://eraldia.com/api/leads-export?format=csv&token=TU_TOKEN"
```

## Esquema de la tabla `leads`

| Columna | Tipo | Notas |
|---|---|---|
| `id` | INTEGER | Clave primaria autoincremental. |
| `nombre` | TEXT | Obligatorio. |
| `email` | TEXT | Obligatorio, validado. |
| `negocio` | TEXT | Opcional. |
| `mensaje` | TEXT | Obligatorio. |
| `fuente` | TEXT | Referer desde donde se envió. |
| `user_agent` | TEXT | Navegador. |
| `ip` | TEXT | `cf-connecting-ip`. |
| `created_at` | TEXT | Fecha/hora UTC automática. |

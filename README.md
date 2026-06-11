# Eraldia — web

Web de **Eraldia**, consultoría de transformación digital e IA para pymes. *Pon tu pyme al día con la IA.*

Construida con [Astro](https://astro.build/), generador de sitios estáticos.

## Documentación

- [`docs/MODELO-DE-NEGOCIO.md`](docs/MODELO-DE-NEGOCIO.md) — posicionamiento, servicios, precios, embudo de captación y plan de 90 días.
- [`docs/PUBLICACION.md`](docs/PUBLICACION.md) — cómo comprar el dominio, desplegar en Cloudflare Pages, activar el correo y el formulario de leads.

## Desarrollo en local

```bash
npm install       # instalar dependencias
npm run dev       # servidor local con recarga en vivo (http://localhost:4321)
npm run build     # build de producción en ./dist
npm run preview   # previsualizar el build local
```

## Estructura

- `src/content/blog/` — artículos del blog en Markdown (front matter YAML)
- `src/content/servicios/` — páginas de servicios en Markdown (front matter YAML)
- `src/pages/` — páginas Astro (index, servicios, casos, sobre-mi, blog, tags, categorias, 404)
- `src/layouts/BaseLayout.astro` — layout base con head SEO, header, footer y script reveal
- `src/styles/` — estilos SCSS (la identidad visual vive en `src/styles/_variables.scss`)
- `public/` — recursos estáticos (imágenes: logo, favicon, og-image, hero, services, use-cases)
- `src/consts.ts` — constantes globales (título, tagline, email de contacto, LinkedIn)
- `src/pages/api/lead.ts` — endpoint que guarda los leads del formulario y del diagnóstico exprés en Cloudflare D1
- `migrations/` — esquema SQL de la base de datos D1 de leads
- `.github/workflows/` — CI/CD con Node 20 y Astro

## Captación de leads (Cloudflare D1)

El formulario de contacto y el diagnóstico exprés (`/diagnostico-express/`) envían los datos al
endpoint `POST /api/lead`, que los inserta en una base de datos [Cloudflare D1](https://developers.cloudflare.com/d1/).
Sin servicios de terceros: los leads quedan en tu propia base.

Puesta en marcha (una sola vez):

```bash
npx wrangler d1 create eraldia-leads          # copia el database_id que devuelve
# pégalo en wrangler.jsonc → d1_databases[0].database_id
npx wrangler d1 migrations apply eraldia-leads            # aplica el esquema en local
npx wrangler d1 migrations apply eraldia-leads --remote   # y en producción
```

Para consultar los leads guardados:

```bash
npx wrangler d1 execute eraldia-leads --remote --command "SELECT * FROM leads ORDER BY created_at DESC LIMIT 20"
```

## Configuración pendiente (TODOs)

En `src/consts.ts`:
- `CONTACT_EMAIL` — cambiar a `hola@eraldia.com` cuando el correo del dominio esté activo.
- `LINKEDIN_URL` — URL del perfil de LinkedIn para el footer.

En `wrangler.jsonc`:
- `d1_databases[0].database_id` — pegar el ID real de la base D1 (ver sección anterior).

## Despliegue

Mientras no haya dominio propio: GitHub Actions despliega a GitHub Pages en cada push a `main`, en **https://sailwave-ai.github.io/eraldia-web/** (subcarpeta, porque el repo se llama `eraldia-web`). El workflow define `ASTRO_SITE` y `ASTRO_BASE` para que enlaces y assets funcionen en esa subcarpeta; en local y en producción la base es `/`.

El plan de producción es Cloudflare Pages con el dominio `eraldia.com` — pasos en [`docs/PUBLICACION.md`](docs/PUBLICACION.md).

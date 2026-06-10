# Eraldia — web

Web de **Eraldia**, consultoría de transformación digital e IA para pymes. *Pon tu pyme al día con la IA.*

Construida con [Zola](https://www.getzola.org/), generador de sitios estáticos en Rust.

## Documentación

- [`docs/MODELO-DE-NEGOCIO.md`](docs/MODELO-DE-NEGOCIO.md) — posicionamiento, servicios, precios, embudo de captación y plan de 90 días.
- [`docs/PUBLICACION.md`](docs/PUBLICACION.md) — cómo comprar el dominio, desplegar en Cloudflare Pages, activar el correo y el formulario de leads.

## Desarrollo en local

```bash
# Instalar Zola (https://www.getzola.org/documentation/getting-started/installation/)
brew install zola  # macOS
# o descarga el binario: https://github.com/getzola/zola/releases

zola serve   # servidor local con recarga en vivo
zola build   # build de producción en ./public
zola check   # comprobar enlaces rotos
```

## Estructura

- `content/` — contenido en Markdown (portada, servicios, casos, sobre mí, blog)
- `templates/` — plantillas Tera
- `sass/` — estilos SCSS (los compila Zola); la identidad visual vive en `sass/_variables.scss`
- `static/` — recursos estáticos (logo, favicon, imágenes)
- `.github/workflows/` — CI/CD

## Configuración pendiente (TODOs)

En `config.toml`:
- `formspree_id` — ID del formulario de Formspree para activar la captación de leads.
- `contact_email` — cambiar a `hola@eraldia.com` cuando el correo del dominio esté activo.
- `linkedin_url` — URL del perfil de LinkedIn para el footer.

## Despliegue

Mientras no haya dominio propio: GitHub Actions despliega a GitHub Pages en cada push a `main` (el workflow fuerza `--base-url`). El plan de producción es Cloudflare Pages con el dominio `eraldia.com` — pasos en [`docs/PUBLICACION.md`](docs/PUBLICACION.md).

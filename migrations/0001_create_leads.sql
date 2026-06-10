-- Tabla de leads capturados desde el formulario de contacto de la web.
-- Aplícala con:  npx wrangler d1 migrations apply eraldia-leads --remote
-- (o sin --remote para la base local de desarrollo).

CREATE TABLE IF NOT EXISTS leads (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre      TEXT    NOT NULL,
  email       TEXT    NOT NULL,
  negocio     TEXT,
  mensaje     TEXT    NOT NULL,
  fuente      TEXT,                 -- página/referer desde donde se envió
  user_agent  TEXT,
  ip          TEXT,                 -- cf-connecting-ip
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at);
CREATE INDEX IF NOT EXISTS idx_leads_email      ON leads (email);

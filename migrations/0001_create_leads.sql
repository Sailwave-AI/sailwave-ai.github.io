-- Tabla de leads de Eraldia.
-- Recoge tanto los envíos del formulario de contacto como los del
-- diagnóstico exprés. Los campos del diagnóstico quedan NULL en los
-- envíos de contacto y viceversa.

CREATE TABLE IF NOT EXISTS leads (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  source        TEXT NOT NULL,            -- 'contacto' | 'diagnostico'
  nombre        TEXT,
  email         TEXT,
  negocio       TEXT,                     -- contacto: a qué se dedica
  mensaje       TEXT,                     -- contacto: qué le quita tiempo
  sector        TEXT,                     -- diagnóstico
  proceso       TEXT,                     -- diagnóstico
  horas         TEXT,                     -- diagnóstico
  metodo        TEXT,                     -- diagnóstico
  recomendacion TEXT,                     -- diagnóstico
  user_agent    TEXT
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads (source);

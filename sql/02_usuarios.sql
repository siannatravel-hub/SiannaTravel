-- ============================================================
--  SIANNA TRAVEL — Usuarios/roles de Postgres (patrón Wolf Daniels)
--  Ejecutar como usuario "postgres", CONECTADO a la base "sianna".
--
--  ⚠️ Cambia las 3 contraseñas antes de ejecutar (busca __CAMBIA_*).
--     Usa contraseñas fuertes y guárdalas en el gestor, no aquí.
--
--  3 usuarios con privilegio mínimo:
--    · sianna_n8n      → el bot (lee catálogo/faq/links, escribe solicitudes)
--    · sianna_app      → backend del admin (CRUD completo de lo editable)
--    · sianna_readonly → sitio público en Vercel (solo lectura)
-- ============================================================

-- ---------- Crear roles (login) ----------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'sianna_n8n') THEN
    CREATE ROLE sianna_n8n      LOGIN PASSWORD 'SiannaTravel123@';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'sianna_app') THEN
    CREATE ROLE sianna_app      LOGIN PASSWORD 'SiannaTravel123@';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'sianna_readonly') THEN
    CREATE ROLE sianna_readonly LOGIN PASSWORD 'SiannaTravel123@';
  END IF;
END $$;

-- ---------- Acceso al esquema ----------
GRANT CONNECT ON DATABASE sianna TO sianna_n8n, sianna_app, sianna_readonly;
GRANT USAGE ON SCHEMA public TO sianna_n8n, sianna_app, sianna_readonly;

-- ============================================================
--  sianna_readonly  (sitio público: solo SELECT)
-- ============================================================
GRANT SELECT ON packages, featured_packages, blog_posts, faq, links TO sianna_readonly;

-- ============================================================
--  sianna_n8n  (el bot)
--    lee catálogo/faq/links ; lee y escribe solicitudes
-- ============================================================
GRANT SELECT ON packages, faq, links TO sianna_n8n;
GRANT SELECT, INSERT, UPDATE ON solicitudes TO sianna_n8n;
GRANT USAGE, SELECT ON SEQUENCE solicitudes_id_seq TO sianna_n8n;

-- ============================================================
--  sianna_app  (backend del admin: CRUD completo de lo editable)
-- ============================================================
GRANT SELECT, INSERT, UPDATE, DELETE
  ON packages, package_history, featured_packages, blog_posts, faq, solicitudes, links
  TO sianna_app;
-- secuencias (para INSERT con id autogenerado)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO sianna_app;

-- ---------- Que los permisos apliquen también a tablas futuras ----------
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO sianna_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO sianna_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO sianna_app, sianna_n8n;

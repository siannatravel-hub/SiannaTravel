-- ============================================================
--  SIANNA TRAVEL — Asesora asignada a cada usuario del admin
--  Ejecutar como "postgres" conectado a la base "sianna".
--
--  Las alertas de leads (push) van a la asesora del lead. Los usuarios con
--  asesora NULL (admin, supervisión) reciben todas las alertas.
--  El valor debe coincidir con el nombre que manda n8n: 'Bianka', 'Ana Laura'
--  (se compara sin acentos, mayúsculas ni espacios).
-- ============================================================

ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS asesora TEXT;

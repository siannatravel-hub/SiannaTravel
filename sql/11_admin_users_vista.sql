-- ============================================================
--  SIANNA TRAVEL — Panel de inicio de cada usuaria del admin
--  Ejecutar como "postgres" conectado a la base "sianna", ANTES de desplegar el
--  servidor nuevo (el login ahora lee esta columna).
--
--  OJO: esto NO son permisos. Todas las usuarias administran todo (paquetes, blog,
--  FAQ, enlaces, leads). La columna solo decide qué panel ven al entrar:
--    duena   = resumen del negocio (cifras, equipo, leads recientes de todas).
--    asesora = "mis leads" primero (los que coinciden con su columna "asesora").
--
--  Por defecto 'duena': aplicar esto no cambia nada para nadie hasta asignar a mano.
-- ============================================================

ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS vista_inicio TEXT NOT NULL DEFAULT 'duena'
  CHECK (vista_inicio IN ('duena', 'asesora'));

-- ---------- Asignación (editar los correos reales y ejecutar a mano) ----------
-- Ana Laura conserva asesora = 'Ana Laura' para seguir recibiendo sus avisos de leads VIP.
-- UPDATE admin_users SET vista_inicio = 'duena',   asesora = 'Ana Laura' WHERE lower(email) = lower('CORREO_DE_ANA_LAURA');
-- Bianka y Wendy: el valor de "asesora" debe coincidir con el nombre que manda n8n.
-- UPDATE admin_users SET vista_inicio = 'asesora', asesora = 'Bianka'    WHERE lower(email) = lower('CORREO_DE_BIANKA');
-- UPDATE admin_users SET vista_inicio = 'asesora', asesora = 'Wendy'     WHERE lower(email) = lower('CORREO_DE_WENDY');

-- Comprobar:
-- SELECT id, email, nombre, vista_inicio, asesora, activo FROM admin_users ORDER BY id;

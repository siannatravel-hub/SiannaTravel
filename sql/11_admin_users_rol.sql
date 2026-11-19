-- ============================================================
--  SIANNA TRAVEL — Rol de cada usuario del admin
--  Ejecutar como "postgres" conectado a la base "sianna", ANTES de desplegar el
--  servidor nuevo (el login ahora lee esta columna).
--
--  owner   = dueña / soporte: ve el negocio completo (cifras, catálogo, blog, bot, leads).
--  asesora = ve y atiende solo SUS leads (los que coinciden con su columna "asesora").
--
--  El valor por defecto es 'owner' para que NADIE pierda acceso al aplicar esto:
--  los cambios a 'asesora' se hacen a propósito, usuaria por usuaria (abajo).
-- ============================================================

ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS rol TEXT NOT NULL DEFAULT 'owner'
  CHECK (rol IN ('owner', 'asesora'));

-- ---------- Asignación (editar los correos reales y ejecutar a mano) ----------
-- Ana Laura: dueña. Conserva asesora = 'Ana Laura' para seguir recibiendo sus avisos de leads VIP.
-- UPDATE admin_users SET rol = 'owner',   asesora = 'Ana Laura' WHERE lower(email) = lower('CORREO_DE_ANA_LAURA');
-- Bianka y Wendy: el valor de "asesora" debe coincidir con el nombre que manda n8n.
-- UPDATE admin_users SET rol = 'asesora', asesora = 'Bianka'    WHERE lower(email) = lower('CORREO_DE_BIANKA');
-- UPDATE admin_users SET rol = 'asesora', asesora = 'Wendy'     WHERE lower(email) = lower('CORREO_DE_WENDY');

-- Comprobar:
-- SELECT id, email, nombre, rol, asesora, activo FROM admin_users ORDER BY id;

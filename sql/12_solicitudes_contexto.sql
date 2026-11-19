-- ============================================================
--  SIANNA TRAVEL — Más contexto en cada lead para la asesora
--  Ejecutar como "postgres" conectado a la base "sianna".
--
--  Solo AGREGA columnas (no borra ni cambia datos). Se puede correr antes o
--  después de desplegar: el admin funciona igual si las columnas están vacías.
--  Debe correrse ANTES de agregar los 2 nodos nuevos al flujo de n8n.
--
--    historial                 conversación cliente/bot (n8n ya la escribe; aquí solo se asegura que exista)
--    resumen                   resumen de 3 líneas que n8n genera al escalar (antes se generaba y se perdía)
--    chatwoot_conversation_id  \  para el botón "Ver chat completo"
--    chatwoot_account_id       /
-- ============================================================

ALTER TABLE solicitudes ADD COLUMN IF NOT EXISTS historial TEXT;
ALTER TABLE solicitudes ADD COLUMN IF NOT EXISTS resumen TEXT;
ALTER TABLE solicitudes ADD COLUMN IF NOT EXISTS chatwoot_conversation_id TEXT;
ALTER TABLE solicitudes ADD COLUMN IF NOT EXISTS chatwoot_account_id TEXT;

-- Comprobar:
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'solicitudes' ORDER BY ordinal_position;

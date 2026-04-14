-- ===========================================
-- Agregar columna currency y asegurar persons en packages
-- Ejecutar en Supabase SQL Editor
-- ===========================================

-- Agregar columna currency (tipo de moneda) con default MXN
ALTER TABLE packages ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'MXN';

-- Verificar que persons existe (ya debería existir)
ALTER TABLE packages ADD COLUMN IF NOT EXISTS persons INTEGER DEFAULT 2;

-- Actualizar paquetes existentes que no tengan currency
UPDATE packages SET currency = 'MXN' WHERE currency IS NULL;

-- Verificar
SELECT id, title, currency, persons FROM packages ORDER BY id;

-- ============================================================
-- LIMPIEZA DE PAQUETES VACÍOS - VERSIÓN ACTUALIZADA
-- Ejecutar en: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- 1. Ver TODOS los paquetes que están en la BD (diagnóstico)
SELECT id, slug, title, destination, price, image, created_at
FROM packages
ORDER BY created_at DESC;

-- ============================================================
-- 2. ASIGNAR SLUG a paquetes que no lo tienen
--    Genera slug desde el título: minúsculas, sin espacios
-- ============================================================
UPDATE packages
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      TRANSLATE(title,
        'áéíóúÁÉÍÓÚüÜñÑ',
        'aeiouAEIOUuUnN'
      ),
      '[^a-zA-Z0-9\s-]', '', 'g'
    ),
    '\s+', '-', 'g'
  )
)
WHERE (slug IS NULL OR TRIM(slug) = '')
  AND title IS NOT NULL
  AND TRIM(title) != '';

-- ============================================================
-- 3. ELIMINAR paquetes vacíos o incompletos de "packages"
--    Condición: sin título, precio 0 o nulo, o sin destino
-- ============================================================
DELETE FROM packages
WHERE title IS NULL
   OR TRIM(title) = ''
   OR title = 'undefined'
   OR price IS NULL
   OR price = 0
   OR destination IS NULL
   OR TRIM(destination) = ''
   OR destination = 'undefined';

-- ============================================================
-- 4. ELIMINAR paquetes destacados vacíos de "featured_packages"
-- ============================================================
DELETE FROM featured_packages
WHERE title IS NULL
   OR TRIM(title) = ''
   OR title = 'undefined'
   OR price IS NULL
   OR price = 0;

-- ============================================================
-- 5. BORRAR TODO Y EMPEZAR DESDE CERO
--    Descomenta estas 3 líneas si quieres tabla completamente vacía
-- ============================================================
-- DELETE FROM package_history;
-- DELETE FROM packages;
-- DELETE FROM featured_packages;

-- ============================================================
-- 6. Verificar resultado final
-- ============================================================
SELECT id, slug, title, price FROM packages ORDER BY id;
SELECT 'Total packages' AS info, COUNT(*) AS total FROM packages
UNION ALL
SELECT 'Total featured', COUNT(*) FROM featured_packages;

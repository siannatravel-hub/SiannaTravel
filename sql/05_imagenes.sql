-- ============================================================
--  SIANNA TRAVEL — Reapuntar imágenes de Supabase Storage a /images
--  Ejecutar DESPUÉS de descargar las imágenes a:
--     client/public/images/packages/   (imágenes de paquetes)
--     client/public/images/blog/       (imágenes del blog)
--  manteniendo los MISMOS nombres de archivo.
--
--  Reemplaza el prefijo de Supabase por una ruta local del sitio:
--    .../package-images/packages/x.jpg  ->  /images/packages/x.jpg
--    .../package-images/blog/x.jpg      ->  /images/blog/x.jpg
-- ============================================================

-- Paquetes: columna image
UPDATE packages
SET image = REPLACE(
  image,
  'https://cvtearllxmrdzuatipmo.supabase.co/storage/v1/object/public/package-images/',
  '/images/'
)
WHERE image LIKE '%cvtearllxmrdzuatipmo.supabase.co/storage%';

-- Blog: portada
UPDATE blog_posts
SET cover_image = REPLACE(
  cover_image,
  'https://cvtearllxmrdzuatipmo.supabase.co/storage/v1/object/public/package-images/',
  '/images/'
)
WHERE cover_image LIKE '%cvtearllxmrdzuatipmo.supabase.co/storage%';

-- Blog: imágenes dentro del contenido (content es JSON en texto)
UPDATE blog_posts
SET content = REPLACE(
  content,
  'https://cvtearllxmrdzuatipmo.supabase.co/storage/v1/object/public/package-images/',
  '/images/'
)
WHERE content LIKE '%cvtearllxmrdzuatipmo.supabase.co/storage%';

-- Verificación: no debe quedar ninguna referencia a Supabase Storage
-- SELECT id, image FROM packages WHERE image LIKE '%supabase%';
-- SELECT id, cover_image FROM blog_posts WHERE cover_image LIKE '%supabase%' OR content LIKE '%supabase%';

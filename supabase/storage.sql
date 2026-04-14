-- ===========================================
-- CONFIGURACIÓN DE SUPABASE STORAGE
-- Ejecutar en Supabase SQL Editor
-- Dashboard > SQL Editor > New Query
-- ===========================================

-- 1. Crear bucket para imágenes de paquetes (público)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'package-images',
  'package-images',
  true,
  5242880,
  ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880;

-- 2. Eliminar políticas anteriores si existen (evita duplicados)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;

-- 3. Política: lectura pública
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'package-images');

-- 4. Política: usuarios autenticados pueden subir
CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'package-images');

-- 5. Política: usuarios autenticados pueden actualizar
CREATE POLICY "Authenticated users can update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'package-images');

-- 6. Política: usuarios autenticados pueden eliminar
CREATE POLICY "Authenticated users can delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'package-images');

-- 7. Verificar bucket
SELECT id, name, public, file_size_limit FROM storage.buckets WHERE id = 'package-images';

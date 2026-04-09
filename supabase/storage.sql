-- ===========================================
-- CONFIGURACIÓN DE SUPABASE STORAGE
-- Ejecutar en Supabase SQL Editor
-- ===========================================

-- Crear bucket para imágenes de paquetes
INSERT INTO storage.buckets (id, name, public)
VALUES ('package-images', 'package-images', true)
ON CONFLICT (id) DO NOTHING;

-- Política para lectura pública de imágenes
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'package-images');

-- Política para que usuarios autenticados suban imágenes
CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'package-images');

-- Política para que usuarios autenticados actualicen imágenes
CREATE POLICY "Authenticated users can update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'package-images');

-- Política para que usuarios autenticados eliminen imágenes
CREATE POLICY "Authenticated users can delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'package-images');

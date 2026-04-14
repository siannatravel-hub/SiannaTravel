-- ===========================================
-- TABLA: blog_posts
-- Ejecutar en Supabase SQL Editor
-- Dashboard > SQL Editor > New Query
-- ===========================================

-- Crear la tabla de blog
CREATE TABLE IF NOT EXISTS blog_posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  content TEXT,  -- JSON string con bloques de contenido
  author TEXT DEFAULT 'Sianna Travel',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Política para lectura pública (solo posts publicados)
CREATE POLICY "Allow public read published posts" ON blog_posts
  FOR SELECT USING (is_published = true);

-- Política para usuarios autenticados (CRUD completo)
CREATE POLICY "Allow authenticated full access" ON blog_posts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Trigger para actualizar automáticamente updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Índice para búsqueda por slug
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts (slug);

-- Índice para ordenar por fecha
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts (is_published, published_at DESC);

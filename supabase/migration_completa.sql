-- ============================================================
-- MIGRACIÓN COMPLETA SIANNA TRAVEL
-- Corre TODO esto de una vez en: Supabase → SQL Editor → New Query → Run
-- Es seguro correrlo aunque ya hayas corrido schema.sql
-- ============================================================


-- ══════════════════════════════════════════════════════════════
-- 1. FUNCIONES
-- ══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION limit_package_history()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM package_history
  WHERE id NOT IN (
    SELECT id FROM package_history
    WHERE package_id = NEW.package_id
    ORDER BY changed_at DESC
    LIMIT 3
  ) AND package_id = NEW.package_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ══════════════════════════════════════════════════════════════
-- 2. COLUMNAS FALTANTES EN packages
--    (IF NOT EXISTS = seguro aunque ya existan)
-- ══════════════════════════════════════════════════════════════

ALTER TABLE packages ADD COLUMN IF NOT EXISTS slug                TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS currency            TEXT        DEFAULT 'MXN';
ALTER TABLE packages ADD COLUMN IF NOT EXISTS airline             TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS flight_type         TEXT        DEFAULT 'internacional';
ALTER TABLE packages ADD COLUMN IF NOT EXISTS service_type        TEXT        DEFAULT 'paquete';
ALTER TABLE packages ADD COLUMN IF NOT EXISTS persons             INTEGER     DEFAULT 2;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS hotel_name          TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS hotel_stars         INTEGER;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS room_type           TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS accommodation_type  TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS itinerary_pdf       TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS dates               TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS contact_whatsapp    TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS cancellation_policy TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS reviews_count       INTEGER     DEFAULT 0;

-- Columnas JSONB
ALTER TABLE packages ADD COLUMN IF NOT EXISTS gallery            JSONB DEFAULT '[]'::jsonb;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS flight_includes    JSONB DEFAULT '[]'::jsonb;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS transfers_included  JSONB DEFAULT '[]'::jsonb;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS itinerary          JSONB DEFAULT '[]'::jsonb;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS important_info     JSONB DEFAULT '[]'::jsonb;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS terms_conditions   JSONB DEFAULT '[]'::jsonb;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS payment_options    JSONB DEFAULT '[]'::jsonb;

-- Convertir includes y highlights de TEXT[] a JSONB si aún son arrays
DO $$
BEGIN
  IF (SELECT data_type FROM information_schema.columns
      WHERE table_name = 'packages' AND column_name = 'includes') = 'ARRAY' THEN
    ALTER TABLE packages ALTER COLUMN includes DROP DEFAULT;
    ALTER TABLE packages ALTER COLUMN includes TYPE JSONB USING to_jsonb(includes);
    ALTER TABLE packages ALTER COLUMN includes SET DEFAULT '[]'::jsonb;
  END IF;
END $$;

DO $$
BEGIN
  IF (SELECT data_type FROM information_schema.columns
      WHERE table_name = 'packages' AND column_name = 'highlights') = 'ARRAY' THEN
    ALTER TABLE packages ALTER COLUMN highlights DROP DEFAULT;
    ALTER TABLE packages ALTER COLUMN highlights TYPE JSONB USING to_jsonb(highlights);
    ALTER TABLE packages ALTER COLUMN highlights SET DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Índice único en slug (necesario para el upsert)
CREATE UNIQUE INDEX IF NOT EXISTS packages_slug_idx ON packages (slug);


-- ══════════════════════════════════════════════════════════════
-- 3. COLUMNAS FALTANTES EN featured_packages
-- ══════════════════════════════════════════════════════════════

ALTER TABLE featured_packages ADD COLUMN IF NOT EXISTS link          TEXT        DEFAULT '/paquetes';
ALTER TABLE featured_packages ADD COLUMN IF NOT EXISTS itinerary_pdf TEXT;


-- ══════════════════════════════════════════════════════════════
-- 4. RLS EN packages
-- ══════════════════════════════════════════════════════════════

ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='packages' AND policyname='Allow public read access') THEN
    CREATE POLICY "Allow public read access" ON packages FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='packages' AND policyname='Allow authenticated insert') THEN
    CREATE POLICY "Allow authenticated insert" ON packages FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='packages' AND policyname='Allow authenticated update') THEN
    CREATE POLICY "Allow authenticated update" ON packages FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='packages' AND policyname='Allow authenticated delete') THEN
    CREATE POLICY "Allow authenticated delete" ON packages FOR DELETE TO authenticated USING (true);
  END IF;
END $$;


-- ══════════════════════════════════════════════════════════════
-- 5. TRIGGERS
-- ══════════════════════════════════════════════════════════════

DROP TRIGGER IF EXISTS update_packages_updated_at ON packages;
CREATE TRIGGER update_packages_updated_at
  BEFORE UPDATE ON packages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_featured_packages_updated_at ON featured_packages;
CREATE TRIGGER update_featured_packages_updated_at
  BEFORE UPDATE ON featured_packages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ══════════════════════════════════════════════════════════════
-- 6. PAQUETES REALES (upsert por slug)
--    Borra los de ejemplo e inserta los 4 reales de Sianna
-- ══════════════════════════════════════════════════════════════

-- Eliminar paquetes de ejemplo que insertó schema.sql
DELETE FROM featured_packages;
DELETE FROM packages WHERE slug IS NULL;

-- Insertar los 4 paquetes reales
INSERT INTO packages (
  slug, title, destination, country, region, description,
  price, original_price, discount, duration, nights, image,
  category, rating, reviews_count, includes, highlights,
  is_featured, is_active, order_index, flight_type, itinerary_pdf,
  currency, persons
) VALUES

-- 1. Barrancas del Cobre
(
  'barrancas-del-cobre',
  'Barrancas del Cobre',
  'Chihuahua, México', 'México', 'Norte de México',
  'Descubre el Mar de Barrancas en la Sierra Tarahumara. A bordo del legendario Tren El Chepe, recorre uno de los cañones más profundos de México rodeado de naturaleza única.',
  1450, 1799, 19,
  '5 noches / 6 días', 5,
  '/images/packages/barranchadelcobre.png',
  'aventura', 4.8, 127,
  '["Vuelo redondo","Tren El Chepe","Hotel en Creel","Guía especializado","Visita a cascadas"]'::jsonb,
  '["Barranca del Cobre","Creel","Tren El Chepe","Sierra Tarahumara"]'::jsonb,
  true, true, 0, 'nacional',
  'https://drive.google.com/file/d/10THWoFOvm9GDeB-EB-XNr8IpyoNmCbYa/view',
  'MXN', 2
),

-- 2. Tren y Paraíso Maya
(
  'tren-paraiso-maya',
  'Tren y Paraíso Maya',
  'Riviera Maya, México', 'México', 'Caribe',
  'Recorre la Riviera Maya a bordo del moderno Tren Maya. Desde Cancún hasta Tulum, disfruta de cenotes turquesas, zonas arqueológicas y las playas más bellas del Caribe mexicano.',
  1299, 1599, 19,
  '7 noches / 8 días', 7,
  '/images/packages/trenmaya.jpg',
  'playa', 4.9, 213,
  '["Vuelo redondo","Pase Tren Maya","Hotel 5 estrellas All-Inclusive","Chichén Itzá","Tour cenotes"]'::jsonb,
  '["Cancún","Tulum","Chichén Itzá","Cenotes"]'::jsonb,
  true, true, 1, 'nacional',
  'https://drive.google.com/file/d/1xcJNxnJMxfwbsbc2jwKPaNA3RHafNSVG/view',
  'MXN', 2
),

-- 3. Vamos a Colombia
(
  'vamos-a-colombia',
  'Vamos a Colombia',
  'Bogotá y Cartagena, Colombia', 'Colombia', 'Sudamérica',
  'De Bogotá a Cartagena, Colombia te enamora con su gente cálida, gastronomía colorida, café de altura, arquitectura colonial y el ritmo del Caribe.',
  1599, 1999, 20,
  '7 noches / 8 días', 7,
  '/images/packages/bogota.jpg',
  'cultural', 4.8, 98,
  '["Vuelo redondo","Hotel boutique Cartagena","City tours","Tour del café","Islas del Rosario"]'::jsonb,
  '["Cartagena","Bogotá","Café colombiano","Islas del Rosario"]'::jsonb,
  true, true, 2, 'internacional',
  'https://drive.google.com/file/d/1AyUr-OcfJKiVEtBvNEngTOzuDQoXNde3/view',
  'MXN', 2
),

-- 4. Orlando Verano Mágico
(
  'orlando-verano-magico',
  'Orlando Verano Mágico',
  'Orlando, Florida, EUA', 'Estados Unidos', 'Norteamérica',
  'El verano más mágico de tu familia en los mejores parques del mundo. Disney World, Universal Studios, SeaWorld y más en una sola escapada inolvidable.',
  1899, 2299, 17,
  '6 noches / 7 días', 6,
  '/images/packages/Disney_Orlando_castle_at_night.jpg',
  'familia', 4.9, 342,
  '["Vuelo redondo","Hotel temático","Multi-park pass 4 parques","Traslados","Seguro familiar"]'::jsonb,
  '["Disney World","Universal Studios","SeaWorld","LEGOLAND"]'::jsonb,
  true, true, 3, 'internacional',
  'https://drive.google.com/file/d/1EyUMnItwTFynJ0DBCNf17Xk_BGacm8RS/view',
  'MXN', 2
)

ON CONFLICT (slug) DO UPDATE SET
  title             = EXCLUDED.title,
  destination       = EXCLUDED.destination,
  country           = EXCLUDED.country,
  region            = EXCLUDED.region,
  description       = EXCLUDED.description,
  price             = EXCLUDED.price,
  original_price    = EXCLUDED.original_price,
  discount          = EXCLUDED.discount,
  duration          = EXCLUDED.duration,
  nights            = EXCLUDED.nights,
  image             = EXCLUDED.image,
  category          = EXCLUDED.category,
  rating            = EXCLUDED.rating,
  reviews_count     = EXCLUDED.reviews_count,
  includes          = EXCLUDED.includes,
  highlights        = EXCLUDED.highlights,
  is_featured       = EXCLUDED.is_featured,
  is_active         = EXCLUDED.is_active,
  order_index       = EXCLUDED.order_index,
  flight_type       = EXCLUDED.flight_type,
  itinerary_pdf     = EXCLUDED.itinerary_pdf,
  currency          = EXCLUDED.currency,
  persons           = EXCLUDED.persons,
  updated_at        = NOW();


-- ══════════════════════════════════════════════════════════════
-- 7. FEATURED PACKAGES (los 4 reales)
-- ══════════════════════════════════════════════════════════════

INSERT INTO featured_packages (title, destination, price, original_price, discount, image, tag, nights, rating, link, order_index)
VALUES
  ('Orlando Verano Mágico',      'Orlando, Florida, EUA',           1899, 2299, 17, '/images/packages/Disney_Orlando_castle_at_night.jpg', 'Familia',      6, 4.9, '/paquetes/orlando-verano-magico',  0),
  ('Barrancas del Cobre',        'Chihuahua, México',               1450, 1799, 19, '/images/packages/barranchadelcobre.png',              'Aventura',     5, 4.8, '/paquetes/barrancas-del-cobre',    1),
  ('Tren y Paraíso Maya',        'Riviera Maya, México',            1299, 1599, 19, '/images/packages/trenmaya.jpg',                       'Más Vendido',  7, 4.9, '/paquetes/tren-paraiso-maya',      2),
  ('Vamos a Colombia',           'Bogotá y Cartagena, Colombia',    1599, 1999, 20, '/images/packages/bogota.jpg',                         'Cultural',     7, 4.8, '/paquetes/vamos-a-colombia',       3);


-- ══════════════════════════════════════════════════════════════
-- 8. TABLA blog_posts
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS blog_posts (
  id          BIGSERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  excerpt     TEXT,
  cover_image TEXT,
  content     TEXT,
  author      TEXT DEFAULT 'Sianna Travel',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='blog_posts' AND policyname='Allow public read published posts') THEN
    CREATE POLICY "Allow public read published posts" ON blog_posts FOR SELECT USING (is_published = true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='blog_posts' AND policyname='Allow authenticated select') THEN
    CREATE POLICY "Allow authenticated select" ON blog_posts FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='blog_posts' AND policyname='Allow authenticated insert') THEN
    CREATE POLICY "Allow authenticated insert" ON blog_posts FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='blog_posts' AND policyname='Allow authenticated update') THEN
    CREATE POLICY "Allow authenticated update" ON blog_posts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='blog_posts' AND policyname='Allow authenticated delete') THEN
    CREATE POLICY "Allow authenticated delete" ON blog_posts FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug      ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts (is_published, published_at DESC);


-- ══════════════════════════════════════════════════════════════
-- 9. STORAGE bucket package-images
-- ══════════════════════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('package-images', 'package-images', true, 5242880,
        ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 5242880;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='objects' AND policyname='Public Access') THEN
    CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'package-images');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='objects' AND policyname='Authenticated users can upload') THEN
    CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'package-images');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='objects' AND policyname='Authenticated users can update') THEN
    CREATE POLICY "Authenticated users can update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'package-images');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='objects' AND policyname='Authenticated users can delete') THEN
    CREATE POLICY "Authenticated users can delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'package-images');
  END IF;
END $$;


-- ══════════════════════════════════════════════════════════════
-- 10. VERIFICACIÓN FINAL
-- ══════════════════════════════════════════════════════════════

SELECT 'packages'         AS tabla, COUNT(*) AS filas FROM packages
UNION ALL
SELECT 'featured_packages',          COUNT(*) FROM featured_packages
UNION ALL
SELECT 'blog_posts',                 COUNT(*) FROM blog_posts
UNION ALL
SELECT 'package_history',            COUNT(*) FROM package_history;

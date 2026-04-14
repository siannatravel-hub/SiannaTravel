-- ===========================================
-- SETUP COMPLETO: Tabla packages + tus paquetes reales
-- Pega todo esto en Supabase -> SQL Editor -> New Query -> Run
-- ===========================================

-- ── 1. Crear tabla packages ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS packages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  destination TEXT,
  country TEXT,
  region TEXT,
  description TEXT,
  price INTEGER DEFAULT 0,
  original_price INTEGER,
  discount INTEGER DEFAULT 0,
  duration TEXT,
  nights INTEGER DEFAULT 0,
  image TEXT,
  category TEXT,
  rating DECIMAL(3,1) DEFAULT 4.5,
  reviews_count INTEGER DEFAULT 0,
  includes JSONB DEFAULT '[]'::jsonb,
  highlights JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  flight_type TEXT DEFAULT 'internacional',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  slug TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,
  flight_includes JSONB DEFAULT '[]'::jsonb,
  service_type TEXT DEFAULT 'paquete',
  persons INTEGER DEFAULT 2,
  hotel_name TEXT,
  hotel_stars INTEGER,
  room_type TEXT,
  accommodation_type TEXT,
  transfers_included JSONB DEFAULT '[]'::jsonb,
  itinerary JSONB DEFAULT '[]'::jsonb,
  important_info JSONB DEFAULT '[]'::jsonb,
  terms_conditions JSONB DEFAULT '[]'::jsonb,
  cancellation_policy TEXT,
  payment_options JSONB DEFAULT '[]'::jsonb,
  contact_whatsapp TEXT,
  dates TEXT,
  itinerary_pdf TEXT
);

-- ── 1b. Agregar columnas faltantes si la tabla ya existe ─────────────
ALTER TABLE packages ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]'::jsonb;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS flight_includes JSONB DEFAULT '[]'::jsonb;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS service_type TEXT DEFAULT 'paquete';
ALTER TABLE packages ADD COLUMN IF NOT EXISTS persons INTEGER DEFAULT 2;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS hotel_name TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS hotel_stars INTEGER;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS room_type TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS accommodation_type TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS transfers_included JSONB DEFAULT '[]'::jsonb;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS itinerary JSONB DEFAULT '[]'::jsonb;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS important_info JSONB DEFAULT '[]'::jsonb;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS terms_conditions JSONB DEFAULT '[]'::jsonb;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS cancellation_policy TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS payment_options JSONB DEFAULT '[]'::jsonb;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS contact_whatsapp TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS dates TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS itinerary_pdf TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]'::jsonb;

-- Convertir columnas text[] a JSONB si fueron creadas como arrays de texto
ALTER TABLE packages ALTER COLUMN includes DROP DEFAULT;
ALTER TABLE packages ALTER COLUMN includes TYPE JSONB USING to_jsonb(includes);
ALTER TABLE packages ALTER COLUMN includes SET DEFAULT '[]'::jsonb;

ALTER TABLE packages ALTER COLUMN highlights DROP DEFAULT;
ALTER TABLE packages ALTER COLUMN highlights TYPE JSONB USING to_jsonb(highlights);
ALTER TABLE packages ALTER COLUMN highlights SET DEFAULT '[]'::jsonb;

-- Índice único en slug para el upsert
CREATE UNIQUE INDEX IF NOT EXISTS packages_slug_idx ON packages (slug);

-- ── 2. Row Level Security ────────────────────────────────────────────
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- Lectura pública
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'packages' AND policyname = 'Packages are publicly readable'
  ) THEN
    CREATE POLICY "Packages are publicly readable"
      ON packages FOR SELECT
      USING (true);
  END IF;
END $$;

-- Escritura solo para autenticados
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'packages' AND policyname = 'Authenticated users can manage packages'
  ) THEN
    CREATE POLICY "Authenticated users can manage packages"
      ON packages FOR ALL
      USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;

-- ── 3. Crear tabla package_history ───────────────────────────────────
CREATE TABLE IF NOT EXISTS package_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id TEXT NOT NULL,
  action TEXT NOT NULL,
  data JSONB,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE package_history ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'package_history' AND policyname = 'Authenticated users can manage history'
  ) THEN
    CREATE POLICY "Authenticated users can manage history"
      ON package_history FOR ALL
      USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- ── 4. Insertar / actualizar tus paquetes reales ─────────────────────
-- Usa INSERT ... ON CONFLICT (slug) DO UPDATE para no perder cambios futuros del admin.

INSERT INTO packages (
  slug, title, destination, country, region, description,
  price, original_price, discount, duration, nights, image,
  category, rating, reviews_count, includes, highlights,
  is_featured, is_active, order_index, flight_type, itinerary_pdf
) VALUES

-- 1. Barrancas del Cobre
(
  'barrancas-del-cobre',
  'Barrancas del Cobre',
  'Chihuahua, México',
  'México',
  'Norte de México',
  'Descubre el Mar de Barrancas en la Sierra Tarahumara. A bordo del legendario Tren El Chepe, recorre uno de los cañones más profundos de México rodeado de naturaleza única.',
  1450, 1799, 19,
  '5 noches / 6 días', 5,
  '/images/packages/barranchadelcobre.png',
  'aventura', 4.8, 127,
  '["Vuelo redondo","Tren El Chepe","Hotel en Creel","Guía especializado","Visita a cascadas"]'::jsonb,
  '["Barranca del Cobre","Creel","Tren El Chepe","Sierra Tarahumara"]'::jsonb,
  true, true, 0,
  'nacional',
  'https://drive.google.com/file/d/10THWoFOvm9GDeB-EB-XNr8IpyoNmCbYa/view'
),

-- 2. Tren y Paraíso Maya
(
  'tren-paraiso-maya',
  'Tren y Paraíso Maya',
  'Riviera Maya, México',
  'México',
  'Caribe',
  'Recorre la Riviera Maya a bordo del moderno Tren Maya. Desde Cancún hasta Tulum, disfruta de cenotes turquesas, zonas arqueológicas y las playas más bellas del Caribe mexicano.',
  1299, 1599, 19,
  '7 noches / 8 días', 7,
  '/images/packages/trenmaya.jpg',
  'playa', 4.9, 213,
  '["Vuelo redondo","Pase Tren Maya","Hotel 5 estrellas All-Inclusive","Chichén Itzá","Tour cenotes"]'::jsonb,
  '["Cancún","Tulum","Chichén Itzá","Cenotes"]'::jsonb,
  true, true, 1,
  'nacional',
  'https://drive.google.com/file/d/1xcJNxnJMxfwbsbc2jwKPaNA3RHafNSVG/view'
),

-- 3. Vamos a Colombia
(
  'vamos-a-colombia',
  'Vamos a Colombia',
  'Bogotá y Cartagena, Colombia',
  'Colombia',
  'Sudamérica',
  'De Bogotá a Cartagena, Colombia te enamora con su gente cálida, gastronomía colorida, café de altura, arquitectura colonial y el ritmo del Caribe.',
  1599, 1999, 20,
  '7 noches / 8 días', 7,
  '/images/packages/bogota.jpg',
  'cultural', 4.8, 98,
  '["Vuelo redondo","Hotel boutique Cartagena","City tours","Tour del café","Islas del Rosario"]'::jsonb,
  '["Cartagena","Bogotá","Café colombiano","Islas del Rosario"]'::jsonb,
  true, true, 2,
  'internacional',
  'https://drive.google.com/file/d/1AyUr-OcfJKiVEtBvNEngTOzuDQoXNde3/view'
),

-- 4. Orlando Verano Mágico
(
  'orlando-verano-magico',
  'Orlando Verano Mágico',
  'Orlando, Florida, EUA',
  'Estados Unidos',
  'Norteamérica',
  'El verano más mágico de tu familia en los mejores parques del mundo. Disney World, Universal Studios, SeaWorld y más en una sola escapada inolvidable.',
  1899, 2299, 17,
  '6 noches / 7 días', 6,
  '/images/packages/Disney_Orlando_castle_at_night.jpg',
  'familia', 4.9, 342,
  '["Vuelo redondo","Hotel temático","Multi-park pass 4 parques","Traslados","Seguro familiar"]'::jsonb,
  '["Disney World","Universal Studios","SeaWorld","LEGOLAND"]'::jsonb,
  true, true, 3,
  'internacional',
  'https://drive.google.com/file/d/1EyUMnItwTFynJ0DBCNf17Xk_BGacm8RS/view'
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
  updated_at        = NOW();

-- ── 5. Limpiar featured_packages y poner tus 4 reales ───────────────
DELETE FROM featured_packages;

INSERT INTO featured_packages (title, destination, price, original_price, discount, image, tag, nights, rating, link, order_index)
VALUES
  (
    'Orlando Verano Mágico',
    'Orlando, Florida, EUA',
    1899, 2299, 17,
    '/images/packages/Disney_Orlando_castle_at_night.jpg',
    'Familia',
    6, 4.9,
    '/paquetes/orlando-verano-magico',
    0
  ),
  (
    'Barrancas del Cobre',
    'Chihuahua, México',
    1450, 1799, 19,
    '/images/packages/barranchadelcobre.png',
    'Aventura',
    5, 4.8,
    '/paquetes/barrancas-del-cobre',
    1
  ),
  (
    'Tren y Paraíso Maya',
    'Riviera Maya, México',
    1299, 1599, 19,
    '/images/packages/trenmaya.jpg',
    'Más Vendido',
    7, 4.9,
    '/paquetes/tren-paraiso-maya',
    2
  ),
  (
    'Vamos a Colombia',
    'Bogotá y Cartagena, Colombia',
    1599, 1999, 20,
    '/images/packages/bogota.jpg',
    'Cultural',
    7, 4.8,
    '/paquetes/vamos-a-colombia',
    3
  );

-- ── Verificar ─────────────────────────────────────────────────────────
SELECT id, slug, title, price, is_featured, is_active FROM packages ORDER BY order_index;
SELECT id, title, price FROM featured_packages ORDER BY order_index;

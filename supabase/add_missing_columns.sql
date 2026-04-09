-- =====================================================
-- Script mínimo: solo agregar columnas faltantes
-- Corre esto PRIMERO en Supabase → SQL Editor
-- Es seguro correrlo varias veces (IF NOT EXISTS)
-- =====================================================

ALTER TABLE packages ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS itinerary_pdf TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS dates TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS contact_whatsapp TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS cancellation_policy TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS hotel_name TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS hotel_stars INTEGER;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS room_type TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS accommodation_type TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS service_type TEXT DEFAULT 'paquete';
ALTER TABLE packages ADD COLUMN IF NOT EXISTS persons INTEGER DEFAULT 2;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS flight_type TEXT DEFAULT 'internacional';

-- Convertir includes y highlights de text[] a JSONB (DROP DEFAULT primero)
ALTER TABLE packages ALTER COLUMN includes DROP DEFAULT;
ALTER TABLE packages ALTER COLUMN includes TYPE JSONB USING to_jsonb(includes);
ALTER TABLE packages ALTER COLUMN includes SET DEFAULT '[]'::jsonb;

ALTER TABLE packages ALTER COLUMN highlights DROP DEFAULT;
ALTER TABLE packages ALTER COLUMN highlights TYPE JSONB USING to_jsonb(highlights);
ALTER TABLE packages ALTER COLUMN highlights SET DEFAULT '[]'::jsonb;

-- Agregar columnas JSONB nuevas
ALTER TABLE packages ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]'::jsonb;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS flight_includes JSONB DEFAULT '[]'::jsonb;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS transfers_included JSONB DEFAULT '[]'::jsonb;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS itinerary JSONB DEFAULT '[]'::jsonb;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS important_info JSONB DEFAULT '[]'::jsonb;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS terms_conditions JSONB DEFAULT '[]'::jsonb;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS payment_options JSONB DEFAULT '[]'::jsonb;

-- Índice único en slug (necesario para el upsert)
CREATE UNIQUE INDEX IF NOT EXISTS packages_slug_idx ON packages (slug);

-- Verificar columnas resultantes
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'packages'
ORDER BY ordinal_position;

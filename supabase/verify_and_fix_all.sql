-- ============================================================
-- SUPABASE: VERIFICACIÓN Y REPARACIÓN COMPLETA
-- Corre esto en: Supabase Dashboard → SQL Editor → New Query → Run
-- Es seguro correrlo N veces (todo usa IF NOT EXISTS / OR REPLACE)
-- ============================================================


-- ══════════════════════════════════════════════
-- 1. FUNCIÓN update_updated_at_column
--    Usada por triggers de packages y featured_packages
-- ══════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ══════════════════════════════════════════════
-- 2. FUNCIÓN limit_package_history
--    Mantiene solo los últimos 3 cambios por paquete
-- ══════════════════════════════════════════════

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


-- ══════════════════════════════════════════════
-- 3. TABLA packages
--    Columna slug = identificador de ruta (el código usa .eq('slug', id))
-- ══════════════════════════════════════════════

-- Columnas base (si la tabla ya existe agrega solo las que faltan)
ALTER TABLE packages ADD COLUMN IF NOT EXISTS slug                TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS title               TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS destination         TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS country             TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS region              TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS description         TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS price               INTEGER        DEFAULT 0;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS original_price      INTEGER;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS discount            INTEGER        DEFAULT 0;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS duration            TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS nights              INTEGER        DEFAULT 0;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS image               TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS category            TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS rating              DECIMAL(3,1)   DEFAULT 4.5;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS reviews_count       INTEGER        DEFAULT 0;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS is_active           BOOLEAN        DEFAULT true;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS is_featured         BOOLEAN        DEFAULT false;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS order_index         INTEGER        DEFAULT 0;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS created_at          TIMESTAMPTZ    DEFAULT NOW();
ALTER TABLE packages ADD COLUMN IF NOT EXISTS updated_at          TIMESTAMPTZ    DEFAULT NOW();

-- Columnas de vuelo / hotel (usadas en PackageDetailNew y ManagePackages)
ALTER TABLE packages ADD COLUMN IF NOT EXISTS airline             TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS flight_type         TEXT           DEFAULT 'internacional';
ALTER TABLE packages ADD COLUMN IF NOT EXISTS service_type        TEXT           DEFAULT 'paquete';
ALTER TABLE packages ADD COLUMN IF NOT EXISTS persons             INTEGER        DEFAULT 2;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS hotel_name          TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS hotel_stars         INTEGER;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS room_type           TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS accommodation_type  TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS itinerary_pdf       TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS dates               TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS contact_whatsapp    TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS cancellation_policy TEXT;

-- Columnas JSONB (arrays de objetos o strings)
ALTER TABLE packages ADD COLUMN IF NOT EXISTS includes           JSONB   DEFAULT '[]'::jsonb;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS highlights         JSONB   DEFAULT '[]'::jsonb;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS gallery            JSONB   DEFAULT '[]'::jsonb;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS flight_includes    JSONB   DEFAULT '[]'::jsonb;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS transfers_included JSONB   DEFAULT '[]'::jsonb;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS itinerary          JSONB   DEFAULT '[]'::jsonb;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS important_info     JSONB   DEFAULT '[]'::jsonb;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS terms_conditions   JSONB   DEFAULT '[]'::jsonb;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS payment_options    JSONB   DEFAULT '[]'::jsonb;

-- Convertir includes/highlights de TEXT[] a JSONB si aún son arrays de texto
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

-- Índice único en slug (obligatorio para el ON CONFLICT (slug))
CREATE UNIQUE INDEX IF NOT EXISTS packages_slug_idx ON packages (slug);

-- ══════════════════════════════════════════════
-- 4. RLS policies en packages
-- ══════════════════════════════════════════════

ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'packages' AND policyname = 'Allow public read access'
  ) THEN
    CREATE POLICY "Allow public read access" ON packages FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'packages' AND policyname = 'Allow authenticated insert'
  ) THEN
    CREATE POLICY "Allow authenticated insert" ON packages FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'packages' AND policyname = 'Allow authenticated update'
  ) THEN
    CREATE POLICY "Allow authenticated update" ON packages FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'packages' AND policyname = 'Allow authenticated delete'
  ) THEN
    CREATE POLICY "Allow authenticated delete" ON packages FOR DELETE TO authenticated USING (true);
  END IF;
END $$;


-- ══════════════════════════════════════════════
-- 5. TRIGGER updated_at en packages
-- ══════════════════════════════════════════════

DROP TRIGGER IF EXISTS update_packages_updated_at ON packages;
CREATE TRIGGER update_packages_updated_at
  BEFORE UPDATE ON packages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- ══════════════════════════════════════════════
-- 6. TABLA featured_packages
--    Columnas que usa FeaturedPackages.jsx y featuredPackages.js
-- ══════════════════════════════════════════════

ALTER TABLE featured_packages ADD COLUMN IF NOT EXISTS title          TEXT;
ALTER TABLE featured_packages ADD COLUMN IF NOT EXISTS destination    TEXT;
ALTER TABLE featured_packages ADD COLUMN IF NOT EXISTS price         INTEGER      DEFAULT 0;
ALTER TABLE featured_packages ADD COLUMN IF NOT EXISTS original_price INTEGER;
ALTER TABLE featured_packages ADD COLUMN IF NOT EXISTS discount       INTEGER      DEFAULT 0;
ALTER TABLE featured_packages ADD COLUMN IF NOT EXISTS image          TEXT;
ALTER TABLE featured_packages ADD COLUMN IF NOT EXISTS tag            TEXT;
ALTER TABLE featured_packages ADD COLUMN IF NOT EXISTS nights         INTEGER      DEFAULT 5;
ALTER TABLE featured_packages ADD COLUMN IF NOT EXISTS rating         DECIMAL(2,1) DEFAULT 4.5;
ALTER TABLE featured_packages ADD COLUMN IF NOT EXISTS link           TEXT         DEFAULT '/paquetes';
ALTER TABLE featured_packages ADD COLUMN IF NOT EXISTS itinerary_pdf  TEXT;   -- ← columna faltante
ALTER TABLE featured_packages ADD COLUMN IF NOT EXISTS order_index    INTEGER      DEFAULT 0;
ALTER TABLE featured_packages ADD COLUMN IF NOT EXISTS created_at     TIMESTAMPTZ  DEFAULT NOW();
ALTER TABLE featured_packages ADD COLUMN IF NOT EXISTS updated_at     TIMESTAMPTZ  DEFAULT NOW();


-- ══════════════════════════════════════════════
-- 7. RLS policies en featured_packages
-- ══════════════════════════════════════════════

ALTER TABLE featured_packages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'featured_packages' AND policyname = 'Allow public read access'
  ) THEN
    CREATE POLICY "Allow public read access" ON featured_packages FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'featured_packages' AND policyname = 'Allow authenticated users to insert'
  ) THEN
    CREATE POLICY "Allow authenticated users to insert" ON featured_packages FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'featured_packages' AND policyname = 'Allow authenticated users to update'
  ) THEN
    CREATE POLICY "Allow authenticated users to update" ON featured_packages FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'featured_packages' AND policyname = 'Allow authenticated users to delete'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete" ON featured_packages FOR DELETE TO authenticated USING (true);
  END IF;
END $$;


-- ══════════════════════════════════════════════
-- 8. TRIGGER updated_at en featured_packages
-- ══════════════════════════════════════════════

DROP TRIGGER IF EXISTS update_featured_packages_updated_at ON featured_packages;
CREATE TRIGGER update_featured_packages_updated_at
  BEFORE UPDATE ON featured_packages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- ══════════════════════════════════════════════
-- 9. TABLA package_history
--    package_id referencia a packages(id) que puede ser TEXT o BIGINT.
--    Usamos TEXT para compatibilidad con ambos esquemas.
-- ══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS package_history (
  id          BIGSERIAL PRIMARY KEY,
  package_id  TEXT,
  field_changed TEXT NOT NULL,
  old_value   TEXT,
  new_value   TEXT,
  changed_by  TEXT DEFAULT 'admin',
  changed_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE package_history ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'package_history' AND policyname = 'Public read history'
  ) THEN
    CREATE POLICY "Public read history"   ON package_history FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'package_history' AND policyname = 'Auth insert history'
  ) THEN
    CREATE POLICY "Auth insert history"   ON package_history FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'package_history' AND policyname = 'Auth delete history'
  ) THEN
    CREATE POLICY "Auth delete history"   ON package_history FOR DELETE TO authenticated USING (true);
  END IF;
END $$;


-- ══════════════════════════════════════════════
-- 10. TRIGGER limit_history en package_history
-- ══════════════════════════════════════════════

DROP TRIGGER IF EXISTS limit_history_trigger ON package_history;
CREATE TRIGGER limit_history_trigger
  AFTER INSERT ON package_history
  FOR EACH ROW
  EXECUTE FUNCTION limit_package_history();


-- ══════════════════════════════════════════════
-- 11. STORAGE bucket package-images
-- ══════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public)
VALUES ('package-images', 'package-images', true)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Public Access'
  ) THEN
    CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'package-images');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Authenticated users can upload'
  ) THEN
    CREATE POLICY "Authenticated users can upload" ON storage.objects
      FOR INSERT TO authenticated WITH CHECK (bucket_id = 'package-images');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Authenticated users can update'
  ) THEN
    CREATE POLICY "Authenticated users can update" ON storage.objects
      FOR UPDATE TO authenticated USING (bucket_id = 'package-images');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Authenticated users can delete'
  ) THEN
    CREATE POLICY "Authenticated users can delete" ON storage.objects
      FOR DELETE TO authenticated USING (bucket_id = 'package-images');
  END IF;
END $$;


-- ══════════════════════════════════════════════
-- 12. VERIFICACIÓN FINAL — ejecuta esto para confirmar todo
-- ══════════════════════════════════════════════

-- Columnas de packages
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'packages'
ORDER BY ordinal_position;

-- Columnas de featured_packages
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'featured_packages'
ORDER BY ordinal_position;

-- Funciones existentes
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('update_updated_at_column', 'limit_package_history');

-- Triggers existentes
SELECT event_object_table AS tabla, trigger_name, event_manipulation AS evento
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table;

-- Políticas RLS
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Índices en packages
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'packages';

-- Conteos de datos
SELECT 'packages' AS tabla, COUNT(*) AS filas FROM packages
UNION ALL
SELECT 'featured_packages', COUNT(*) FROM featured_packages
UNION ALL
SELECT 'package_history', COUNT(*) FROM package_history;

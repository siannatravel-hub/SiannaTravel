-- ===========================================
-- TABLA: featured_packages
-- Ejecutar en Supabase SQL Editor
-- Dashboard > SQL Editor > New Query
-- ===========================================

-- Crear la tabla de paquetes destacados
CREATE TABLE IF NOT EXISTS featured_packages (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  price INTEGER NOT NULL,   
  original_price INTEGER,
  discount INTEGER DEFAULT 0,
  image TEXT NOT NULL,
  tag TEXT,
  nights INTEGER DEFAULT 5,
  rating DECIMAL(2,1) DEFAULT 4.5,
  link TEXT DEFAULT '/paquetes',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE featured_packages ENABLE ROW LEVEL SECURITY;

-- Política para lectura pública (todos pueden ver los paquetes)
CREATE POLICY "Allow public read access" ON featured_packages
  FOR SELECT USING (true);

-- Política para usuarios autenticados (solo admins pueden modificar)
CREATE POLICY "Allow authenticated users to insert" ON featured_packages
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update" ON featured_packages
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete" ON featured_packages
  FOR DELETE TO authenticated USING (true);

-- Insertar datos de ejemplo
INSERT INTO featured_packages (title, destination, price, original_price, discount, image, tag, nights, rating, order_index)
VALUES 
  (
    'Maldivas Todo Incluido',
    'Maldivas',
    4299,
    5499,
    22,
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=90',
    'Oferta Especial',
    6,
    4.9,
    0
  ),
  (
    'Santorini Romántico',
    'Grecia',
    2799,
    3299,
    15,
    'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=90',
    'Más Vendido',
    6,
    4.8,
    1
  ),
  (
    'Safari en Kenia',
    'Kenia, África',
    3599,
    4199,
    14,
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=90',
    'Aventura',
    8,
    4.9,
    2
  );

-- Función para actualizar el timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar automáticamente updated_at
CREATE TRIGGER update_featured_packages_updated_at
  BEFORE UPDATE ON featured_packages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- TABLA: packages (Todos los paquetes de viaje)
-- ===========================================

CREATE TABLE IF NOT EXISTS packages (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  country TEXT,
  region TEXT,
  description TEXT,
  price INTEGER NOT NULL,
  original_price INTEGER,
  discount INTEGER DEFAULT 0,
  duration TEXT DEFAULT '5 días / 4 noches',
  nights INTEGER DEFAULT 4,
  image TEXT NOT NULL,
  gallery TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'aventura',
  rating DECIMAL(2,1) DEFAULT 4.5,
  reviews_count INTEGER DEFAULT 0,
  includes TEXT[] DEFAULT '{}',
  highlights TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para packages
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read active packages" ON packages
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated full access" ON packages
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Trigger para updated_at
CREATE TRIGGER update_packages_updated_at
  BEFORE UPDATE ON packages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- TABLA: package_history (Historial de cambios - solo 3 últimos)
-- ===========================================

CREATE TABLE IF NOT EXISTS package_history (
  id BIGSERIAL PRIMARY KEY,
  package_id BIGINT NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  field_changed TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  changed_by TEXT,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para package_history
ALTER TABLE package_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read history" ON package_history
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert history" ON package_history
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated delete history" ON package_history
  FOR DELETE TO authenticated USING (true);

-- Función para mantener solo los últimos 3 cambios por paquete
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

-- Trigger para limitar historial a 3 registros
CREATE TRIGGER limit_history_trigger
  AFTER INSERT ON package_history
  FOR EACH ROW
  EXECUTE FUNCTION limit_package_history();

-- ===========================================
-- Datos de ejemplo para packages
-- ===========================================

INSERT INTO packages (title, destination, country, region, description, price, original_price, discount, duration, nights, image, category, rating, reviews_count, includes, highlights, is_featured, order_index)
VALUES 
  (
    'Cancún Todo Incluido',
    'Cancún',
    'México',
    'Caribe',
    'Disfruta del paraíso caribeño mexicano con playas de agua cristalina, resorts de lujo y la mejor gastronomía.',
    1899,
    2299,
    17,
    '6 días / 5 noches',
    5,
    'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800&q=90',
    'playa',
    4.8,
    234,
    ARRAY['Vuelos ida y vuelta', 'Hotel 5 estrellas', 'Todo incluido', 'Traslados'],
    ARRAY['Zona hotelera', 'Chichén Itzá', 'Isla Mujeres', 'Xcaret'],
    true,
    0
  ),
  (
    'París Romántico',
    'París',
    'Francia',
    'Europa',
    'La ciudad del amor te espera. Torre Eiffel, Louvre, paseos por el Sena y la mejor gastronomía francesa.',
    2499,
    2899,
    14,
    '7 días / 6 noches',
    6,
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=90',
    'cultural',
    4.9,
    189,
    ARRAY['Vuelos ida y vuelta', 'Hotel céntrico', 'Desayunos', 'City tour'],
    ARRAY['Torre Eiffel', 'Museo Louvre', 'Montmartre', 'Versalles'],
    true,
    1
  ),
  (
    'Tokio Moderno',
    'Tokio',
    'Japón',
    'Asia',
    'Explora la fascinante mezcla de tradición y modernidad en la capital japonesa.',
    3299,
    3799,
    13,
    '8 días / 7 noches',
    7,
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=90',
    'cultural',
    4.7,
    156,
    ARRAY['Vuelos ida y vuelta', 'Hotel tradicional', 'JR Pass', 'Guía bilingüe'],
    ARRAY['Shibuya', 'Monte Fuji', 'Templo Senso-ji', 'Akihabara'],
    false,
    2
  ),
  (
    'Machu Picchu Aventura',
    'Cusco',
    'Perú',
    'Sudamérica',
    'Descubre la magia del imperio Inca y camina por las nubes en una de las maravillas del mundo.',
    1699,
    1999,
    15,
    '5 días / 4 noches',
    4,
    'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=90',
    'aventura',
    4.9,
    312,
    ARRAY['Vuelos ida y vuelta', 'Hotel en Cusco', 'Tren a Machu Picchu', 'Entradas'],
    ARRAY['Machu Picchu', 'Valle Sagrado', 'Cusco Colonial', 'Ollantaytambo'],
    true,
    3
  ),
  (
    'Dubái de Lujo',
    'Dubái',
    'Emiratos Árabes',
    'Medio Oriente',
    'Vive el lujo extremo en la ciudad de los récords: rascacielos, compras y experiencias únicas.',
    2899,
    3499,
    17,
    '6 días / 5 noches',
    5,
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=90',
    'lujo',
    4.8,
    178,
    ARRAY['Vuelos ida y vuelta', 'Hotel 5 estrellas', 'Safari desierto', 'Burj Khalifa'],
    ARRAY['Burj Khalifa', 'Palm Jumeirah', 'Dubai Mall', 'Desert Safari'],
    false,
    4
  ),
  (
    'Nueva York City Break',
    'Nueva York',
    'Estados Unidos',
    'Norteamérica',
    'La Gran Manzana te espera con Broadway, Central Park, Times Square y la Estatua de la Libertad.',
    2199,
    2599,
    15,
    '5 días / 4 noches',
    4,
    'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=90',
    'cultural',
    4.7,
    267,
    ARRAY['Vuelos ida y vuelta', 'Hotel Manhattan', 'City Pass', 'Traslados'],
    ARRAY['Times Square', 'Central Park', 'Estatua Libertad', 'Brooklyn Bridge'],
    false,
    5
  );

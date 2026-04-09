-- ===========================================
-- ACTUALIZACIÓN: Agregar campos de detalle a packages
-- Ejecutar en Supabase SQL Editor
-- ===========================================

-- Agregar nuevos campos para información detallada del viaje
ALTER TABLE packages ADD COLUMN IF NOT EXISTS service_type TEXT DEFAULT 'paquete';
-- Opciones: 'paquete', 'vuelo', 'hospedaje', 'traslado', 'evento'

ALTER TABLE packages ADD COLUMN IF NOT EXISTS flight_type TEXT DEFAULT 'internacional';
-- Opciones: 'nacional', 'internacional'

ALTER TABLE packages ADD COLUMN IF NOT EXISTS flight_includes JSONB DEFAULT '{"roundTrip": true, "luggage": "23kg", "airline": ""}';
-- Información de vuelo

ALTER TABLE packages ADD COLUMN IF NOT EXISTS accommodation_type TEXT DEFAULT 'todo_incluido';
-- Opciones: 'todo_incluido', 'solo_desayuno', 'solo_hospedaje'

ALTER TABLE packages ADD COLUMN IF NOT EXISTS hotel_name TEXT DEFAULT '';
ALTER TABLE packages ADD COLUMN IF NOT EXISTS hotel_stars INTEGER DEFAULT 4;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS room_type TEXT DEFAULT 'Habitación Doble';

ALTER TABLE packages ADD COLUMN IF NOT EXISTS transfers_included JSONB DEFAULT '{"airport": true, "tours": false, "type": "privado"}';
-- Tipo de traslados incluidos

ALTER TABLE packages ADD COLUMN IF NOT EXISTS itinerary JSONB DEFAULT '[]';
-- Array de días: [{"day": 1, "title": "Llegada", "description": "...", "activities": [...]}]

ALTER TABLE packages ADD COLUMN IF NOT EXISTS important_info JSONB DEFAULT '{}';
-- Info importante: {"documents": "...", "weather": "...", "currency": "...", "language": "..."}

ALTER TABLE packages ADD COLUMN IF NOT EXISTS terms_conditions TEXT[] DEFAULT '{}';
-- Términos y condiciones

ALTER TABLE packages ADD COLUMN IF NOT EXISTS cancellation_policy TEXT DEFAULT '';
-- Política de cancelación

ALTER TABLE packages ADD COLUMN IF NOT EXISTS payment_options JSONB DEFAULT '{"deposit": 30, "methods": ["tarjeta", "transferencia"]}';
-- Opciones de pago

ALTER TABLE packages ADD COLUMN IF NOT EXISTS contact_whatsapp TEXT DEFAULT '';
-- WhatsApp de contacto

-- Actualizar paquetes existentes con información de ejemplo
UPDATE packages SET 
  service_type = 'paquete',
  flight_type = CASE 
    WHEN region IN ('Caribe', 'Norteamérica', 'Sudamérica') THEN 'internacional'
    ELSE 'internacional'
  END,
  flight_includes = '{"roundTrip": true, "luggage": "23kg", "airline": "Aeroméxico"}',
  accommodation_type = 'todo_incluido',
  hotel_stars = 5,
  hotel_name = CASE destination
    WHEN 'Cancún' THEN 'Grand Oasis Cancún'
    WHEN 'París' THEN 'Hotel Le Marais'
    WHEN 'Tokio' THEN 'Park Hyatt Tokyo'
    WHEN 'Cusco' THEN 'JW Marriott El Convento'
    WHEN 'Dubái' THEN 'Atlantis The Palm'
    WHEN 'Nueva York' THEN 'The Plaza Hotel'
    ELSE 'Hotel 5 Estrellas'
  END,
  room_type = 'Habitación Doble Vista al Mar',
  transfers_included = '{"airport": true, "tours": true, "type": "privado"}',
  itinerary = CASE destination
    WHEN 'Cancún' THEN '[
      {"day": 1, "title": "Llegada a Cancún", "description": "Recepción en aeropuerto y traslado al hotel. Check-in y tarde libre para disfrutar las instalaciones.", "meals": ["cena"]},
      {"day": 2, "title": "Día de Playa", "description": "Día completo para disfrutar la playa y actividades acuáticas del hotel.", "meals": ["desayuno", "almuerzo", "cena"]},
      {"day": 3, "title": "Chichén Itzá", "description": "Excursión a la zona arqueológica de Chichén Itzá, una de las 7 maravillas del mundo moderno.", "meals": ["desayuno", "almuerzo", "cena"]},
      {"day": 4, "title": "Isla Mujeres", "description": "Tour en catamarán a Isla Mujeres con snorkel y tiempo libre.", "meals": ["desayuno", "almuerzo", "cena"]},
      {"day": 5, "title": "Xcaret", "description": "Día completo en el parque eco-arqueológico Xcaret.", "meals": ["desayuno", "almuerzo", "cena"]},
      {"day": 6, "title": "Regreso", "description": "Desayuno, check-out y traslado al aeropuerto.", "meals": ["desayuno"]}
    ]'::jsonb
    ELSE '[
      {"day": 1, "title": "Llegada", "description": "Recepción en aeropuerto y traslado al hotel.", "meals": ["cena"]},
      {"day": 2, "title": "City Tour", "description": "Recorrido por los principales puntos de interés.", "meals": ["desayuno", "almuerzo"]},
      {"day": 3, "title": "Excursión", "description": "Visita guiada a lugares emblemáticos.", "meals": ["desayuno", "almuerzo"]},
      {"day": 4, "title": "Día Libre", "description": "Tiempo libre para explorar por cuenta propia.", "meals": ["desayuno"]},
      {"day": 5, "title": "Regreso", "description": "Check-out y traslado al aeropuerto.", "meals": ["desayuno"]}
    ]'::jsonb
  END,
  important_info = '{"documents": "Pasaporte vigente (6 meses mínimo)", "weather": "Clima tropical, 25-32°C", "currency": "USD / Moneda local", "language": "Español / Inglés", "timezone": "GMT-5"}'::jsonb,
  terms_conditions = ARRAY[
    'Precios por persona en base doble',
    'Sujeto a disponibilidad al momento de reservar',
    'Impuestos incluidos',
    'Seguro de viaje básico incluido',
    'No incluye propinas ni gastos personales'
  ],
  cancellation_policy = 'Cancelación gratuita hasta 30 días antes del viaje. Entre 29-15 días se retiene 50%. Menos de 15 días no reembolsable.',
  payment_options = '{"deposit": 30, "methods": ["Tarjeta de crédito", "Transferencia bancaria", "Pago en efectivo"], "financing": true}'::jsonb,
  contact_whatsapp = '+52 1 55 1234 5678'
WHERE id IS NOT NULL;

-- ============================================================
--  SIANNA TRAVEL — Seed inicial editable: FAQ + Links
--  Ejecutar DESPUÉS de 01_schema.sql. Todo esto se edita luego
--  desde el admin (sección "Bot / Automatización"). Ajusta los textos.
-- ============================================================

-- ---------- FAQ del bot (ejemplos base; edítalos en el admin) ----------
INSERT INTO faq (categoria, pregunta, respuesta, activo, orden) VALUES
  ('General',  '¿Quiénes son Sianna Travel?',
   'Somos una agencia de viajes en Tulancingo, Hidalgo. Diseñamos paquetes nacionales e internacionales con vuelo, hotel y experiencias.', true, 1),
  ('Reservas', '¿Cómo reservo un paquete?',
   'Puedes apartar tu lugar con un anticipo. Cuéntanos qué paquete te interesa y un asesor te guía con el proceso de reserva.', true, 2),
  ('Pagos',    '¿Qué formas de pago aceptan?',
   'Aceptamos transferencia y pago en efectivo. Para algunos paquetes hay opción de pago a meses; consúltalo con tu asesor.', true, 3),
  ('Pagos',    '¿Necesito dar anticipo?',
   'Sí, para apartar tu lugar se solicita un anticipo y el resto se liquida antes de la fecha de salida.', true, 4),
  ('Destinos', '¿Qué destinos manejan?',
   'Tenemos paquetes a destinos nacionales (Cancún, Riviera Maya, Barrancas del Cobre) e internacionales (Colombia, Argentina, Orlando y más). Pregúntame por uno en específico.', true, 5)
ON CONFLICT DO NOTHING;

-- ---------- Links / enlaces editables ----------
INSERT INTO links (clave, titulo, url, descripcion, activo, orden) VALUES
  ('web',       'Sitio web',   'https://www.siannatravelagencia.com',            'Página oficial', true, 1),
  ('paquetes',  'Paquetes',    'https://www.siannatravelagencia.com/paquetes',   'Catálogo de paquetes en la web', true, 2),
  ('ofertas',   'Ofertas',     'https://www.siannatravelagencia.com/ofertas',    'Promociones vigentes', true, 3),
  ('instagram', 'Instagram',   'https://instagram.com/',                         'Redes sociales (ajustar URL)', false, 4),
  ('facebook',  'Facebook',    'https://facebook.com/',                          'Redes sociales (ajustar URL)', false, 5)
ON CONFLICT (clave) DO NOTHING;

import express from 'express';
import cors from 'cors';
import compression from 'compression';

const app = express();
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10kb' }));

// ==========================================
// Paquetes reales de Sianna Travel
// ==========================================

const packages = [
  {
    id: 'barrancas-del-cobre',
    title: 'Barrancas del Cobre',
    destination: 'Chihuahua, México',
    country: 'México',
    region: 'Norte de México',
    category: 'aventura',
    flight_type: 'nacional',
    description: 'Descubre el Mar de Barrancas en la Sierra Tarahumara. A bordo del legendario Tren El Chepe, recorre uno de los cañones más profundos de México rodeado de naturaleza única.',
    price: 1450,
    original_price: 1799,
    discount: 19,
    currency: 'USD',
    duration: '5 noches / 6 días',
    nights: 5,
    includes: ['Vuelo redondo', 'Tren El Chepe', 'Hotel en Creel', 'Guía especializado', 'Visita a cascadas'],
    highlights: ['Barranca del Cobre', 'Creel', 'Tren El Chepe', 'Sierra Tarahumara'],
    is_featured: true,
    is_active: true,
    rating: 4.8,
    reviews_count: 127,
    image: '/images/packages/barranchadelcobre.png',
    itinerary_pdf: 'https://drive.google.com/file/d/10THWoFOvm9GDeB-EB-XNr8IpyoNmCbYa/view',
    order_index: 0,
  },
  {
    id: 'tren-paraiso-maya',
    title: 'Tren y Paraíso Maya',
    destination: 'Riviera Maya, México',
    country: 'México',
    region: 'Caribe',
    category: 'playa',
    flight_type: 'nacional',
    description: 'Recorre la Riviera Maya a bordo del moderno Tren Maya. Desde Cancún hasta Tulum, disfruta de cenotes turquesas, zonas arqueológicas y las playas más bellas del Caribe mexicano.',
    price: 1299,
    original_price: 1599,
    discount: 19,
    currency: 'USD',
    duration: '7 noches / 8 días',
    nights: 7,
    includes: ['Vuelo redondo', 'Pase Tren Maya', 'Hotel 5 estrellas All-Inclusive', 'Chichén Itzá', 'Tour cenotes'],
    highlights: ['Cancún', 'Tulum', 'Chichén Itzá', 'Cenotes'],
    is_featured: true,
    is_active: true,
    rating: 4.9,
    reviews_count: 213,
    image: '/images/packages/trenmaya.jpg',
    itinerary_pdf: 'https://drive.google.com/file/d/1xcJNxnJMxfwbsbc2jwKPaNA3RHafNSVG/view',
    order_index: 1,
  },
  {
    id: 'vamos-a-colombia',
    title: 'Vamos a Colombia',
    destination: 'Bogotá y Cartagena, Colombia',
    country: 'Colombia',
    region: 'Sudamérica',
    category: 'cultural',
    flight_type: 'internacional',
    description: 'De Bogotá a Cartagena, Colombia te enamora con su gente cálida, gastronomía colorida, café de altura, arquitectura colonial y el ritmo del Caribe.',
    price: 1599,
    original_price: 1999,
    discount: 20,
    currency: 'USD',
    duration: '7 noches / 8 días',
    nights: 7,
    includes: ['Vuelo redondo', 'Hotel boutique Cartagena', 'City tours', 'Tour del café', 'Islas del Rosario'],
    highlights: ['Cartagena', 'Bogotá', 'Café colombiano', 'Islas del Rosario'],
    is_featured: true,
    is_active: true,
    rating: 4.8,
    reviews_count: 98,
    image: '/images/packages/bogota.jpg',
    itinerary_pdf: 'https://drive.google.com/file/d/1AyUr-OcfJKiVEtBvNEngTOzuDQoXNde3/view',
    order_index: 2,
  },
  {
    id: 'orlando-verano-magico',
    title: 'Orlando Verano Mágico',
    destination: 'Orlando, Florida, EUA',
    country: 'Estados Unidos',
    region: 'Norteamérica',
    category: 'familia',
    flight_type: 'internacional',
    description: 'El verano más mágico de tu familia en los mejores parques del mundo. Disney World, Universal Studios, SeaWorld y más en una sola escapada inolvidable.',
    price: 1899,
    original_price: 2299,
    discount: 17,
    currency: 'USD',
    duration: '6 noches / 7 días',
    nights: 6,
    includes: ['Vuelo redondo', 'Hotel temático', 'Multi-park pass 4 parques', 'Traslados', 'Seguro familiar'],
    highlights: ['Disney World', 'Universal Studios', 'SeaWorld', 'LEGOLAND'],
    is_featured: true,
    is_active: true,
    rating: 4.9,
    reviews_count: 342,
    image: '/images/packages/Disney_Orlando_castle_at_night.jpg',
    itinerary_pdf: 'https://drive.google.com/file/d/1EyUMnItwTFynJ0DBCNf17Xk_BGacm8RS/view',
    order_index: 3,
  },
];

// ==========================================
// Utilidades
// ==========================================

function filterPackages(query) {
  let result = [...packages];
  if (query.type || query.category) {
    const cat = (query.type || query.category).toLowerCase();
    result = result.filter((p) => p.category === cat);
  }
  if (query.region) result = result.filter((p) => p.region === query.region);
  if (query.destination) {
    const d = query.destination.toLowerCase();
    result = result.filter((p) => p.destination.toLowerCase().includes(d));
  }
  if (query.minPrice) result = result.filter((p) => p.price >= Number(query.minPrice));
  if (query.maxPrice) result = result.filter((p) => p.price <= Number(query.maxPrice));
  if (query.featured === 'true') result = result.filter((p) => p.is_featured);
  if (query.sort === 'price_asc')  result.sort((a, b) => a.price - b.price);
  else if (query.sort === 'price_desc') result.sort((a, b) => b.price - a.price);
  else if (query.sort === 'rating') result.sort((a, b) => b.rating - a.rating);
  return result;
}

async function sendN8nWebhook(path, data) {
  const url = process.env.N8N_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(`${url}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, timestamp: new Date().toISOString(), source: 'siannatravel-web' }),
      signal: AbortSignal.timeout(10000),
    });
  } catch { /* non-blocking */ }
}

// ==========================================
// Rutas existentes
// ==========================================

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/packages', (req, res) => {
  const result = filterPackages(req.query);
  res.json({ data: result, count: result.length });
});

app.get('/api/packages/featured', (_req, res) => {
  const result = packages.filter((p) => p.is_featured && p.is_active);
  res.json({ data: result, count: result.length });
});

app.get('/api/packages/filters', (_req, res) => {
  const categories = [...new Set(packages.map((p) => p.category))];
  const regions    = [...new Set(packages.map((p) => p.region))];
  const priceRange = {
    min: Math.min(...packages.map((p) => p.price)),
    max: Math.max(...packages.map((p) => p.price)),
  };
  res.json({ data: { categories, regions, priceRange } });
});

app.get('/api/packages/:id', (req, res) => {
  const pkg = packages.find((p) => p.id === req.params.id);
  if (!pkg) return res.status(404).json({ error: 'Package not found' });
  res.json({ data: pkg });
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing required fields' });
  sendN8nWebhook('/contact', { event: 'contact_form_submitted', data: req.body });
  res.json({ success: true, message: 'Mensaje recibido. Nos pondremos en contacto pronto.' });
});

app.post('/api/contact/quote', (req, res) => {
  const { name, email, packageId } = req.body;
  if (!name || !email || !packageId) return res.status(400).json({ error: 'Missing required fields' });
  sendN8nWebhook('/quote', { event: 'quote_requested', data: req.body });
  res.json({ success: true, message: 'Solicitud de cotización recibida.' });
});

app.post('/api/contact/booking', (req, res) => {
  const { name, email, packageId, travelers } = req.body;
  if (!name || !email || !packageId || !travelers) return res.status(400).json({ error: 'Missing required fields' });
  sendN8nWebhook('/booking', { event: 'booking_initiated', data: req.body });
  res.json({ success: true, message: 'Reserva recibida.' });
});

app.get('/api/airlines', (_req, res) => {
  res.json({ data: [
    { id: 'aeromexico',            name: 'Aeroméxico',            code: 'AM' },
    { id: 'air-france',           name: 'Air France',            code: 'AF' },
    { id: 'latam',                name: 'LATAM Airlines',        code: 'LA' },
    { id: 'copa',                 name: 'Copa Airlines',         code: 'CM' },
    { id: 'ana',                  name: 'ANA',                   code: 'NH' },
    { id: 'aerolineas-argentinas',name: 'Aerolíneas Argentinas', code: 'AR' },
  ]});
});

// ==========================================
// ENDPOINT PARA SIANNABOT (WhatsApp / n8n)
// GET /api/bot/paquetes
// GET /api/bot/paquetes?q=colombia
// ==========================================
app.get('/api/bot/paquetes', (req, res) => {
  const { q } = req.query;

  const normalize = (str) =>
    (str || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  let resultado = packages.filter((p) => p.is_active);

  if (q && q.trim() !== '') {
    const query = normalize(q.trim());
    resultado = resultado.filter((pkg) => {
      const campos = [
        pkg.title,
        pkg.destination,
        pkg.country,
        pkg.region,
        pkg.category,
        pkg.description,
        ...(pkg.includes  || []),
        ...(pkg.highlights || []),
      ];
      return campos.some((c) => normalize(c).includes(query));
    });
  }

  const paquetes = resultado.map((pkg) => ({
    nombre:         pkg.title,
    destino:        pkg.destination,
    pais:           pkg.country,
    region:         pkg.region,
    categoria:      pkg.category,
    vuelo:          pkg.flight_type === 'nacional' ? 'Nacional' : 'Internacional',
    precio:         `$${Number(pkg.price).toLocaleString('es-MX')} USD`,
    precio_antes:   `$${Number(pkg.original_price).toLocaleString('es-MX')} USD`,
    descuento:      `${pkg.discount}% de descuento`,
    duracion:       pkg.duration,
    descripcion:    pkg.description,
    que_incluye:    Array.isArray(pkg.includes) ? pkg.includes.join(' | ') : '',
    destacados:     Array.isArray(pkg.highlights) ? pkg.highlights.join(', ') : '',
    calificacion:   `${pkg.rating} ⭐ (${pkg.reviews_count} reseñas)`,
    link:           `https://www.siannatravelagencia.com/paquetes/${pkg.id}`,
    pdf_itinerario: pkg.itinerary_pdf || '',
  }));

  res.json({
    ok:       true,
    total:    paquetes.length,
    consulta: q || 'todos',
    paquetes,
  });
});

export default app;

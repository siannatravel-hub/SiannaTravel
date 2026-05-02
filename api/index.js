import express from 'express';
import cors from 'cors';
import compression from 'compression';

// Create mini express app for serverless
const app = express();
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10kb' }));

// ---- Inline services (for serverless deployment) ----

const packages = [
  {
    id: 'cancun-all-inclusive',
    title: 'Cancún All Inclusive',
    destination: 'Cancún, México',
    country: 'México',
    region: 'Caribe',
    type: 'playa',
    price: 1299,
    currency: 'USD',
    duration: '5 noches / 6 días',
    dates: { start: '2026-06-15', end: '2026-06-20' },
    airline: 'Aeroméxico',
    hotel: 'Grand Oasis Cancún',
    hotelStars: 5,
    image: '/images/cancun.webp',
    gallery: [],
    description: 'Disfruta de las playas cristalinas de Cancún con todo incluido. Hospedaje de lujo, vuelos directos y actividades acuáticas.',
    benefits: ['Vuelo redondo incluido', 'Hotel 5 estrellas all-inclusive', 'Traslados aeropuerto-hotel', 'Snorkel y deportes acuáticos', 'Seguro de viaje'],
    featured: true,
    rating: 4.8,
    reviewCount: 234,
  },
  {
    id: 'paris-romantico',
    title: 'París Romántico',
    destination: 'París, Francia',
    country: 'Francia',
    region: 'Europa',
    type: 'cultural',
    price: 2499,
    currency: 'USD',
    duration: '7 noches / 8 días',
    dates: { start: '2026-07-01', end: '2026-07-08' },
    airline: 'Air France',
    hotel: 'Hôtel Le Marais',
    hotelStars: 4,
    image: '/images/paris.webp',
    gallery: [],
    description: 'Vive la magia de París con tours guiados, cenas gourmet y vistas inolvidables desde la Torre Eiffel.',
    benefits: ['Vuelo redondo incluido', 'Hotel boutique 4 estrellas', 'Tour por el Louvre y Versalles', 'Crucero por el Sena', 'Cena en restaurante gourmet', 'Seguro de viaje internacional'],
    featured: true,
    rating: 4.9,
    reviewCount: 189,
  },
  {
    id: 'machu-picchu-aventura',
    title: 'Aventura en Machu Picchu',
    destination: 'Cusco, Perú',
    country: 'Perú',
    region: 'Sudamérica',
    type: 'aventura',
    price: 1799,
    currency: 'USD',
    duration: '6 noches / 7 días',
    dates: { start: '2026-08-10', end: '2026-08-16' },
    airline: 'LATAM Airlines',
    hotel: 'Belmond Sanctuary Lodge',
    hotelStars: 5,
    image: '/images/machupicchu.webp',
    gallery: [],
    description: 'Explora la ciudadela inca de Machu Picchu con guías expertos, trekking por el Valle Sagrado y gastronomía peruana.',
    benefits: ['Vuelo redondo incluido', 'Hotel 5 estrellas en Cusco', 'Tren panorámico a Machu Picchu', 'Guía profesional bilingüe', 'Tour Valle Sagrado', 'Seguro de viaje'],
    featured: true,
    rating: 4.9,
    reviewCount: 312,
  },
  {
    id: 'punta-cana-familiar',
    title: 'Punta Cana Familiar',
    destination: 'Punta Cana, República Dominicana',
    country: 'República Dominicana',
    region: 'Caribe',
    type: 'playa',
    price: 1499,
    currency: 'USD',
    duration: '5 noches / 6 días',
    dates: { start: '2026-07-20', end: '2026-07-25' },
    airline: 'Copa Airlines',
    hotel: 'Barceló Bávaro Palace',
    hotelStars: 5,
    image: '/images/puntacana.webp',
    gallery: [],
    description: 'El destino perfecto para familias con playas paradisíacas, parques acuáticos y entretenimiento para todas las edades.',
    benefits: ['Vuelo redondo incluido', 'Resort all-inclusive familiar', 'Kids club y actividades infantiles', 'Parque acuático', 'Excursión a Isla Saona', 'Seguro de viaje familiar'],
    featured: false,
    rating: 4.7,
    reviewCount: 456,
  },
  {
    id: 'tokyo-moderno',
    title: 'Tokio Moderno',
    destination: 'Tokio, Japón',
    country: 'Japón',
    region: 'Asia',
    type: 'cultural',
    price: 3199,
    currency: 'USD',
    duration: '8 noches / 9 días',
    dates: { start: '2026-09-05', end: '2026-09-13' },
    airline: 'ANA',
    hotel: 'Park Hyatt Tokyo',
    hotelStars: 5,
    image: '/images/tokyo.webp',
    gallery: [],
    description: 'Sumérgete en la cultura japonesa: templos milenarios, tecnología de vanguardia, gastronomía y tradición.',
    benefits: ['Vuelo redondo incluido', 'Hotel 5 estrellas en Shinjuku', 'Japan Rail Pass 7 días', 'Tour guiado Tokio-Kioto', 'Experiencia gastronómica tradicional', 'Seguro de viaje internacional'],
    featured: true,
    rating: 4.8,
    reviewCount: 167,
  },
  {
    id: 'bariloche-nieve',
    title: 'Bariloche Nieve & Chocolate',
    destination: 'Bariloche, Argentina',
    country: 'Argentina',
    region: 'Sudamérica',
    type: 'aventura',
    price: 1599,
    currency: 'USD',
    duration: '5 noches / 6 días',
    dates: { start: '2026-07-15', end: '2026-07-20' },
    airline: 'Aerolíneas Argentinas',
    hotel: 'Llao Llao Resort',
    hotelStars: 5,
    image: '/images/bariloche.webp',
    gallery: [],
    description: 'Esquí, chocolate artesanal y paisajes de ensueño en la Patagonia argentina. Perfecto para parejas y familias.',
    benefits: ['Vuelo redondo incluido', 'Hotel 5 estrellas frente al lago', 'Pase de esquí 3 días', 'Tour de chocolaterías', 'Circuito Chico', 'Seguro de viaje'],
    featured: false,
    rating: 4.6,
    reviewCount: 198,
  },
];

function filterPackages(query) {
  let result = [...packages];
  if (query.type) result = result.filter((p) => p.type === query.type);
  if (query.region) result = result.filter((p) => p.region === query.region);
  if (query.destination) {
    const d = query.destination.toLowerCase();
    result = result.filter((p) => p.destination.toLowerCase().includes(d));
  }
  if (query.minPrice) result = result.filter((p) => p.price >= Number(query.minPrice));
  if (query.maxPrice) result = result.filter((p) => p.price <= Number(query.maxPrice));
  if (query.featured === 'true') result = result.filter((p) => p.featured);
  if (query.sort === 'price_asc') result.sort((a, b) => a.price - b.price);
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

// ---- Routes ----

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/packages', (req, res) => {
  const result = filterPackages(req.query);
  res.json({ data: result, count: result.length });
});

app.get('/api/packages/featured', (_req, res) => {
  const result = packages.filter((p) => p.featured);
  res.json({ data: result, count: result.length });
});

app.get('/api/packages/filters', (_req, res) => {
  const types = [...new Set(packages.map((p) => p.type))];
  const regions = [...new Set(packages.map((p) => p.region))];
  const priceRange = { min: Math.min(...packages.map((p) => p.price)), max: Math.max(...packages.map((p) => p.price)) };
  res.json({ data: { types, regions, priceRange } });
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
    { id: 'aeromexico', name: 'Aeroméxico', code: 'AM' },
    { id: 'air-france', name: 'Air France', code: 'AF' },
    { id: 'latam', name: 'LATAM Airlines', code: 'LA' },
    { id: 'copa', name: 'Copa Airlines', code: 'CM' },
    { id: 'ana', name: 'ANA', code: 'NH' },
    { id: 'aerolineas-argentinas', name: 'Aerolíneas Argentinas', code: 'AR' },
  ]});
});

// ============================================
// ENDPOINT PARA SIANNABOT (WhatsApp / n8n)
// GET /api/bot/paquetes?q=cancun
// ============================================
app.get('/api/bot/paquetes', (req, res) => {
  const { q } = req.query;

  // Normaliza texto: quita tildes y pasa a minúsculas
  const normalize = (str) =>
    (str || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  let resultado = [...packages];

  if (q && q.trim() !== '') {
    const query = normalize(q.trim());
    resultado = packages.filter((pkg) => {
      const campos = [
        pkg.title,
        pkg.destination,
        pkg.country,
        pkg.region,
        pkg.type,
        pkg.description,
        ...(pkg.benefits || []),
      ];
      return campos.some((c) => normalize(c).includes(query));
    });
  }

  const paquetes = resultado.map((pkg) => ({
    nombre:        pkg.title,
    destino:       pkg.destination,
    pais:          pkg.country,
    region:        pkg.region,
    tipo:          pkg.type,
    precio:        `desde $${Number(pkg.price).toLocaleString('es-MX')} ${pkg.currency || 'MXN'}`,
    duracion:      pkg.duration,
    fechas:        pkg.dates
                     ? `${pkg.dates.start} al ${pkg.dates.end}`
                     : 'Consultar disponibilidad',
    descripcion:   pkg.description,
    que_incluye:   Array.isArray(pkg.benefits) ? pkg.benefits.join(' | ') : '',
    aerolinea:     pkg.airline   || '',
    hotel:         pkg.hotel     || '',
    estrellas:     pkg.hotelStars || '',
    destacado:     pkg.featured  || false,
    calificacion:  pkg.rating    || '',
    link:          `https://www.siannatravelagencia.com/paquetes/${pkg.id}`,
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


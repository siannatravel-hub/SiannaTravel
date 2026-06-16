import { Router } from 'express';
import { query, withTransaction } from '../db.js';
import { pickAllowed, buildInsert, buildUpdate } from '../crud.js';

const ALLOWED = [
  'slug', 'title', 'destination', 'country', 'region', 'description', 'price',
  'original_price', 'discount', 'currency', 'duration', 'nights', 'image', 'gallery',
  'category', 'rating', 'reviews_count', 'includes', 'highlights', 'is_active',
  'is_featured', 'order_index', 'airline', 'flight_type', 'service_type', 'persons',
  'hotel_name', 'hotel_stars', 'room_type', 'accommodation_type', 'itinerary_pdf',
  'dates', 'contact_whatsapp', 'cancellation_policy', 'flight_includes',
  'transfers_included', 'itinerary', 'important_info', 'terms_conditions', 'payment_options',
];
const JSON_COLS = ['gallery', 'includes', 'highlights', 'flight_includes',
  'transfers_included', 'itinerary', 'important_info', 'terms_conditions', 'payment_options'];

function slugify(title) {
  return (title || 'paquete')
    .toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

// Busca un paquete por slug o por id numérico.
async function findPackage(idOrSlug) {
  const numeric = parseInt(idOrSlug, 10);
  if (!isNaN(numeric) && String(numeric) === String(idOrSlug)) {
    const { rows } = await query('SELECT * FROM packages WHERE id = $1', [numeric]);
    if (rows[0]) return rows[0];
  }
  const { rows } = await query('SELECT * FROM packages WHERE slug = $1', [idOrSlug]);
  return rows[0] || null;
}

// ====================== RUTAS PÚBLICAS (solo lectura) ======================
export const publicPackagesRouter = Router();

publicPackagesRouter.get('/', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM packages ORDER BY order_index ASC');
    let result = rows;
    const f = req.query;
    if (f.type || f.category) result = result.filter((p) => p.category === (f.type || f.category).toLowerCase());
    if (f.region) result = result.filter((p) => p.region === f.region);
    if (f.destination) result = result.filter((p) => (p.destination || '').toLowerCase().includes(f.destination.toLowerCase()));
    if (f.minPrice) result = result.filter((p) => p.price >= Number(f.minPrice));
    if (f.maxPrice) result = result.filter((p) => p.price <= Number(f.maxPrice));
    if (f.featured === 'true') result = result.filter((p) => p.is_featured);
    if (f.sort === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (f.sort === 'price_desc') result.sort((a, b) => b.price - a.price);
    else if (f.sort === 'rating') result.sort((a, b) => b.rating - a.rating);
    res.json({ data: result, count: result.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

publicPackagesRouter.get('/featured', async (_req, res) => {
  try {
    const { rows } = await query('SELECT * FROM packages WHERE is_featured = true AND is_active = true ORDER BY order_index ASC');
    res.json({ data: rows, count: rows.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

publicPackagesRouter.get('/filters', async (_req, res) => {
  try {
    const { rows } = await query('SELECT category, region, price FROM packages WHERE is_active = true');
    const categories = [...new Set(rows.map((p) => p.category).filter(Boolean))];
    const regions = [...new Set(rows.map((p) => p.region).filter(Boolean))];
    const prices = rows.map((p) => p.price).filter((n) => typeof n === 'number');
    res.json({ data: { categories, regions, priceRange: { min: Math.min(...prices, 0), max: Math.max(...prices, 0) } } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

publicPackagesRouter.get('/:id', async (req, res) => {
  try {
    const pkg = await findPackage(req.params.id);
    if (!pkg) return res.status(404).json({ error: 'Package not found' });
    res.json({ data: pkg });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ====================== RUTAS ADMIN (protegidas) ======================
export const adminPackagesRouter = Router();

adminPackagesRouter.get('/', async (_req, res) => {
  try {
    const { rows } = await query('SELECT * FROM packages ORDER BY order_index ASC');
    res.json({ data: rows, count: rows.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Reordenar (batch) — body: { orderedDbIds: [id1, id2, ...] }
adminPackagesRouter.post('/order', async (req, res) => {
  try {
    const ids = req.body?.orderedDbIds || [];
    await withTransaction(async (client) => {
      for (let i = 0; i < ids.length; i++) {
        await client.query('UPDATE packages SET order_index = $1 WHERE id = $2', [i, ids[i]]);
      }
    });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

adminPackagesRouter.get('/:id', async (req, res) => {
  try {
    const pkg = await findPackage(req.params.id);
    if (!pkg) return res.status(404).json({ error: 'No encontrado' });
    res.json({ data: pkg });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

adminPackagesRouter.get('/:id/history', async (req, res) => {
  try {
    const pkg = await findPackage(req.params.id);
    if (!pkg) return res.json({ data: [] });
    const { rows } = await query(
      'SELECT * FROM package_history WHERE package_id = $1 ORDER BY changed_at DESC LIMIT 3',
      [pkg.id]
    );
    res.json({ data: rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

adminPackagesRouter.post('/', async (req, res) => {
  try {
    const data = pickAllowed(req.body, ALLOWED);
    if (!data.slug) data.slug = slugify(data.title) + '-' + Date.now();
    const { text, params } = buildInsert('packages', data, JSON_COLS);
    const { rows } = await query(text, params);
    res.status(201).json({ data: rows[0] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

adminPackagesRouter.put('/:id', async (req, res) => {
  try {
    const current = await findPackage(req.params.id);
    if (!current) return res.status(404).json({ error: 'No encontrado' });
    const data = pickAllowed(req.body, ALLOWED);
    if (Object.keys(data).length === 0) return res.json({ data: current });

    // Historial: registrar cambios de campos escalares.
    const changedBy = req.admin?.email || 'admin';
    for (const [field, newVal] of Object.entries(data)) {
      if (JSON_COLS.includes(field)) continue;
      const oldVal = current[field];
      if (String(oldVal ?? '') !== String(newVal ?? '')) {
        await query(
          'INSERT INTO package_history (package_id, field_changed, old_value, new_value, changed_by) VALUES ($1,$2,$3,$4,$5)',
          [current.id, field, String(oldVal ?? ''), String(newVal ?? ''), changedBy]
        );
      }
    }

    const { text, params } = buildUpdate('packages', 'id', current.id, data, JSON_COLS);
    const { rows } = await query(text, params);
    res.json({ data: rows[0] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

adminPackagesRouter.delete('/:id', async (req, res) => {
  try {
    const pkg = await findPackage(req.params.id);
    if (!pkg) return res.json({ ok: true });
    await query('DELETE FROM packages WHERE id = $1', [pkg.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

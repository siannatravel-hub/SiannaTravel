import { Router } from 'express';
import { query } from '../db.js';
import { crudRouter } from '../crud.js';

const ALLOWED = ['title', 'destination', 'price', 'original_price', 'discount',
  'image', 'tag', 'nights', 'rating', 'link', 'order_index', 'itinerary_pdf'];

export const adminFeaturedRouter = crudRouter({
  table: 'featured_packages',
  allowed: ALLOWED,
  orderBy: 'order_index ASC',
});

export const publicFeaturedRouter = Router();
publicFeaturedRouter.get('/', async (_req, res) => {
  try {
    const { rows } = await query('SELECT * FROM featured_packages ORDER BY order_index ASC LIMIT 3');
    res.json({ data: rows, count: rows.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

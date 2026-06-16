import { Router } from 'express';
import { query } from '../db.js';
import { pickAllowed, buildInsert, buildUpdate } from '../crud.js';

const ALLOWED = ['title', 'slug', 'excerpt', 'cover_image', 'content', 'author', 'is_published', 'published_at'];

function slugify(title) {
  return (title || 'post')
    .toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ====================== PÚBLICO ======================
export const publicBlogRouter = Router();

publicBlogRouter.get('/', async (_req, res) => {
  try {
    const { rows } = await query('SELECT * FROM blog_posts WHERE is_published = true ORDER BY published_at DESC');
    res.json({ data: rows, count: rows.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

publicBlogRouter.get('/:slug', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM blog_posts WHERE slug = $1', [req.params.slug]);
    if (!rows[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json({ data: rows[0] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ====================== ADMIN ======================
export const adminBlogRouter = Router();

adminBlogRouter.get('/', async (_req, res) => {
  try {
    const { rows } = await query('SELECT * FROM blog_posts ORDER BY published_at DESC NULLS LAST');
    res.json({ data: rows, count: rows.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

adminBlogRouter.post('/', async (req, res) => {
  try {
    const data = pickAllowed(req.body, ALLOWED);
    if (!data.slug) data.slug = slugify(data.title);
    if (data.is_published === undefined) data.is_published = true;
    if (!data.published_at) data.published_at = new Date().toISOString();
    const { text, params } = buildInsert('blog_posts', data);
    const { rows } = await query(text, params);
    res.status(201).json({ data: rows[0] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

adminBlogRouter.put('/:id', async (req, res) => {
  try {
    const data = pickAllowed(req.body, ALLOWED);
    if (data.title && !data.slug) data.slug = slugify(data.title);
    if (Object.keys(data).length === 0) {
      const { rows } = await query('SELECT * FROM blog_posts WHERE id = $1', [req.params.id]);
      return res.json({ data: rows[0] || null });
    }
    const { text, params } = buildUpdate('blog_posts', 'id', req.params.id, data);
    const { rows } = await query(text, params);
    if (!rows[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json({ data: rows[0] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

adminBlogRouter.delete('/:id', async (req, res) => {
  try {
    await query('DELETE FROM blog_posts WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

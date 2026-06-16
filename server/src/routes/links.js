import { Router } from 'express';
import { query } from '../db.js';
import { crudRouter } from '../crud.js';

// Admin CRUD de enlaces editables.
export const adminLinksRouter = crudRouter({
  table: 'links',
  allowed: ['clave', 'titulo', 'url', 'descripcion', 'activo', 'orden'],
  orderBy: 'orden ASC, id ASC',
});

// Público: enlaces activos (para footer del sitio, etc.).
export const publicLinksRouter = Router();
publicLinksRouter.get('/', async (_req, res) => {
  try {
    const { rows } = await query('SELECT clave, titulo, url, descripcion FROM links WHERE activo = true ORDER BY orden ASC');
    res.json({ data: rows, count: rows.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

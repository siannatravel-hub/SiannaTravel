import { Router } from 'express';
import { query } from './db.js';

// Filtra el body dejando solo columnas permitidas (whitelist → sin inyección).
export function pickAllowed(body, allowed) {
  const out = {};
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(body, key)) out[key] = body[key];
  }
  return out;
}

// Construye un INSERT parametrizado. jsonCols se castean a ::jsonb.
export function buildInsert(table, data, jsonCols = []) {
  const keys = Object.keys(data);
  const cols = keys.map((k) => `"${k}"`).join(', ');
  const placeholders = keys
    .map((k, i) => (jsonCols.includes(k) ? `$${i + 1}::jsonb` : `$${i + 1}`))
    .join(', ');
  const params = keys.map((k) => (jsonCols.includes(k) ? JSON.stringify(data[k] ?? []) : data[k]));
  return { text: `INSERT INTO ${table} (${cols}) VALUES (${placeholders}) RETURNING *`, params };
}

// Construye un UPDATE parametrizado por id.
export function buildUpdate(table, idField, idVal, data, jsonCols = []) {
  const keys = Object.keys(data);
  const set = keys
    .map((k, i) => (jsonCols.includes(k) ? `"${k}" = $${i + 1}::jsonb` : `"${k}" = $${i + 1}`))
    .join(', ');
  const params = keys.map((k) => (jsonCols.includes(k) ? JSON.stringify(data[k] ?? []) : data[k]));
  params.push(idVal);
  return {
    text: `UPDATE ${table} SET ${set} WHERE "${idField}" = $${keys.length + 1} RETURNING *`,
    params,
  };
}

// Router CRUD genérico para tablas simples (faq, links, solicitudes, featured...).
// Se monta protegido bajo /api/admin/<recurso>.
export function crudRouter({ table, allowed, jsonCols = [], idField = 'id', orderBy = 'id ASC' }) {
  const router = Router();

  router.get('/', async (_req, res) => {
    try {
      const { rows } = await query(`SELECT * FROM ${table} ORDER BY ${orderBy}`);
      res.json({ data: rows, count: rows.length });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  router.get('/:id', async (req, res) => {
    try {
      const { rows } = await query(`SELECT * FROM ${table} WHERE "${idField}" = $1`, [req.params.id]);
      if (!rows[0]) return res.status(404).json({ error: 'No encontrado' });
      res.json({ data: rows[0] });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  router.post('/', async (req, res) => {
    try {
      const data = pickAllowed(req.body, allowed);
      if (Object.keys(data).length === 0) return res.status(400).json({ error: 'Sin campos válidos' });
      const { text, params } = buildInsert(table, data, jsonCols);
      const { rows } = await query(text, params);
      res.status(201).json({ data: rows[0] });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  router.put('/:id', async (req, res) => {
    try {
      const data = pickAllowed(req.body, allowed);
      if (Object.keys(data).length === 0) {
        const { rows } = await query(`SELECT * FROM ${table} WHERE "${idField}" = $1`, [req.params.id]);
        return res.json({ data: rows[0] || null });
      }
      const { text, params } = buildUpdate(table, idField, req.params.id, data, jsonCols);
      const { rows } = await query(text, params);
      if (!rows[0]) return res.status(404).json({ error: 'No encontrado' });
      res.json({ data: rows[0] });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  router.delete('/:id', async (req, res) => {
    try {
      await query(`DELETE FROM ${table} WHERE "${idField}" = $1`, [req.params.id]);
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  return router;
}

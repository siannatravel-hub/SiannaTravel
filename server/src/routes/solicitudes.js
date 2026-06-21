import { Router } from 'express';
import { query } from '../db.js';
import { crudRouter } from '../crud.js';

const crud = crudRouter({
  table: 'solicitudes',
  allowed: ['numero_whatsapp', 'nombre_cliente', 'correo', 'origen', 'numero_negocio',
    'tipo_servicio', 'descripcion', 'estado', 'prioridad', 'asesor', 'ultimo_mensaje',
    'seguimiento_enviado', 'bot_pausado', 'fecha_pausa_bot', 'intencion_compra', 'fecha_hora', 'leido'],
  orderBy: 'fecha_hora DESC NULLS LAST, id DESC',
});

const extra = Router();

extra.get('/unread-count', async (_req, res) => {
  try {
    const { rows } = await query("SELECT COUNT(*)::int AS count FROM solicitudes WHERE leido = false");
    res.json({ count: rows[0].count });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

extra.put('/mark-read', async (_req, res) => {
  try {
    await query("UPDATE solicitudes SET leido = true WHERE leido = false");
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

extra.use('/', crud);

export const adminSolicitudesRouter = extra;

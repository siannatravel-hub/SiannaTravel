import { Router } from 'express';
import { query } from '../db.js';

// Endpoints para el bot (n8n). Mantienen el MISMO formato que el endpoint
// anterior de Supabase, para que el flujo de n8n siga funcionando sin cambios
// durante la transición. (Más adelante n8n puede consultar Postgres directo.)
export const botRouter = Router();

const normalize = (str) => (str || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

botRouter.get('/paquetes', async (req, res) => {
  try {
    const { q } = req.query;
    const { rows } = await query('SELECT * FROM packages WHERE is_active = true ORDER BY order_index ASC');
    let resultado = rows;

    if (q && q.trim() !== '') {
      const needle = normalize(q.trim());
      resultado = resultado.filter((pkg) => {
        const campos = [pkg.title, pkg.destination, pkg.country, pkg.region, pkg.category,
          pkg.description, ...(pkg.includes || []), ...(pkg.highlights || [])];
        return campos.some((c) => normalize(c).includes(needle));
      });
    }

    const paquetes = resultado.map((pkg) => ({
      nombre: pkg.title,
      destino: pkg.destination,
      pais: pkg.country,
      region: pkg.region,
      categoria: pkg.category,
      vuelo: pkg.flight_type === 'nacional' ? 'Nacional' : 'Internacional',
      precio: `$${Number(pkg.price).toLocaleString('es-MX')} ${pkg.currency || 'USD'}`,
      precio_antes: `$${Number(pkg.original_price).toLocaleString('es-MX')} ${pkg.currency || 'USD'}`,
      descuento: `${pkg.discount}% de descuento`,
      duracion: pkg.duration,
      descripcion: pkg.description,
      que_incluye: Array.isArray(pkg.includes) ? pkg.includes.join(' | ') : '',
      destacados: Array.isArray(pkg.highlights) ? pkg.highlights.join(', ') : '',
      calificacion: `${pkg.rating} ⭐ (${pkg.reviews_count} reseñas)`,
      link: `https://www.siannatravelagencia.com/paquetes/${pkg.slug || pkg.id}`,
      pdf_itinerario: pkg.itinerary_pdf || '',
    }));

    res.json({ ok: true, total: paquetes.length, consulta: q || 'todos', fuente: 'postgres', paquetes });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

botRouter.get('/faq', async (_req, res) => {
  try {
    const { rows } = await query('SELECT categoria, pregunta, respuesta FROM faq WHERE activo = true ORDER BY orden ASC');
    res.json({ ok: true, total: rows.length, faqs: rows });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

botRouter.get('/links', async (_req, res) => {
  try {
    const { rows } = await query('SELECT clave, titulo, url, descripcion FROM links WHERE activo = true ORDER BY orden ASC');
    res.json({ ok: true, total: rows.length, links: rows });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// Upsert de solicitud/lead capturado por el agente IA (sin auth — solo el bot llama esto)
botRouter.post('/ticket', async (req, res) => {
  try {
    const { numero_whatsapp, nombre_cliente, estado, intencion_compra, descripcion, ultimo_mensaje } = req.body;
    if (!numero_whatsapp) return res.status(400).json({ ok: false, error: 'numero_whatsapp requerido' });
    const { rows } = await query(
      `INSERT INTO solicitudes (numero_whatsapp, nombre_cliente, estado, intencion_compra, descripcion, ultimo_mensaje, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       ON CONFLICT (numero_whatsapp) DO UPDATE SET
         nombre_cliente    = COALESCE(NULLIF($2, ''), solicitudes.nombre_cliente),
         estado            = COALESCE(NULLIF($3, ''), solicitudes.estado),
         intencion_compra  = CASE WHEN $4 IS NOT NULL THEN $4 ELSE solicitudes.intencion_compra END,
         descripcion       = COALESCE(NULLIF($5, ''), solicitudes.descripcion),
         ultimo_mensaje    = COALESCE(NULLIF($6, ''), solicitudes.ultimo_mensaje),
         updated_at        = NOW()
       RETURNING id`,
      [numero_whatsapp, nombre_cliente || '', estado || 'Nuevo', intencion_compra ?? null, descripcion || '', ultimo_mensaje || '']
    );
    res.json({ ok: true, id: rows[0]?.id });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

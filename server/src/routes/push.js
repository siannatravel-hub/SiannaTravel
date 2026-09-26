import { Router } from 'express';
import { timingSafeEqual } from 'crypto';
import { query } from '../db.js';
import config from '../config.js';
import { enviarALead, enviarASuscripcion } from '../push.js';

const recortar = (v, max) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

function claveBotValida(dada) {
  const a = Buffer.from(String(dada || ''));
  const b = Buffer.from(config.botApiKey);
  return a.length === b.length && timingSafeEqual(a, b);
}

// ---------- Admin (requireAuth se aplica en index.js) ----------
export const adminPushRouter = Router();

// La llave pública VAPID no es secreta; se sirve en runtime para no depender
// de variables de build.
adminPushRouter.get('/vapid-public-key', (_req, res) => {
  res.json({ publicKey: config.vapid.publicKey || null });
});

adminPushRouter.post('/subscribe', async (req, res) => {
  const { endpoint, keys } = req.body || {};
  if (
    typeof endpoint !== 'string' || !endpoint.startsWith('https://') || endpoint.length > 1000 ||
    typeof keys?.p256dh !== 'string' || typeof keys?.auth !== 'string'
  ) {
    return res.status(400).json({ error: 'Suscripción inválida' });
  }

  try {
    const { rows } = await query(
      `INSERT INTO push_subscriptions (usuario_id, endpoint, p256dh, auth)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (endpoint) DO UPDATE
         SET usuario_id = EXCLUDED.usuario_id, p256dh = EXCLUDED.p256dh, auth = EXCLUDED.auth
       RETURNING (xmax = 0) AS nueva`,
      [req.admin.id, endpoint, keys.p256dh, keys.auth]
    );
    res.json({ ok: true });

    // Aviso de bienvenida solo la primera vez que se registra ese dispositivo.
    if (rows[0]?.nueva) {
      enviarASuscripcion(
        { endpoint, p256dh: keys.p256dh, auth: keys.auth },
        {
          title: 'Notificaciones activadas ✅',
          body: 'Aquí te avisaremos cuando llegue un lead nuevo.',
          url: '/admin/solicitudes',
          tag: 'bienvenida',
        }
      ).catch(() => {});
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ---------- Bot (n8n) ----------
// POST /api/bot/notificar  (header x-bot-key)
// { asesora, nombre_cliente, telefono, motivo, vip }
export const botNotifyRouter = Router();

botNotifyRouter.post('/', async (req, res) => {
  if (!config.botApiKey) {
    return res.status(503).json({ ok: false, error: 'BOT_API_KEY no está configurada en el servidor' });
  }
  if (!claveBotValida(req.get('x-bot-key'))) {
    return res.status(401).json({ ok: false, error: 'No autorizado' });
  }

  const asesora = recortar(req.body?.asesora, 40) || 'asesora';
  const nombre = recortar(req.body?.nombre_cliente, 60) || 'Cliente';
  const telefono = recortar(req.body?.telefono, 25);
  const motivo = recortar(req.body?.motivo, 60);
  const vip = req.body?.vip === true || req.body?.vip === 'true';

  try {
    const resultado = await enviarALead(asesora, {
      title: `${vip ? '⭐ Lead VIP' : 'Nuevo lead'} · ${asesora}`,
      body: [nombre + (telefono ? ` · ${telefono}` : ''), motivo].filter(Boolean).join(' — '),
      url: '/admin/solicitudes',
      tag: telefono ? `lead-${telefono}` : undefined,
    });
    res.json({ ok: true, ...resultado });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

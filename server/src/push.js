import webpush from 'web-push';
import { query } from './db.js';
import config from './config.js';

let configurado = false;

function asegurarConfig() {
  if (configurado) return;
  const { publicKey, privateKey, subject } = config.vapid;
  if (!publicKey || !privateKey) {
    throw new Error('VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY no están configuradas.');
  }
  webpush.setVapidDetails(subject, publicKey, privateKey);
  configurado = true;
}

const normalizar = (s) =>
  String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');

// Los usuarios sin "asesora" (admin, supervisión) reciben todas las alertas;
// los que la tienen asignada reciben solo las suyas.
export function filtrarDestinatarios(filas, asesora) {
  const objetivo = normalizar(asesora);
  return filas.filter((f) => !f.asesora || normalizar(f.asesora) === objetivo);
}

// Envía a UNA suscripción. Devuelve true si el push service la aceptó.
export async function enviarASuscripcion(sub, payload) {
  asegurarConfig();
  try {
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      JSON.stringify(payload),
      { TTL: 60 * 60 * 12, urgency: 'high' }
    );
    return true;
  } catch (err) {
    // 404/410: el navegador revocó la suscripción -> se limpia.
    if (err?.statusCode === 404 || err?.statusCode === 410) {
      await query('DELETE FROM push_subscriptions WHERE endpoint = $1', [sub.endpoint]);
    }
    return false;
  }
}

// Avisa de un lead a la asesora asignada (y a los usuarios sin asesora).
export async function enviarALead(asesora, payload) {
  asegurarConfig();
  const { rows } = await query(
    `SELECT s.endpoint, s.p256dh, s.auth, u.asesora
       FROM push_subscriptions s
       JOIN admin_users u ON u.id = s.usuario_id
      WHERE u.activo = true`
  );
  const destinos = filtrarDestinatarios(rows, asesora);
  const resultados = await Promise.all(destinos.map((s) => enviarASuscripcion(s, payload)));
  return { enviados: resultados.filter(Boolean).length, destinatarios: destinos.length, total: rows.length };
}

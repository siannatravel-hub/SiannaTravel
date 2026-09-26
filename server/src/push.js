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

// Envía a todos los dispositivos suscritos del admin.
export async function enviarATodos(payload) {
  asegurarConfig();
  const { rows } = await query('SELECT endpoint, p256dh, auth FROM push_subscriptions');
  const resultados = await Promise.all(rows.map((s) => enviarASuscripcion(s, payload)));
  return { enviados: resultados.filter(Boolean).length, total: rows.length };
}

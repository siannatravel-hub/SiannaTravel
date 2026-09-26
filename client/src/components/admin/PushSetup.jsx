import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../../lib/apiClient';
import styles from './PushSetup.module.css';

const SW_URL = '/admin-sw.js';
const SW_SCOPE = '/admin';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

const esIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
const esStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const registrarSW = () => navigator.serviceWorker.register(SW_URL, { scope: SW_SCOPE });

export default function PushSetup() {
  const [estado, setEstado] = useState('cargando');
  const [error, setError] = useState(null);

  useEffect(() => {
    let vivo = true;
    async function revisar() {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        if (vivo) setEstado('no-soportado');
        return;
      }
      // Safari en iOS solo soporta push con la app agregada a la pantalla de inicio.
      if (esIOS() && !esStandalone()) {
        if (vivo) setEstado('ios');
        return;
      }
      if (Notification.permission === 'denied') {
        if (vivo) setEstado('denegado');
        return;
      }
      try {
        const reg = await registrarSW();
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          // Una vez por sesión: mantiene el servidor sincronizado sin repetir el aviso de bienvenida.
          try {
            if (!sessionStorage.getItem('sianna_push_sync')) {
              sessionStorage.setItem('sianna_push_sync', '1');
              apiPost('/admin/push/subscribe', sub.toJSON()).catch(() => {});
            }
          } catch { /* sessionStorage no disponible */ }
        }
        if (vivo) setEstado(sub ? 'activo' : 'activar');
      } catch {
        if (vivo) setEstado('no-soportado');
      }
    }
    revisar();
    return () => { vivo = false; };
  }, []);

  async function activar() {
    setEstado('activando');
    setError(null);
    try {
      const { publicKey } = await apiGet('/admin/push/vapid-public-key');
      if (!publicKey) throw new Error('Las notificaciones no están configuradas en el servidor.');

      const permiso = await Notification.requestPermission();
      if (permiso !== 'granted') {
        setEstado('denegado');
        return;
      }

      const reg = await registrarSW();
      await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
      await apiPost('/admin/push/subscribe', sub.toJSON());
      setEstado('activo');
    } catch (err) {
      setEstado('error');
      setError(err instanceof Error ? err.message : 'No se pudo activar. Intenta de nuevo.');
    }
  }

  if (['cargando', 'no-soportado', 'activo'].includes(estado)) return null;

  let mensaje = 'Activa las notificaciones para enterarte al instante cuando llegue un lead.';
  if (estado === 'denegado') {
    mensaje = 'Bloqueaste las notificaciones. Actívalas desde el candado junto a la URL del navegador.';
  } else if (estado === 'ios') {
    mensaje = 'En iPhone: toca Compartir → Agregar a inicio y abre el panel desde ahí para activar las notificaciones.';
  } else if (estado === 'error') {
    mensaje = error;
  }

  const puedeActivar = estado === 'activar' || estado === 'error' || estado === 'activando';

  return (
    <div className={styles.banner} role="status">
      <span className={styles.icon} aria-hidden="true">🔔</span>
      <p className={`${styles.text} ${estado === 'error' ? styles.textError : ''}`}>{mensaje}</p>
      {puedeActivar && (
        <button type="button" className={styles.btn} onClick={activar} disabled={estado === 'activando'}>
          {estado === 'activando' ? 'Activando…' : estado === 'error' ? 'Reintentar' : 'Activar'}
        </button>
      )}
    </div>
  );
}

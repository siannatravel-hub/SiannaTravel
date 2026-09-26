// Service worker SOLO del panel admin (scope /admin). No cachea ni intercepta
// peticiones: únicamente recibe notificaciones push. El sitio público no lo registra.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

// Listener vacío: algunos navegadores lo exigen para ofrecer "Instalar app".
self.addEventListener('fetch', () => {});

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : '' };
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'Sianna Admin', {
      body: data.body || 'Tienes una novedad en el panel.',
      icon: '/admin-icons/icon-192.png',
      badge: '/admin-icons/badge-96.png',
      tag: data.tag || undefined,
      renotify: !!data.tag,
      data: { url: data.url || '/admin/solicitudes' },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const destino = new URL(event.notification.data?.url || '/admin/solicitudes', self.location.origin).href;

  event.waitUntil(
    (async () => {
      const ventanas = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const ventana of ventanas) {
        if (new URL(ventana.url).pathname.startsWith('/admin')) {
          const actual = await ventana.navigate(destino).catch(() => ventana);
          return (actual || ventana).focus();
        }
      }
      return self.clients.openWindow(destino);
    })()
  );
});

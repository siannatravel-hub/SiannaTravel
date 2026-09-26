import { useEffect } from 'react';

// Enlaza el manifest de la app SOLO mientras se está en el admin, para que el
// navegador ofrezca instalar el panel y no el sitio público.
export default function useAdminManifest() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = '/admin.webmanifest';
    document.head.appendChild(link);

    const theme = document.querySelector('meta[name="theme-color"]');
    const themeAnterior = theme?.getAttribute('content');
    theme?.setAttribute('content', '#0f2847');

    return () => {
      link.remove();
      if (theme && themeAnterior) theme.setAttribute('content', themeAnterior);
    };
  }, []);
}

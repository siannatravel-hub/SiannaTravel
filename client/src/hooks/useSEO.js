import { useEffect } from 'react';

const BASE_URL = 'https://siannatravel.com';
const DEFAULT_IMAGE = `${BASE_URL}/images/logos/logo.png`;
const SITE_NAME = 'Sianna Travel';

/**
 * Hook para inyectar meta tags SEO dinámicos por página.
 * Actualiza <title>, description, canonical, OG y Twitter cards.
 */
export function useSEO({
  title,
  description,
  image,
  url,
  type = 'website',
  schema = null,
}) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | ${SITE_NAME}`
      : `${SITE_NAME} – Agencia de Viajes en Tulancingo | Tours y Paquetes`;
    const fullUrl = url ? `${BASE_URL}${url}` : BASE_URL;
    const ogImage = image || DEFAULT_IMAGE;
    const desc =
      description ||
      'Agencia de viajes en Tulancingo, Hidalgo. Tours turísticos, paquetes vacacionales y experiencias únicas por México y el mundo.';

    // Title
    document.title = fullTitle;

    // Helpers
    const setMeta = (selector, attr, value) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const [attrName, attrVal] = attr.split('=');
        el.setAttribute(attrName, attrVal.replace(/"/g, ''));
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // Standard
    setMeta('meta[name="description"]', 'name=description', desc);

    // Canonical
    setLink('canonical', fullUrl);

    // Open Graph
    setMeta('meta[property="og:title"]', 'property=og:title', fullTitle);
    setMeta('meta[property="og:description"]', 'property=og:description', desc);
    setMeta('meta[property="og:url"]', 'property=og:url', fullUrl);
    setMeta('meta[property="og:image"]', 'property=og:image', ogImage);
    setMeta('meta[property="og:type"]', 'property=og:type', type);

    // Twitter
    setMeta('meta[name="twitter:title"]', 'name=twitter:title', fullTitle);
    setMeta('meta[name="twitter:description"]', 'name=twitter:description', desc);
    setMeta('meta[name="twitter:url"]', 'name=twitter:url', fullUrl);
    setMeta('meta[name="twitter:image"]', 'name=twitter:image', ogImage);

    // JSON-LD schema
    const schemaId = 'dynamic-schema-ld';
    let schemaEl = document.getElementById(schemaId);
    if (schema) {
      if (!schemaEl) {
        schemaEl = document.createElement('script');
        schemaEl.id = schemaId;
        schemaEl.type = 'application/ld+json';
        document.head.appendChild(schemaEl);
      }
      schemaEl.textContent = JSON.stringify(schema);
    } else if (schemaEl) {
      schemaEl.remove();
    }

    // Cleanup: restore defaults on unmount
    return () => {
      document.title = `${SITE_NAME} – Agencia de Viajes en Tulancingo | Tours y Paquetes`;
    };
  }, [title, description, image, url, type, schema]);
}

import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';

// ==========================================
// Datos por defecto (fallback si el backend no responde)
// ==========================================
const DEFAULT_PACKAGES = [
  {
    id: 'barrancas-del-cobre', title: 'Barrancas del Cobre', destination: 'Chihuahua, México',
    country: 'México', region: 'Norte de México',
    description: 'Descubre el Mar de Barrancas en la Sierra Tarahumara a bordo del Tren El Chepe.',
    price: 1450, original_price: 1799, discount: 19, duration: '5 noches / 6 días', nights: 5,
    image: '/images/packages/barranchadelcobre.png', category: 'aventura', rating: 4.8, reviews_count: 127,
    includes: [], highlights: [], is_featured: true, is_active: true, order_index: 0,
    flight_type: 'nacional', itinerary_pdf: '',
  },
  {
    id: 'tren-paraiso-maya', title: 'Tren y Paraíso Maya', destination: 'Riviera Maya, México',
    country: 'México', region: 'Caribe',
    description: 'Recorre la Riviera Maya a bordo del moderno Tren Maya.',
    price: 1299, original_price: 1599, discount: 19, duration: '7 noches / 8 días', nights: 7,
    image: '/images/packages/trenmaya.jpg', category: 'playa', rating: 4.9, reviews_count: 213,
    includes: [], highlights: [], is_featured: true, is_active: true, order_index: 1,
    flight_type: 'nacional', itinerary_pdf: '',
  },
];

// Normaliza: usa slug como id para enrutar, conserva el id numérico en _db_id.
const norm = (p) => ({ ...p, _db_id: p.id, id: p.slug || String(p.id) });

// ==========================================
// Lectura
// ==========================================
export async function getPackages() {
  try {
    const { data } = await apiGet('/packages');
    const list = (data || [])
      .filter((p) => p.title && p.title.trim() !== '' && p.title !== 'undefined')
      .map(norm);
    return list.length > 0 ? list : DEFAULT_PACKAGES;
  } catch (e) {
    console.warn('Error fetching packages, using defaults:', e.message);
    return DEFAULT_PACKAGES;
  }
}

export async function getPackageById(id) {
  try {
    const { data } = await apiGet(`/packages/${id}`);
    return data ? norm(data) : (DEFAULT_PACKAGES.find((p) => p.id === id) || null);
  } catch (e) {
    console.warn('Error fetching package, searching defaults:', e.message);
    return DEFAULT_PACKAGES.find((p) => p.id === id) || null;
  }
}

// ==========================================
// Escritura (requiere sesión admin)
// ==========================================
export async function createPackage(data) {
  const { data: created } = await apiPost('/admin/packages', data);
  return created ? norm(created) : null;
}

export async function updatePackage(id, updates) {
  const { data } = await apiPut(`/admin/packages/${id}`, updates);
  return data ? norm(data) : null;
}

export async function deletePackage(id) {
  await apiDelete(`/admin/packages/${id}`);
  return true;
}

export function togglePackageStatus(id, isActive) {
  return updatePackage(id, { is_active: isActive });
}

export function togglePackageFeatured(id, isFeatured) {
  return updatePackage(id, { is_featured: isFeatured });
}

// Reordena (batch). orderedDbIds: array de _db_id en el orden deseado.
export async function updatePackagesOrder(orderedDbIds) {
  await apiPost('/admin/packages/order', { orderedDbIds });
}

// ==========================================
// Historial (el backend registra los cambios al actualizar)
// ==========================================
export async function getPackageHistory(packageId) {
  try {
    const { data } = await apiGet(`/admin/packages/${packageId}/history`);
    return data || [];
  } catch {
    return [];
  }
}

// Compatibilidad: el historial ahora se registra en el backend al hacer update.
export async function addToHistory() { /* no-op */ }

// Compatibilidad: los datos ya viven en Postgres.
export async function initializePackages() { return getPackages(); }
export async function syncDefaultsToDatabase() { return []; }

// Etiquetas de campos para el historial
export const fieldLabels = {
  title: 'Título', destination: 'Destino', country: 'País', region: 'Región',
  description: 'Descripción', price: 'Precio', original_price: 'Precio Original',
  discount: 'Descuento', price_unit: 'Precio Por', duration: 'Duración', nights: 'Noches', image: 'Imagen',
  category: 'Categoría', rating: 'Calificación', reviews_count: 'N° Reseñas',
  is_active: 'Estado', is_featured: 'Destacado', airline: 'Aerolínea',
  flight_type: 'Tipo de Vuelo', service_type: 'Tipo de Servicio', persons: 'Personas (adultos)', children: 'Niños',
  hotel_name: 'Hotel', hotel_stars: 'Estrellas Hotel', room_type: 'Tipo de Habitación',
  accommodation_type: 'Régimen', itinerary_pdf: 'Itinerario PDF', dates: 'Fechas / Salidas',
  contact_whatsapp: 'WhatsApp', cancellation_policy: 'Política de Cancelación',
  includes: 'Incluye', gallery: 'Galería', flight_includes: 'Incluye en Vuelo',
  transfers_included: 'Traslados', itinerary: 'Itinerario', important_info: 'Info del Destino',
  terms_conditions: 'Términos y Condiciones', payment_options: 'Formas de Pago',
};

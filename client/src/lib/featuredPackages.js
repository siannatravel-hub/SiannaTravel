import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';

// Destacados por defecto (fallback si el backend no responde)
const DEFAULT_FEATURED = [
  { id: 'orlando-verano-magico', title: 'Orlando Verano Mágico', destination: 'Orlando, Florida, EUA',
    price: 1899, original_price: 2299, discount: 17, image: '/images/packages/Disney_Orlando_castle_at_night.jpg',
    tag: 'Familia', nights: 6, rating: 4.9, itinerary_pdf: '' },
  { id: 'barrancas-del-cobre', title: 'Barrancas del Cobre', destination: 'Chihuahua, México',
    price: 1450, original_price: 1799, discount: 19, image: '/images/packages/barranchadelcobre.png',
    tag: 'Aventura', nights: 5, rating: 4.8, itinerary_pdf: '' },
  { id: 'tren-paraiso-maya', title: 'Tren y Paraíso Maya', destination: 'Riviera Maya, México',
    price: 1299, original_price: 1599, discount: 19, image: '/images/packages/trenmaya.jpg',
    tag: 'Más Vendido', nights: 7, rating: 4.9, itinerary_pdf: '' },
];

export async function getFeaturedPackages() {
  try {
    const { data } = await apiGet('/featured');
    return { data: data && data.length > 0 ? data : DEFAULT_FEATURED, error: null };
  } catch (error) {
    console.error('Error fetching featured packages:', error);
    return { data: DEFAULT_FEATURED, error };
  }
}

export async function updateFeaturedPackage(id, updates) {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    return { error: { message: 'El paquete aún no existe en la base de datos. Guarda primero para crearlo.' } };
  }
  try {
    const { data } = await apiPut(`/admin/featured/${numericId}`, updates);
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createFeaturedPackage(packageData) {
  try {
    const { data } = await apiPost('/admin/featured', packageData);
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteFeaturedPackage(id) {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return { error: null };
  try {
    await apiDelete(`/admin/featured/${numericId}`);
    return { error: null };
  } catch (error) {
    return { error };
  }
}

// Compatibilidad (los datos ya viven en Postgres)
export async function initializeFeaturedPackages() { return { message: 'Datos en Postgres' }; }
export async function syncDefaultFeaturedToDatabase() { return { data: [], error: null }; }

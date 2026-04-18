import { supabase, isSupabaseConfigured } from './supabase';

// ==========================================
// Datos por defecto cuando no hay conexión a Supabase
// ==========================================

const DEFAULT_PACKAGES = [
  {
    id: 'barrancas-del-cobre',
    title: 'Barrancas del Cobre',
    destination: 'Chihuahua, México',
    country: 'México',
    region: 'Norte de México',
    description: 'Descubre el Mar de Barrancas en la Sierra Tarahumara. A bordo del legendario Tren El Chepe, recorre uno de los cañones más profundos de México rodeado de naturaleza única.',
    price: 1450,
    original_price: 1799,
    discount: 19,
    duration: '5 noches / 6 días',
    nights: 5,
    image: '/images/packages/barranchadelcobre.png',
    category: 'aventura',
    rating: 4.8,
    reviews_count: 127,
    includes: ['Vuelo redondo', 'Tren El Chepe', 'Hotel en Creel', 'Guía especializado', 'Visita a cascadas'],
    highlights: ['Barranca del Cobre', 'Creel', 'Tren El Chepe', 'Sierra Tarahumara'],
    is_featured: true,
    is_active: true,
    order_index: 0,
    flight_type: 'nacional',
    itinerary_pdf: 'https://drive.google.com/file/d/10THWoFOvm9GDeB-EB-XNr8IpyoNmCbYa/view',
  },
  {
    id: 'tren-paraiso-maya',
    title: 'Tren y Paraíso Maya',
    destination: 'Riviera Maya, México',
    country: 'México',
    region: 'Caribe',
    description: 'Recorre la Riviera Maya a bordo del moderno Tren Maya. Desde Cancún hasta Tulum, disfruta de cenotes turquesas, zonas arqueológicas y las playas más bellas del Caribe mexicano.',
    price: 1299,
    original_price: 1599,
    discount: 19,
    duration: '7 noches / 8 días',
    nights: 7,
    image: '/images/packages/trenmaya.jpg',
    category: 'playa',
    rating: 4.9,
    reviews_count: 213,
    includes: ['Vuelo redondo', 'Pase Tren Maya', 'Hotel 5 estrellas All-Inclusive', 'Chichén Itzá', 'Tour cenotes'],
    highlights: ['Cancún', 'Tulum', 'Chichén Itzá', 'Cenotes'],
    is_featured: true,
    is_active: true,
    order_index: 1,
    flight_type: 'nacional',
    itinerary_pdf: 'https://drive.google.com/file/d/1xcJNxnJMxfwbsbc2jwKPaNA3RHafNSVG/view',
  },
  {
    id: 'vamos-a-colombia',
    title: 'Vamos a Colombia',
    destination: 'Bogotá y Cartagena, Colombia',
    country: 'Colombia',
    region: 'Sudamérica',
    description: 'De Bogotá a Cartagena, Colombia te enamora con su gente cálida, gastronomía colorida, café de altura, arquitectura colonial y el ritmo del Caribe.',
    price: 1599,
    original_price: 1999,
    discount: 20,
    duration: '7 noches / 8 días',
    nights: 7,
    image: '/images/packages/bogota.jpg',
    category: 'cultural',
    rating: 4.8,
    reviews_count: 98,
    includes: ['Vuelo redondo', 'Hotel boutique Cartagena', 'City tours', 'Tour del café', 'Islas del Rosario'],
    highlights: ['Cartagena', 'Bogotá', 'Café colombiano', 'Islas del Rosario'],
    is_featured: true,
    is_active: true,
    order_index: 2,
    flight_type: 'internacional',
    itinerary_pdf: 'https://drive.google.com/file/d/1AyUr-OcfJKiVEtBvNEngTOzuDQoXNde3/view',
  },
  {
    id: 'orlando-verano-magico',
    title: 'Orlando Verano Mágico',
    destination: 'Orlando, Florida, EUA',
    country: 'Estados Unidos',
    region: 'Norteamérica',
    description: 'El verano más mágico de tu familia en los mejores parques del mundo. Disney World, Universal Studios, SeaWorld y más en una sola escapada inolvidable.',
    price: 1899,
    original_price: 2299,
    discount: 17,
    duration: '6 noches / 7 días',
    nights: 6,
    image: '/images/packages/Disney_Orlando_castle_at_night.jpg',
    category: 'familia',
    rating: 4.9,
    reviews_count: 342,
    includes: ['Vuelo redondo', 'Hotel temático', 'Multi-park pass 4 parques', 'Traslados', 'Seguro familiar'],
    highlights: ['Disney World', 'Universal Studios', 'SeaWorld', 'LEGOLAND'],
    is_featured: true,
    is_active: true,
    order_index: 3,
    flight_type: 'internacional',
    itinerary_pdf: 'https://drive.google.com/file/d/1EyUMnItwTFynJ0DBCNf17Xk_BGacm8RS/view',
  },
];

// ==========================================
// CRUD de Paquetes
// ==========================================

export async function getPackages() {
  if (!isSupabaseConfigured()) {
    return DEFAULT_PACKAGES;
  }
  
  try {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    // Normalizar: usar slug como id para el enrutamiento si existe, pero conservar el id numérico
    const normalized = (data || [])
      .filter(p => p.title && p.title.trim() !== '' && p.title !== 'undefined')
      .map(p => ({ ...p, id: p.slug || String(p.id), _db_id: p.id }));
    return normalized.length > 0 ? normalized : DEFAULT_PACKAGES;
  } catch (error) {
    console.warn('Error fetching packages, using defaults:', error.message);
    return DEFAULT_PACKAGES;
  }
}

export async function getPackageById(id) {
  if (!isSupabaseConfigured()) {
    return DEFAULT_PACKAGES.find(p => p.id === id) || null;
  }
  
  try {
    // Try by slug first
    const { data: bySlug, error: slugError } = await supabase
      .from('packages')
      .select('*')
      .eq('slug', id)
      .maybeSingle();
    
    if (bySlug) return { ...bySlug, id: bySlug.slug || String(bySlug.id), _db_id: bySlug.id };

    // Fallback: try by numeric DB id
    const numericId = parseInt(id, 10);
    if (!isNaN(numericId)) {
      const { data: byId, error: idError } = await supabase
        .from('packages')
        .select('*')
        .eq('id', numericId)
        .maybeSingle();
      if (byId) return { ...byId, id: byId.slug || String(byId.id), _db_id: byId.id };
    }

    // Final fallback: default packages
    return DEFAULT_PACKAGES.find(p => p.id === id) || null;
  } catch (error) {
    console.warn('Error fetching package, searching defaults:', error.message);
    return DEFAULT_PACKAGES.find(p => p.id === id) || null;
  }
}

export async function createPackage(packageData) {
  const { data, error } = await supabase
    .from('packages')
    .insert([packageData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updatePackage(id, updates, userEmail = 'admin') {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase no configurado');
  }

  // Primero obtener el paquete actual para el historial
  let currentPackage = null;
  try {
    currentPackage = await getPackageById(id);
  } catch (_) {
    // Si no se puede obtener el paquete actual, omitir el historial
  }

  // Guardar historial de cada campo cambiado (solo campos escalares)
  // Solo si tenemos el id numérico real de la BD (package_history.package_id es BIGINT)
  const dbNumericId = currentPackage?._db_id ?? null;
  if (currentPackage && dbNumericId) {
    const scalarFields = Object.entries(updates).filter(([, v]) => typeof v !== 'object');
    const historyPromises = scalarFields
      .filter(([field, newValue]) => currentPackage[field] !== newValue && field !== 'updated_at')
      .map(([field, newValue]) =>
        addToHistory(dbNumericId, field, String(currentPackage[field] ?? ''), String(newValue ?? ''), userEmail)
          .catch(() => {}) // ignorar errores de historial
      );
    await Promise.all(historyPromises);
  }

  // Actualizar el paquete (buscar por slug)
  const { data: updateData, error: updateError, count } = await supabase
    .from('packages')
    .update(updates)
    .eq('slug', id)
    .select()
    .single();

  // Si no encontró ninguna fila (paquete no está en BD aún), hacer upsert con datos por defecto + updates
  if (updateError?.code === 'PGRST116' || (!updateData && !updateError)) {
    const defaultPkg = DEFAULT_PACKAGES.find(p => p.id === id);
    if (defaultPkg) {
      const { id: _id, ...defaultWithoutId } = defaultPkg;
      const upsertPayload = { ...defaultWithoutId, slug: id, ...updates };
      const { data: upserted, error: upsertError } = await supabase
        .from('packages')
        .upsert(upsertPayload, { onConflict: 'slug' })
        .select()
        .single();
      if (upsertError) throw upsertError;
      return upserted ? { ...upserted, id: upserted.slug || String(upserted.id) } : null;
    }
  }

  const error = updateError;
  const data = updateData;

  if (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('No se pudo conectar con Supabase. Verifica que el proyecto esté activo.');
    }
    throw error;
  }
  return data ? { ...data, id: data.slug || String(data.id) } : data;
}

export async function deletePackage(id) {
  // id can be a slug (string) or a stringified numeric DB id
  const numericId = parseInt(id, 10);
  const isNumericOnly = !isNaN(numericId) && String(numericId) === String(id);

  let error;
  if (isNumericOnly) {
    // Delete by numeric DB id directly
    ({ error } = await supabase
      .from('packages')
      .delete()
      .eq('id', numericId));
  } else {
    // Delete by slug
    ({ error } = await supabase
      .from('packages')
      .delete()
      .eq('slug', id));
  }

  if (error) throw error;
  return true;
}

export async function togglePackageStatus(id, isActive) {
  return updatePackage(id, { is_active: isActive });
}

export async function togglePackageFeatured(id, isFeatured) {
  return updatePackage(id, { is_featured: isFeatured });
}

// Actualiza el order_index de múltiples paquetes en un solo batch.
// orderedDbIds: array de _db_id (numérico) en el orden deseado (índice 0 = primero).
export async function updatePackagesOrder(orderedDbIds) {
  if (!isSupabaseConfigured()) throw new Error('Supabase no configurado');
  const results = await Promise.all(
    orderedDbIds.map((dbId, index) =>
      supabase.from('packages').update({ order_index: index }).eq('id', dbId)
    )
  );
  const failed = results.find(r => r.error);
  if (failed) throw failed.error;
}

// ==========================================
// Historial de Cambios (máximo 3 por paquete)
// ==========================================

export async function addToHistory(packageId, fieldChanged, oldValue, newValue, changedBy) {
  const { error } = await supabase
    .from('package_history')
    .insert([{
      package_id: packageId,
      field_changed: fieldChanged,
      old_value: oldValue,
      new_value: newValue,
      changed_by: changedBy
    }]);
  
  if (error) throw error;
}

export async function getPackageHistory(packageId) {
  // package_history.package_id es BIGINT: resolver slug → id numérico si es necesario
  let numericId = typeof packageId === 'number' ? packageId : parseInt(packageId, 10);
  if (isNaN(numericId)) {
    const { data: pkg } = await supabase
      .from('packages')
      .select('id')
      .eq('slug', packageId)
      .maybeSingle();
    numericId = pkg?.id ?? null;
  }
  if (!numericId) return [];

  const { data, error } = await supabase
    .from('package_history')
    .select('*')
    .eq('package_id', numericId)
    .order('changed_at', { ascending: false })
    .limit(3);
  
  if (error) throw error;
  return data || [];
}

// ==========================================
// Inicializar paquetes por defecto
// ==========================================

const defaultPackages = DEFAULT_PACKAGES;

export async function initializePackages() {
  const existing = await getPackages();
  if (existing.length === 0) {
    for (const pkg of defaultPackages) {
      await createPackage(pkg);
    }
  }
  return getPackages();
}

// Sincroniza los paquetes por defecto del código hacia Supabase.
// Solo inserta los que NO existen aún (nunca sobreescribe cambios del admin).
export async function syncDefaultsToDatabase() {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase no configurado');
  }

  // Obtener slugs ya existentes en la BD
  const { data: existing, error: fetchError } = await supabase
    .from('packages')
    .select('slug')
    .not('slug', 'is', null);

  if (fetchError) {
    if (fetchError.message === 'Failed to fetch') {
      throw new Error('No se pudo conectar con Supabase. Verifica que el proyecto esté activo.');
    }
    throw fetchError;
  }

  const existingSlugs = new Set((existing || []).map(p => p.slug));
  const toInsert = DEFAULT_PACKAGES
    .filter(p => !existingSlugs.has(p.id))
    .map(({ id, ...rest }) => ({ slug: id, ...rest }));

  if (toInsert.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('packages')
    .insert(toInsert)
    .select();

  if (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('No se pudo conectar con Supabase. Verifica que el proyecto esté activo.');
    }
    throw error;
  }
  return data;
}

// Mapeo de nombres de campos para mostrar en historial
export const fieldLabels = {
  title: 'Título',
  destination: 'Destino',
  country: 'País',
  region: 'Región',
  description: 'Descripción',
  price: 'Precio',
  original_price: 'Precio Original',
  discount: 'Descuento',
  duration: 'Duración',
  nights: 'Noches',
  image: 'Imagen',
  category: 'Categoría',
  rating: 'Calificación',
  reviews_count: 'N° Reseñas',
  is_active: 'Estado',
  is_featured: 'Destacado',
  airline: 'Aerolínea',
  flight_type: 'Tipo de Vuelo',
  service_type: 'Tipo de Servicio',
  persons: 'Personas',
  hotel_name: 'Hotel',
  hotel_stars: 'Estrellas Hotel',
  room_type: 'Tipo de Habitación',
  accommodation_type: 'Régimen',
  itinerary_pdf: 'Itinerario PDF',
  dates: 'Fechas / Salidas',
  contact_whatsapp: 'WhatsApp',
  cancellation_policy: 'Política de Cancelación',
  includes: 'Incluye',
  gallery: 'Galería',
  flight_includes: 'Incluye en Vuelo',
  transfers_included: 'Traslados',
  itinerary: 'Itinerario',
  important_info: 'Info del Destino',
  terms_conditions: 'Términos y Condiciones',
  payment_options: 'Formas de Pago',
};

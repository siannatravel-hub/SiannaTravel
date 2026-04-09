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
  {
    id: 'tokyo-moderno',
    title: 'Tokio Moderno',
    destination: 'Tokio',
    country: 'Japón',
    region: 'Asia',
    description: 'Explora la fascinante mezcla de tradición y modernidad.',
    price: 3299,
    original_price: 3799,
    discount: 13,
    duration: '8 días / 7 noches',
    nights: 7,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=90',
    category: 'cultural',
    rating: 4.7,
    reviews_count: 156,
    includes: ['Vuelos ida y vuelta', 'Hotel tradicional', 'JR Pass', 'Guía bilingüe'],
    highlights: ['Shibuya', 'Monte Fuji', 'Templo Senso-ji', 'Akihabara'],
    is_featured: false,
    is_active: true,
    order_index: 4,
    flight_type: 'internacional',
  },
  {
    id: 'bariloche-nieve',
    title: 'Bariloche Nieve & Chocolate',
    destination: 'Bariloche',
    country: 'Argentina',
    region: 'Sudamérica',
    description: 'Esquí, chocolate artesanal y paisajes de ensuáo en la Patagonia argentina.',
    price: 1599,
    original_price: 1899,
    discount: 16,
    duration: '5 días / 4 noches',
    nights: 4,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=90',
    category: 'aventura',
    rating: 4.6,
    reviews_count: 198,
    includes: ['Vuelos ida y vuelta', 'Hotel 5 estrellas', 'Pase de esquí', 'Tour chocolaterías'],
    highlights: ['Cerro Catedral', 'Lago Nahuel Huapi', 'Circuito Chico', 'Chocolaterías'],
    is_featured: false,
    is_active: true,
    order_index: 5,
    flight_type: 'internacional',
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
    // Normalizar: usar slug como id para el enrutamiento si existe
    const normalized = (data || []).map(p => ({ ...p, id: p.slug || String(p.id) }));
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
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('slug', id)
      .single();
    
    if (error) throw error;
    return data ? { ...data, id: data.slug || String(data.id) } : null;
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
  if (currentPackage) {
    const scalarFields = Object.entries(updates).filter(([, v]) => typeof v !== 'object');
    const historyPromises = scalarFields
      .filter(([field, newValue]) => currentPackage[field] !== newValue && field !== 'updated_at')
      .map(([field, newValue]) =>
        addToHistory(id, field, String(currentPackage[field] ?? ''), String(newValue ?? ''), userEmail)
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
  const { error } = await supabase
    .from('packages')
    .delete()
    .eq('slug', id);
  
  if (error) throw error;
  return true;
}

export async function togglePackageStatus(id, isActive) {
  return updatePackage(id, { is_active: isActive });
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
  const { data, error } = await supabase
    .from('package_history')
    .select('*')
    .eq('package_id', packageId)
    .order('changed_at', { ascending: false })
    .limit(3);
  
  if (error) throw error;
  return data || [];
}

// ==========================================
// Inicializar paquetes por defecto
// ==========================================

const defaultPackages = [
  {
    title: 'Cancún Todo Incluido',
    destination: 'Cancún',
    country: 'México',
    region: 'Caribe',
    description: 'Disfruta del paraíso caribeño mexicano con playas de agua cristalina.',
    price: 1899,
    original_price: 2299,
    discount: 17,
    duration: '6 días / 5 noches',
    nights: 5,
    image: 'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800&q=90',
    category: 'playa',
    rating: 4.8,
    reviews_count: 234,
    includes: ['Vuelos ida y vuelta', 'Hotel 5 estrellas', 'Todo incluido', 'Traslados'],
    highlights: ['Zona hotelera', 'Chichén Itzá', 'Isla Mujeres', 'Xcaret'],
    is_featured: true,
    order_index: 0
  },
  {
    title: 'París Romántico',
    destination: 'París',
    country: 'Francia',
    region: 'Europa',
    description: 'La ciudad del amor te espera con la Torre Eiffel y el Louvre.',
    price: 2499,
    original_price: 2899,
    discount: 14,
    duration: '7 días / 6 noches',
    nights: 6,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=90',
    category: 'cultural',
    rating: 4.9,
    reviews_count: 189,
    includes: ['Vuelos ida y vuelta', 'Hotel céntrico', 'Desayunos', 'City tour'],
    highlights: ['Torre Eiffel', 'Museo Louvre', 'Montmartre', 'Versalles'],
    is_featured: true,
    order_index: 1
  },
  {
    title: 'Tokio Moderno',
    destination: 'Tokio',
    country: 'Japón',
    region: 'Asia',
    description: 'Explora la fascinante mezcla de tradición y modernidad.',
    price: 3299,
    original_price: 3799,
    discount: 13,
    duration: '8 días / 7 noches',
    nights: 7,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=90',
    category: 'cultural',
    rating: 4.7,
    reviews_count: 156,
    includes: ['Vuelos ida y vuelta', 'Hotel tradicional', 'JR Pass', 'Guía bilingüe'],
    highlights: ['Shibuya', 'Monte Fuji', 'Templo Senso-ji', 'Akihabara'],
    is_featured: false,
    order_index: 2
  },
  {
    title: 'Machu Picchu Aventura',
    destination: 'Cusco',
    country: 'Perú',
    region: 'Sudamérica',
    description: 'Descubre la magia del imperio Inca y una de las maravillas del mundo.',
    price: 1699,
    original_price: 1999,
    discount: 15,
    duration: '5 días / 4 noches',
    nights: 4,
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=90',
    category: 'aventura',
    rating: 4.9,
    reviews_count: 312,
    includes: ['Vuelos ida y vuelta', 'Hotel en Cusco', 'Tren a Machu Picchu', 'Entradas'],
    highlights: ['Machu Picchu', 'Valle Sagrado', 'Cusco Colonial', 'Ollantaytambo'],
    is_featured: true,
    order_index: 3
  },
  {
    title: 'Dubái de Lujo',
    destination: 'Dubái',
    country: 'Emiratos Árabes',
    region: 'Medio Oriente',
    description: 'Vive el lujo extremo en la ciudad de los récords.',
    price: 2899,
    original_price: 3499,
    discount: 17,
    duration: '6 días / 5 noches',
    nights: 5,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=90',
    category: 'lujo',
    rating: 4.8,
    reviews_count: 178,
    includes: ['Vuelos ida y vuelta', 'Hotel 5 estrellas', 'Safari desierto', 'Burj Khalifa'],
    highlights: ['Burj Khalifa', 'Palm Jumeirah', 'Dubai Mall', 'Desert Safari'],
    is_featured: false,
    order_index: 4
  },
  {
    title: 'Nueva York City Break',
    destination: 'Nueva York',
    country: 'Estados Unidos',
    region: 'Norteamérica',
    description: 'La Gran Manzana te espera con Broadway, Central Park y Times Square.',
    price: 2199,
    original_price: 2599,
    discount: 15,
    duration: '5 días / 4 noches',
    nights: 4,
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=90',
    category: 'cultural',
    rating: 4.7,
    reviews_count: 267,
    includes: ['Vuelos ida y vuelta', 'Hotel Manhattan', 'City Pass', 'Traslados'],
    highlights: ['Times Square', 'Central Park', 'Estatua Libertad', 'Brooklyn Bridge'],
    is_featured: false,
    order_index: 5
  }
];

export async function initializePackages() {
  const existing = await getPackages();
  if (existing.length === 0) {
    for (const pkg of defaultPackages) {
      await createPackage(pkg);
    }
  }
  return getPackages();
}

// Sincroniza (upsert) los paquetes por defecto del código hacia Supabase.
// Insertar si no existe el id, actualizar si ya existe.
export async function syncDefaultsToDatabase() {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase no configurado');
  }

  // Mapear id (slug de texto) → campo slug en la BD
  // Excluir columnas que pueden no existir aún en la BD (itinerary_pdf, etc.)
  const packagesToSync = DEFAULT_PACKAGES.map(({ id, itinerary_pdf, ...rest }) => ({ slug: id, ...rest }));

  const { data, error } = await supabase
    .from('packages')
    .upsert(packagesToSync, { onConflict: 'slug' });

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

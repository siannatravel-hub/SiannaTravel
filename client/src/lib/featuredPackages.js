import { supabase, isSupabaseConfigured } from './supabase';

// Paquetes destacados por defecto (cuando no hay conexión a Supabase)
const DEFAULT_FEATURED = [
  {
    id: 'orlando-verano-magico',
    title: 'Orlando Verano Mágico',
    destination: 'Orlando, Florida, EUA',
    price: 1899,
    original_price: 2299,
    discount: 17,
    image: '/images/packages/Disney_Orlando_castle_at_night.jpg',
    tag: 'Familia',
    nights: 6,
    rating: 4.9,
    itinerary_pdf: 'https://drive.google.com/file/d/1EyUMnItwTFynJ0DBCNf17Xk_BGacm8RS/view',
  },
  {
    id: 'barrancas-del-cobre',
    title: 'Barrancas del Cobre',
    destination: 'Chihuahua, México',
    price: 1450,
    original_price: 1799,
    discount: 19,
    image: '/images/packages/barranchadelcobre.png',
    tag: 'Aventura',
    nights: 5,
    rating: 4.8,
    itinerary_pdf: 'https://drive.google.com/file/d/10THWoFOvm9GDeB-EB-XNr8IpyoNmCbYa/view',
  },
  {
    id: 'tren-paraiso-maya',
    title: 'Tren y Paraíso Maya',
    destination: 'Riviera Maya, México',
    price: 1299,
    original_price: 1599,
    discount: 19,
    image: '/images/packages/trenmaya.jpg',
    tag: 'Más Vendido',
    nights: 7,
    rating: 4.9,
    itinerary_pdf: 'https://drive.google.com/file/d/1xcJNxnJMxfwbsbc2jwKPaNA3RHafNSVG/view',
  },
  {
    id: 'vamos-a-colombia',
    title: 'Vamos a Colombia',
    destination: 'Bogotá y Cartagena, Colombia',
    price: 1599,
    original_price: 1999,
    discount: 20,
    image: '/images/packages/bogota.jpg',
    tag: 'Cultural',
    nights: 7,
    rating: 4.8,
    itinerary_pdf: 'https://drive.google.com/file/d/1AyUr-OcfJKiVEtBvNEngTOzuDQoXNde3/view',
  },
];

// Obtener paquetes destacados
export async function getFeaturedPackages() {
  if (!isSupabaseConfigured()) {
    return { data: DEFAULT_FEATURED, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('featured_packages')
      .select('*')
      .order('order_index', { ascending: true })
      .limit(3);

    if (error) throw error;
    
    // Si no hay datos en la BD, devolver los por defecto
    if (!data || data.length === 0) {
      return { data: DEFAULT_FEATURED, error: null };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching featured packages:', error);
    return { data: DEFAULT_FEATURED, error };
  }
}

// Actualizar un paquete destacado
export async function updateFeaturedPackage(id, updates) {
  if (!isSupabaseConfigured()) {
    return { error: 'Supabase no configurado' };
  }

  const { data, error } = await supabase
    .from('featured_packages')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

// Crear un paquete destacado
export async function createFeaturedPackage(packageData) {
  if (!isSupabaseConfigured()) {
    return { error: 'Supabase no configurado' };
  }

  const { data, error } = await supabase
    .from('featured_packages')
    .insert([packageData])
    .select()
    .single();

  return { data, error };
}

// Eliminar un paquete destacado
export async function deleteFeaturedPackage(id) {
  if (!isSupabaseConfigured()) {
    return { error: 'Supabase no configurado' };
  }

  const { error } = await supabase
    .from('featured_packages')
    .delete()
    .eq('id', id);

  return { error };
}

// Inicializar paquetes por defecto en Supabase (solo si la tabla está vacía)
export async function initializeFeaturedPackages() {
  if (!isSupabaseConfigured()) {
    return { error: 'Supabase no configurado' };
  }

  // Verificar si ya hay datos
  const { data: existing } = await supabase
    .from('featured_packages')
    .select('id')
    .limit(1);

  if (existing && existing.length > 0) {
    return { message: 'Ya existen paquetes destacados' };
  }

  // Insertar los paquetes por defecto
  const packagesToInsert = DEFAULT_FEATURED.map((pkg, index) => ({
    ...pkg,
    id: undefined, // Let Supabase generate the ID
    order_index: index,
  }));

  const { data, error } = await supabase
    .from('featured_packages')
    .insert(packagesToInsert)
    .select();

  return { data, error };
}

// Sincroniza los paquetes destacados del código hacia Supabase (borra y re-inserta).
// Úsalo cuando hayas actualizado DEFAULT_FEATURED en el código.
export async function syncDefaultFeaturedToDatabase() {
  if (!isSupabaseConfigured()) {
    return { error: 'Supabase no configurado' };
  }

  try {
    // Borrar todos los registros existentes (BIGSERIAL ids, no podemos hacer upsert por slug)
    const { error: deleteError } = await supabase
      .from('featured_packages')
      .delete()
      .gte('id', 1);

    if (deleteError) throw deleteError;

    // Re-insertar los defaults desde el código
    const packagesToInsert = DEFAULT_FEATURED.map((pkg, index) => {
      const { id, ...rest } = pkg; // quitar el id de string, Supabase genera el int
      return { ...rest, order_index: index };
    });

    const { data, error } = await supabase
      .from('featured_packages')
      .insert(packagesToInsert)
      .select();

    return { data, error };
  } catch (error) {
    return { error };
  }
}

import { supabase, isSupabaseConfigured } from './supabase';

// ==========================================
// Datos por defecto cuando no hay conexión a Supabase
// ==========================================

const DEFAULT_POSTS = [
  {
    id: 4,
    title: 'Catedral de Tulancingo de Bravo: joyas arquitectónicas del mundo y por qué vale la pena visitarlas',
    slug: 'catedral-tulancingo-vs-catedrales-del-mundo',
    excerpt: 'Descubre cuánto tiene en común la hermosa Catedral de Tulancingo de Bravo con las grandes catedrales del mundo. Un recorrido arquitectónico que inspira tu próximo viaje.',
    cover_image: "/Saint_Peter's_Basilica_facade,_Rome,_Italy.jpg",
    content: JSON.stringify([
      {
        type: 'text',
        value: 'Si te gustan las catedrales, como lo es nuestra bella **Catedral de San Juan Bautista de Tulancingo**, entonces este recorrido visual por las más impresionantes del mundo es para ti. En Sianna Travel creemos que cada gran viaje empieza por apreciar lo que tienes cerca — y desde Tulancingo hay un mundo entero por descubrir.',
      },
      {
        type: 'text',
        value: '## La Catedral de San Juan Bautista, Tulancingo de Bravo\n\nErigida en el siglo XVI durante la evangelización española, la **Catedral de San Juan Bautista de Tulancingo** es uno de los templos más antiguos e importantes del estado de Hidalgo. Su fachada barroca, sus torres simétricas y su interior decorado con retablos dorados testimonian siglos de fe y arte. Tulancingo es una de las primeras ciudades fundadas en el México colonial, lo que le otorga un peso histórico enorme que muchos viajeros pasan por alto.',
      },
      {
        type: 'text',
        value: '## Catedral de Notre-Dame, París, Francia\n\n**Construida:** siglos XII–XIV  \n**Estilo:** Gótico francés  \nConsiderada el símbolo espiritual de Europa, Notre-Dame deslumbra con sus vitrales de colores, sus arbotantes y su roseta central. Tras el incendio de 2019, su restauración ha renovado el interés mundial por el arte gótico.  \n\n**¿Qué comparte con Tulancingo?** Ambas son catedrales que han sobrevivido desafíos históricos y se erigen como centros espirituales de sus comunidades.',
      },
      {
        type: 'image',
        value: '/Cath%C3%A9drale_Notre-Dame_de_Paris_-_04.jpg',
        caption: 'Notre-Dame de París, icono del gótico europeo, actualmente en restauración.',
      },
      {
        type: 'text',
        value: '## Basílica de la Sagrada Familia, Barcelona, España\n\n**Arquitecto:** Antoni Gaudí  \n**Estilo:** Modernismo catalán / Neogótico  \nNinguna catedral en construcción atrae más viajeros que la Sagrada Familia. Sus torres orgánicas, sus fachadas narrativas y su interior de luz filtrada la convierten en una experiencia casi mística.  \n\n**¿Qué comparte con Tulancingo?** Las dos son obras de fe que evolucionaron con el tiempo, adaptándose a distintas épocas y estilos artísticos.',
      },
      {
        type: 'image',
        value: '/Barcelona_Iglesia_Sagrada_Familia_02.jpg',
        caption: 'La Sagrada Familia de Gaudí sigue en construcción más de 140 años después.',
      },
      {
        type: 'text',
        value: '## Catedral de Saint-Pierre, Ginebra, Suiza\n\n**Construida:** siglos XII–XIII  \n**Estilo:** Gótico / Románico  \nDomina el casco antiguo de Ginebra desde lo alto de la Colina de la Ciudad Vieja. Fue la iglesia desde la que Juan Calvino predicó la Reforma Protestante en el siglo XVI. Su sobriedad interior contrasta con la riqueza histórica que encierra.',
      },
      {
        type: 'image',
        value: '/Fa%C3%A7ade_de_la_cath%C3%A9drale_Saint-Pierre_de_Gen%C3%A8ve_2009-07-11.jpg',
        caption: 'La Catedral de Saint-Pierre en Ginebra, testigo de la Reforma Protestante del siglo XVI.',
      },
      {
        type: 'text',
        value: '## Basílica de San Pedro, Ciudad del Vaticano\n\n**Arquitectos:** Bramante, Miguel Ángel, Bernini  \n**Tamaño:** La iglesia más grande del mundo  \nCon su cúpula diseñada por Miguel Ángel y la espectacular Plaza de San Pedro de Bernini, el Vaticano es el destino de peregrinación más visitado del planeta. Su interior alberga obras maestras como la Pietà y el baldaquino de bronce.',
      },
      {
        type: 'image',
        value: "/Saint_Peter's_Basilica_facade,_Rome,_Italy.jpg",
        caption: 'La Basílica de San Pedro en el Vaticano: la iglesia más grande del mundo.',
      },
      {
        type: 'text',
        value: '## Catedral Metropolitana de la Ciudad de México\n\n**Construida:** 1573–1813  \n**Estilo:** Barroco, Neoclásico  \nLa catedral más grande de América y principal referente del barroco mexicano. Construida sobre el Templo Mayor azteca, combina piedra volcánica gris y arte virreinal. Es prima hermana arquitectónica de nuestra Catedral de San Juan Bautista de Tulancingo — ambas nacieron del mismo impulso evangelizador del siglo XVI en la Nueva España.',
      },
      {
        type: 'image',
        value: '/Catedral_Metropolitana_de_la_Ciudad_de_M%C3%A9xico_1.jpg',
        caption: 'La Catedral Metropolitana de la Ciudad de México, la más grande de América Latina.',
      },
      {
        type: 'text',
        value: '## Tabla comparativa\n\n| Catedral | País | Estilo | Siglo de inicio | Altura aprox. |\n|---|---|---|---|---|\n| San Juan Bautista, Tulancingo | México 🇲🇽 | Barroco colonial | XVI | ~30 m |\n| Notre-Dame | Francia 🇫🇷 | Gótico | XII | 69 m |\n| Sagrada Familia | España 🇪🇸 | Modernismo | XIX | 172 m |\n| Saint-Pierre, Ginebra | Suiza 🇨🇭 | Románico / Gótico | XII | 60 m |\n| San Pedro | Vaticano 🇻🇦 | Renacimiento | XVI | 136 m |\n| Catedral CDMX | México 🇲🇽 | Barroco | XVI | 67 m |',
      },
      {
        type: 'text',
        value: '## ¿Por qué empezar en Tulancingo?\n\nCada una de estas catedrales es la puerta de entrada a una cultura, una historia y un destino de viaje fascinantes. En Tulancingo tenemos la suerte de contar con un patrimonio arquitectónico que nos conecta directamente con esa tradición global.\n\nEn **Sianna Travel** organizamos tours culturales que te llevan desde el corazón de Hidalgo hasta las grandes ciudades del mundo. ¿Te gustaría visitar París, Roma, Ginebra o la Ciudad de México? Escríbenos y diseñamos el itinerario perfecto para ti.\n\n📞 775 265 8513 | 775 752 5171',
      },
    ]),
    author: 'Sianna Travel',
    published_at: '2026-04-08T10:00:00Z',
    is_published: true,
  },
  {
    id: 1,
    title: 'Los 5 mejores destinos de playa en México para 2026',
    slug: 'mejores-destinos-playa-mexico-2026',
    excerpt: 'Descubre las playas más impresionantes de México que no puedes dejar de visitar este año.',
    cover_image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=90',
    content: JSON.stringify([
      { type: 'text', value: 'México es hogar de algunas de las playas más hermosas del mundo. Desde el Caribe turquesa hasta las olas del Pacífico, cada costa tiene algo único que ofrecer.' },
      { type: 'image', value: 'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800', caption: 'Las playas de Cancún son famosas por su arena blanca y agua cristalina.' },
      { type: 'text', value: '## 1. Cancún y la Riviera Maya\n\nEl Caribe mexicano sigue siendo el destino número uno para viajeros nacionales e internacionales. Sus aguas turquesas, ruinas mayas cercanas y vida nocturna vibrante lo convierten en una experiencia completa.' },
      { type: 'text', value: '## 2. Los Cabos\n\nDonde el desierto se encuentra con el mar. Los Cabos ofrece paisajes dramáticos, pesca deportiva de clase mundial y resorts de lujo que satisfacen hasta al viajero más exigente.' },
      { type: 'image', value: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800', caption: 'Puerto Vallarta combina playa, cultura y gastronomía.' },
      { type: 'text', value: '## 3. Puerto Vallarta\n\nCon su malecón icónico, gastronomía excepcional y pueblos cercanos como Sayulita, Puerto Vallarta es perfecto para parejas y familias.' },
      { type: 'text', value: '## 4. Huatulco\n\nUn paraíso relativamente virgen con 9 bahías espectaculares. Ideal para quienes buscan tranquilidad y naturaleza sin las multitudes.' },
      { type: 'text', value: '## 5. Isla Holbox\n\nUna isla sin autos donde el tiempo se detiene. Perfecto para desconectarse del mundo y nadar con tiburones ballena entre junio y septiembre.' },
    ]),
    author: 'Sianna Travel',
    published_at: '2026-03-15T10:00:00Z',
    is_published: true,
  },
  {
    id: 2,
    title: 'Guía para viajeros primerizos: todo lo que necesitas saber',
    slug: 'guia-viajeros-primerizos',
    excerpt: 'Si es tu primer gran viaje, esta guía te ayudará a planificar como un experto.',
    cover_image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=90',
    content: JSON.stringify([
      { type: 'text', value: 'Viajar por primera vez puede ser abrumador, pero con la planeación correcta se convierte en una experiencia transformadora. Aquí te compartimos todo lo que necesitas.' },
      { type: 'text', value: '## Documentación\n\nAsegúrate de tener tu pasaporte vigente con al menos 6 meses de validez y revisa si necesitas visa para tu destino.' },
      { type: 'text', value: '## Presupuesto\n\nDefine cuánto quieres gastar antes de elegir destino. Incluye vuelos, hospedaje, comida, transporte y actividades.' },
      { type: 'image', value: 'https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=800', caption: 'Planificar tu viaje con anticipación te ahorrará dinero y estrés.' },
      { type: 'text', value: '## Reserva con anticipación\n\nLos mejores precios se encuentran reservando de 2 a 3 meses antes. En temporada alta, reserva con aún más anticipación.' },
    ]),
    author: 'Sianna Travel',
    published_at: '2026-03-10T10:00:00Z',
    is_published: true,
  },
  {
    id: 3,
    title: 'Viajes en pareja: las 3 escapadas más románticas de México',
    slug: 'escapadas-romanticas-mexico',
    excerpt: 'Celebra el amor en estos destinos diseñados para parejas que buscan momentos únicos.',
    cover_image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=90',
    content: JSON.stringify([
      { type: 'text', value: 'No necesitas ir al otro lado del mundo para vivir una escapada romántica de película. México tiene todo lo que una pareja necesita.' },
      { type: 'text', value: '## 1. Tulum: bohemio y mágico\n\nCenotes bajo las estrellas, ruinas frente al mar y la mejor cocina del Caribe. Tulum es el destino favorito de parejas jóvenes.' },
      { type: 'image', value: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800', caption: 'San Miguel de Allende ha sido nombrada varias veces la mejor ciudad del mundo.' },
      { type: 'text', value: '## 2. San Miguel de Allende: colonial y elegante\n\nCalles empedradas, iglesias barrocas, vino mexicano y atardeceres dorados. El marco perfecto para celebrar un aniversario.' },
      { type: 'text', value: '## 3. Valle de Guadalupe: el Napa mexicano\n\nRutas del vino, cenas gourmet al aire libre y hoteles boutique entre viñedos. Una joya escondida en Baja California.' },
    ]),
    author: 'Sianna Travel',
    published_at: '2026-03-05T10:00:00Z',
    is_published: true,
  },
];

// ==========================================
// CRUD de Blog Posts
// ==========================================

function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function getBlogPosts() {
  if (!isSupabaseConfigured()) {
    return DEFAULT_POSTS.filter(p => p.is_published);
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data && data.length > 0 ? data : DEFAULT_POSTS.filter(p => p.is_published);
  } catch (error) {
    console.warn('Error fetching blog posts, using defaults:', error.message);
    return DEFAULT_POSTS.filter(p => p.is_published);
  }
}

export async function getAllBlogPosts() {
  if (!isSupabaseConfigured()) {
    return DEFAULT_POSTS;
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data && data.length > 0 ? data : DEFAULT_POSTS;
  } catch (error) {
    console.warn('Error fetching all blog posts, using defaults:', error.message);
    return DEFAULT_POSTS;
  }
}

export async function getBlogPostBySlug(slug) {
  if (!isSupabaseConfigured()) {
    return DEFAULT_POSTS.find(p => p.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('Error fetching blog post, searching defaults:', error.message);
    return DEFAULT_POSTS.find(p => p.slug === slug) || null;
  }
}

export async function createBlogPost(postData) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase no está configurado. Ejecuta el SQL blog_posts.sql en Supabase.');
  }
  const slug = postData.slug || generateSlug(postData.title);
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([{ ...postData, slug, is_published: true, published_at: new Date().toISOString() }])
    .select();

  if (error) throw error;
  return data?.[0] || null;
}

export async function updateBlogPost(id, updates) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase no está configurado. Ejecuta el SQL blog_posts.sql en Supabase.');
  }
  if (updates.title && !updates.slug) {
    updates.slug = generateSlug(updates.title);
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data?.[0] || null;
}

export async function deleteBlogPost(id) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase no está configurado.');
  }
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

export async function toggleBlogPostPublished(id, isPublished) {
  return updateBlogPost(id, { 
    is_published: isPublished,
    published_at: isPublished ? new Date().toISOString() : null
  });
}

export { generateSlug };

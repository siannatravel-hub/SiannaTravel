// In-memory travel packages data. Replace with database in production.
const packages = [
  {
    id: 'barrancas-del-cobre',
    title: 'Barrancas del Cobre',
    destination: 'Chihuahua, México',
    country: 'México',
    region: 'Norte de México',
    type: 'aventura',
    price: 1450,
    currency: 'USD',
    duration: '5 noches / 6 días',
    dates: { start: '2026-06-20', end: '2026-06-25' },
    airline: 'Aeroméxico',
    hotel: 'Best Western Casas Grandes',
    hotelStars: 3,
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=90',
    gallery: [],
    description:
      'Descubre el Mar de Barrancas en la Sierra Tarahumara. A bordo del legendario Tren El Chepe, recorre uno de los cañones más profundos de México rodeado de naturaleza única.',
    benefits: [
      'Vuelo redondo incluido',
      'Viaje en Tren El Chepe',
      'Hotel en Creel y Los Mochis',
      'Guía especializado en la Sierra Tarahumara',
      'Visita a cascadas y miradores',
      'Seguro de viaje',
    ],
    featured: true,
    rating: 4.8,
    reviewCount: 127,
    itinerary_pdf: 'https://drive.google.com/file/d/10THWoFOvm9GDeB-EB-XNr8IpyoNmCbYa/view',
  },
  {
    id: 'tren-paraiso-maya',
    title: 'Tren y Paraíso Maya',
    destination: 'Riviera Maya, México',
    country: 'México',
    region: 'Caribe',
    type: 'playa',
    price: 1299,
    currency: 'USD',
    duration: '7 noches / 8 días',
    dates: { start: '2026-07-10', end: '2026-07-17' },
    airline: 'Aeroméxico',
    hotel: 'Grand Palladium Riviera Maya',
    hotelStars: 5,
    image: 'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800&q=90',
    gallery: [],
    description:
      'Recorre la Riviera Maya a bordo del moderno Tren Maya. Desde Cancún hasta Tulum, disfruta de cenotes turquesas, zonas arqueológicas y las playas más bellas del Caribe mexicano.',
    benefits: [
      'Vuelo redondo incluido',
      'Pase ilimitado Tren Maya',
      'Hotel 5 estrellas All-Inclusive',
      'Visita a Chichén Itzá',
      'Tour de cenotes',
      'Día libre en Tulum',
      'Seguro de viaje',
    ],
    featured: true,
    rating: 4.9,
    reviewCount: 213,
    itinerary_pdf: 'https://drive.google.com/file/d/1xcJNxnJMxfwbsbc2jwKPaNA3RHafNSVG/view',
  },
  {
    id: 'vamos-a-colombia',
    title: 'Vamos a Colombia',
    destination: 'Bogotá y Cartagena, Colombia',
    country: 'Colombia',
    region: 'Sudamérica',
    type: 'cultural',
    price: 1599,
    currency: 'USD',
    duration: '7 noches / 8 días',
    dates: { start: '2026-08-01', end: '2026-08-08' },
    airline: 'Avianca',
    hotel: 'Hotel Sofitel Legend Santa Clara',
    hotelStars: 5,
    image: 'https://images.unsplash.com/photo-1562803500-bc4dd1af4920?w=800&q=90',
    gallery: [],
    description:
      'De Bogotá a Cartagena, Colombia te enamora con su gente cálida, gastronomía colorida, café de altura, arquitectura colonial y el ritmo del Caribe.',
    benefits: [
      'Vuelo redondo incluido',
      'Hotel boutique en Cartagena',
      'City tour Bogotá y Cartagena',
      'Tour del café colombiano',
      'Cena en restaurante gourmet',
      'Excursión a Islas del Rosario',
      'Seguro de viaje internacional',
    ],
    featured: true,
    rating: 4.8,
    reviewCount: 98,
    itinerary_pdf: 'https://drive.google.com/file/d/1AyUr-OcfJKiVEtBvNEngTOzuDQoXNde3/view',
  },
  {
    id: 'orlando-verano-magico',
    title: 'Orlando Verano Mágico',
    destination: 'Orlando, Florida, EUA',
    country: 'Estados Unidos',
    region: 'Norteamérica',
    type: 'familia',
    price: 1899,
    currency: 'USD',
    duration: '6 noches / 7 días',
    dates: { start: '2026-07-04', end: '2026-07-10' },
    airline: 'United Airlines',
    hotel: "Universal's Cabana Bay Beach Resort",
    hotelStars: 4,
    image: 'https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?w=800&q=90',
    gallery: [],
    description:
      'El verano más mágico de tu familia en los mejores parques del mundo. Disney World, Universal Studios, SeaWorld y más en una sola escapada inolvidable desde Tulancingo.',
    benefits: [
      'Vuelo redondo incluido',
      'Hotel temático con acceso temprano',
      'Multi-park pass (4 parques)',
      'Traslados aeropuerto-hotel incluidos',
      'Coordinación de tickets Express',
      'Seguro de viaje familiar',
    ],
    featured: true,
    rating: 4.9,
    reviewCount: 342,
    itinerary_pdf: 'https://drive.google.com/file/d/1EyUMnItwTFynJ0DBCNf17Xk_BGacm8RS/view',
  },
  {
    id: 'tokyo-moderno',
    title: 'Tokio Moderno',
    destination: 'Tokio, Japón',
    country: 'Japón',
    region: 'Asia',
    type: 'cultural',
    price: 3199,
    currency: 'USD',
    duration: '8 noches / 9 días',
    dates: { start: '2026-09-05', end: '2026-09-13' },
    airline: 'ANA',
    hotel: 'Park Hyatt Tokyo',
    hotelStars: 5,
    image: '/images/tokyo.webp',
    gallery: ['/images/tokyo-1.webp', '/images/tokyo-2.webp'],
    description:
      'Sumérgete en la cultura japonesa: templos milenarios, tecnología de vanguardia, gastronomía y tradición.',
    benefits: [
      'Vuelo redondo incluido',
      'Hotel 5 estrellas en Shinjuku',
      'Japan Rail Pass 7 días',
      'Tour guiado Tokio-Kioto',
      'Experiencia gastronómica tradicional',
      'Seguro de viaje internacional',
    ],
    featured: true,
    rating: 4.8,
    reviewCount: 167,
  },
  {
    id: 'bariloche-nieve',
    title: 'Bariloche Nieve & Chocolate',
    destination: 'Bariloche, Argentina',
    country: 'Argentina',
    region: 'Sudamérica',
    type: 'aventura',
    price: 1599,
    currency: 'USD',
    duration: '5 noches / 6 días',
    dates: { start: '2026-07-15', end: '2026-07-20' },
    airline: 'Aerolíneas Argentinas',
    hotel: 'Llao Llao Resort',
    hotelStars: 5,
    image: '/images/bariloche.webp',
    gallery: ['/images/bariloche-1.webp', '/images/bariloche-2.webp'],
    description:
      'Esquí, chocolate artesanal y paisajes de ensueño en la Patagonia argentina. Perfecto para parejas y familias.',
    benefits: [
      'Vuelo redondo incluido',
      'Hotel 5 estrellas frente al lago',
      'Pase de esquí 3 días',
      'Tour de chocolaterías',
      'Circuito Chico',
      'Seguro de viaje',
    ],
    featured: false,
    rating: 4.6,
    reviewCount: 198,
  },
  {
    id: 'maldivas-lujo',
    title: 'Maldivas Luxury Escape',
    destination: 'Maldivas',
    country: 'Maldivas',
    region: 'Asia',
    type: 'playa',
    price: 4299,
    currency: 'USD',
    duration: '6 noches / 7 días',
    dates: { start: '2026-10-01', end: '2026-10-07' },
    airline: 'Emirates',
    hotel: 'Soneva Fushi Resort',
    hotelStars: 5,
    image: '/images/maldivas.webp',
    gallery: ['/images/maldivas-1.webp', '/images/maldivas-2.webp'],
    description:
      'Villas sobre el agua cristalina del Océano Índico. El destino de lujo definitivo para parejas y lunas de miel.',
    benefits: [
      'Vuelo redondo en clase business',
      'Villa sobre el agua con piscina privada',
      'Todos los meals incluidos',
      'Snorkel con mantarrayas',
      'Cena romántica en la playa',
      'Spa de lujo incluido',
      'Traslado en hidroavión',
    ],
    featured: true,
    rating: 4.9,
    reviewCount: 89,
  },
  {
    id: 'santorini-grecia',
    title: 'Santorini Romántico',
    destination: 'Santorini, Grecia',
    country: 'Grecia',
    region: 'Europa',
    type: 'cultural',
    price: 2799,
    currency: 'USD',
    duration: '6 noches / 7 días',
    dates: { start: '2026-09-15', end: '2026-09-21' },
    airline: 'Aegean Airlines',
    hotel: 'Grace Hotel Santorini',
    hotelStars: 5,
    image: '/images/santorini.webp',
    gallery: ['/images/santorini-1.webp', '/images/santorini-2.webp'],
    description:
      'Atardeceres épicos en Oia, casas blancas con cúpulas azules, vinos locales y la mejor gastronomía mediterránea.',
    benefits: [
      'Vuelo redondo incluido',
      'Hotel boutique con vista al volcán',
      'Tour en catamarán al atardecer',
      'Cata de vinos locales',
      'Excursión a la caldera',
      'Cena con vista al mar Egeo',
      'Seguro de viaje internacional',
    ],
    featured: false,
    rating: 4.8,
    reviewCount: 234,
  },
];

export function getAllPackages(filters = {}) {
  let result = [...packages];

  if (filters.type) {
    result = result.filter((p) => p.type === filters.type);
  }
  if (filters.region) {
    result = result.filter((p) => p.region === filters.region);
  }
  if (filters.destination) {
    const dest = filters.destination.toLowerCase();
    result = result.filter((p) => p.destination.toLowerCase().includes(dest));
  }
  if (filters.minPrice) {
    result = result.filter((p) => p.price >= Number(filters.minPrice));
  }
  if (filters.maxPrice) {
    result = result.filter((p) => p.price <= Number(filters.maxPrice));
  }
  if (filters.featured === 'true') {
    result = result.filter((p) => p.featured);
  }

  // Sorting
  if (filters.sort === 'price_asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (filters.sort === 'price_desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (filters.sort === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  }

  return result;
}

export function getPackageById(id) {
  return packages.find((p) => p.id === id) || null;
}

export function getFeaturedPackages() {
  return packages.filter((p) => p.featured);
}

export function getFilterOptions() {
  const types = [...new Set(packages.map((p) => p.type))];
  const regions = [...new Set(packages.map((p) => p.region))];
  const priceRange = {
    min: Math.min(...packages.map((p) => p.price)),
    max: Math.max(...packages.map((p) => p.price)),
  };
  return { types, regions, priceRange };
}

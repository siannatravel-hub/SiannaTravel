import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPackageById } from '../lib/packages';
import BookingModal from '../components/BookingModal';
import { useSEO } from '../hooks/useSEO';
import styles from './PackageDetailNew.module.css';

// Galería de imágenes por defecto
const DEFAULT_GALLERY = [
  'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
];

// Datos por defecto
const DEFAULT_PACKAGE_DETAILS = {
  id: '1',
  title: 'Cancún Todo Incluido',
  destination: 'Cancún, México',
  description: 'Disfruta de las playas más hermosas del Caribe mexicano con este paquete que incluye vuelo redondo, hospedaje en resort 5 estrellas con sistema todo incluido, traslados aeropuerto-hotel-aeropuerto y seguro de viajero.',
  image: 'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=1200',
  gallery: DEFAULT_GALLERY,
  price: 1299,
  original_price: 1599,
  currency: 'MXN',
  duration: '5 días / 4 noches',
  persons: 2,
  service_type: 'paquete',
  flight_type: 'Vuelo redondo',
  airline: 'Aeroméxico',
  flight_includes: [
    'Vuelo redondo desde CDMX',
    'Equipaje documentado 23kg',
    'Equipaje de mano 10kg',
    'Selección de asiento'
  ],
  hotel_name: 'Grand Fiesta Americana Coral Beach',
  hotel_stars: 5,
  room_type: 'Suite Vista al Mar',
  accommodation_type: 'Todo Incluido',
  includes: [
    'Vuelo redondo',
    'Hotel 5 estrellas',
    'Todo Incluido',
    'Traslados aeropuerto-hotel',
    'Seguro de viajero',
    'Impuestos incluidos'
  ],
  transfers_included: [
    'Traslado aeropuerto - hotel',
    'Traslado hotel - aeropuerto',
    'Transporte privado climatizado'
  ],
  itinerary: [
    {
      day: 1,
      title: 'Llegada a Cancún',
      description: 'Recepción en el aeropuerto internacional de Cancún. Traslado privado al hotel. Check-in y resto del día libre para disfrutar de las instalaciones del resort.',
      meals: ['Cena']
    },
    {
      day: 2,
      title: 'Día libre en el resort',
      description: 'Día completo para disfrutar de la playa, piscinas, actividades acuáticas y todas las amenidades del hotel todo incluido.',
      meals: ['Desayuno', 'Almuerzo', 'Cena']
    },
    {
      day: 3,
      title: 'Excursión opcional',
      description: 'Posibilidad de contratar excursión a Chichén Itzá, Isla Mujeres o parque Xcaret (no incluido). Tarde libre.',
      meals: ['Desayuno', 'Almuerzo', 'Cena']
    },
    {
      day: 4,
      title: 'Día de relax',
      description: 'Último día completo en el paraíso. Aprovecha el spa, deportes acuáticos o simplemente relájate en la playa.',
      meals: ['Desayuno', 'Almuerzo', 'Cena']
    },
    {
      day: 5,
      title: 'Regreso',
      description: 'Desayuno en el hotel. Check-out y traslado al aeropuerto para tu vuelo de regreso.',
      meals: ['Desayuno']
    }
  ],
  important_info: [
    { title: 'Documentación', text: 'Pasaporte vigente mínimo 6 meses' },
    { title: 'Clima', text: 'Tropical, 25-32°C promedio' },
    { title: 'Moneda', text: 'Peso mexicano (USD aceptado)' },
    { title: 'Zona horaria', text: 'GMT-5 (Centro de México)' },
    { title: 'Vacunas', text: 'No requeridas' },
    { title: 'Electricidad', text: '110V - Enchufe tipo A/B' }
  ],
  terms_conditions: [
    'Precios sujetos a disponibilidad y temporada',
    'Se requiere anticipo del 50% para confirmar reservación',
    'Precio por persona en base a ocupación doble',
    'No incluye propinas ni gastos personales',
    'Documentación de viaje debe estar vigente'
  ],
  cancellation_policy: 'Cancelación gratuita hasta 30 días antes del viaje. Entre 29 y 15 días: penalidad del 50%. Menos de 15 días: no reembolsable.',
  payment_options: ['Efectivo', 'Transferencia', 'Tarjeta', 'MSI'],
  contact_whatsapp: '5215512345678',
  rating: 4.8,
  reviews_count: 124,
  dates: 'Salidas todos los lunes y viernes',
  is_active: true
};

// Convierte URL de Google Drive /view a /preview para iframe embebido
function toEmbedUrl(url) {
  if (!url) return null;
  return url.replace('/view', '/preview').split('?')[0];
}

export default function PackageDetailNew() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    async function loadPackage() {
      try {
        setLoading(true);
        const data = await getPackageById(id);

        if (!data) {
          setError('Paquete no encontrado');
          return;
        }

        const mergedPackage = {
          ...DEFAULT_PACKAGE_DETAILS,
          ...data,
          includes: data.includes || data.benefits || DEFAULT_PACKAGE_DETAILS.includes,
          gallery: data.gallery?.length ? data.gallery : (data.image ? [data.image] : DEFAULT_GALLERY),
          flight_includes: data.flight_includes || DEFAULT_PACKAGE_DETAILS.flight_includes,
          transfers_included: data.transfers_included || DEFAULT_PACKAGE_DETAILS.transfers_included,
          itinerary: data.itinerary || DEFAULT_PACKAGE_DETAILS.itinerary,
          important_info: data.important_info || DEFAULT_PACKAGE_DETAILS.important_info,
          terms_conditions: data.terms_conditions || DEFAULT_PACKAGE_DETAILS.terms_conditions,
          payment_options: data.payment_options || DEFAULT_PACKAGE_DETAILS.payment_options,
        };

        setPkg(mergedPackage);
      } catch (err) {
        console.error('Error loading package:', err);
        setError('No se pudo cargar el paquete');
      } finally {
        setLoading(false);
      }
    }

    loadPackage();
  }, [id]);

  // Variables derivadas — calculadas siempre (antes de cualquier return condicional)
  const packageTitle = pkg?.title || pkg?.name || '';
  const packageImage = pkg?.image || pkg?.image_url || '';
  const gallery = pkg?.gallery || DEFAULT_GALLERY;
  // Usar el descuento guardado en BD; si no existe, calcularlo como fallback
  const discount = pkg?.discount > 0
    ? pkg.discount
    : (pkg?.original_price && pkg?.price && pkg?.original_price > pkg?.price
        ? Math.round((1 - pkg.price / pkg.original_price) * 100)
        : 0);

  // useSEO debe llamarse siempre en el mismo orden — nunca después de un return condicional
  useSEO({
    title: packageTitle ? `${packageTitle} – Paquete de Viaje` : 'Paquete de Viaje',
    description: pkg?.description
      ? pkg.description.slice(0, 155)
      : packageTitle
        ? `Paquete ${packageTitle} desde $${pkg?.price?.toLocaleString()} ${pkg?.currency || 'MXN'}. ${pkg?.duration}. Reserva con Sianna Travel.`
        : '',
    url: `/paquetes/${id}`,
    image: packageImage,
    type: 'product',
    schema: pkg ? {
      '@context': 'https://schema.org',
      '@type': 'TouristTrip',
      name: packageTitle,
      description: pkg.description || '',
      image: packageImage || '',
      url: `https://siannatravel.com/paquetes/${pkg.id}`,
      touristType: pkg.category || 'leisure',
      offers: {
        '@type': 'Offer',
        price: pkg.price,
        priceCurrency: pkg.currency || 'MXN',
        availability: 'https://schema.org/InStock',
        url: `https://siannatravel.com/paquetes/${pkg.id}`,
        seller: {
          '@type': 'TravelAgency',
          name: 'Sianna Travel',
          url: 'https://siannatravel.com',
        },
      },
      itinerary: {
        '@type': 'ItemList',
        numberOfItems: pkg.itinerary?.length || 0,
      },
      provider: {
        '@type': 'TravelAgency',
        name: 'Sianna Travel',
        telephone: '+52-775-265-8513',
      },
    } : null,
  });

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className={styles.error}>
        <h2 className={styles.errorTitle}>Paquete no encontrado</h2>
        <Link to="/paquetes" className={styles.backLink}>
          Volver a paquetes
        </Link>
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hola! Me interesa el paquete "${packageTitle}" a ${pkg.destination}. ¿Podrían darme más información?`
  );

  const renderStars = (count) => {
    const num = parseInt(count, 10);
    if (!num || isNaN(num) || num < 1) return null;
    return Array(Math.min(num, 5)).fill(null).map((_, i) => (
      <span key={i} className={styles.star}>★</span>
    ));
  };

  return (
    <>
    <div className={styles.detailPage}>
      {/* Hero con galería */}
      <section className={styles.hero}>
        <div className={styles.heroGallery}>
          <div className={styles.mainImage}>
            <img 
              src={gallery[activeImage] || packageImage} 
              alt={packageTitle} 
            />
            <div className={styles.heroOverlay}></div>
            
            <button className={styles.backBtn} onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/paquetes')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Volver
            </button>
            
            <div className={styles.heroInfo}>
              <div className={styles.heroTags}>
                {pkg.service_type && (
                  <span className={styles.heroTag}>{pkg.service_type}</span>
                )}
                {pkg.accommodation_type && (
                  <span className={styles.heroTag}>{pkg.accommodation_type}</span>
                )}
              </div>
              <h1 className={styles.heroTitle}>{packageTitle}</h1>
              <p className={styles.heroLocation}>{pkg.destination}</p>
            </div>
          </div>
          
          {/* Thumbnails */}
          <div className={styles.thumbnails}>
            {gallery.slice(0, 4).map((img, idx) => (
              <button
                key={idx}
                className={`${styles.thumb} ${activeImage === idx ? styles.thumbActive : ''}`}
                onClick={() => setActiveImage(idx)}
              >
                <img src={img} alt={`Vista ${idx + 1}`} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Contenido Principal */}
      <div className={styles.content}>
        <div className={styles.mainCol}>
          {/* Info rápida */}
          <div className={styles.quickStats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Duración</span>
              <span className={styles.statValue}>{pkg.duration}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Aerolínea</span>
              <span className={styles.statValue}>{pkg.airline || 'Varias'}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Hotel</span>
              <span className={styles.statValue}>
                {pkg.hotel_stars && renderStars(pkg.hotel_stars)}
              </span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Máx. de personas</span>
              <span className={styles.statValue}>{pkg.persons || 2}</span>
            </div>
          </div>

          {/* Descripción */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Acerca del viaje</h2>
            <p className={styles.sectionText}>{pkg.description}</p>
          </section>

          {/* Incluye */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Qué incluye</h2>
            <div className={styles.includesList}>
              {(Array.isArray(pkg.includes) ? pkg.includes : []).map((item, index) => (
                <div key={index} className={styles.includeItem}>
                  <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Hospedaje */}
          {pkg.hotel_name && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Hospedaje</h2>
              <div className={styles.hotelCard}>
                <div className={styles.hotelInfo}>
                  <h3 className={styles.hotelName}>{pkg.hotel_name}</h3>
                  <div className={styles.hotelStars}>{renderStars(pkg.hotel_stars)}</div>
                </div>
                <div className={styles.hotelDetails}>
                  <div className={styles.hotelDetail}>
                    <span className={styles.detailLabel}>Habitación</span>
                    <span className={styles.detailValue}>{pkg.room_type || 'Estándar'}</span>
                  </div>
                  <div className={styles.hotelDetail}>
                    <span className={styles.detailLabel}>Régimen</span>
                    <span className={styles.detailValue}>{pkg.accommodation_type || 'Incluido'}</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Itinerario */}
          {pkg.itinerary && pkg.itinerary.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Itinerario</h2>
              <div className={styles.timeline}>
                {pkg.itinerary.map((day, index) => (
                  <div key={index} className={styles.timelineItem}>
                    <div className={styles.timelineMarker}>
                      <span className={styles.dayNum}>{day.day}</span>
                    </div>
                    <div className={styles.timelineContent}>
                      <h3 className={styles.timelineTitle}>{day.title}</h3>
                      <p className={styles.timelineDesc}>{day.description}</p>
                      {day.meals && day.meals.length > 0 && (
                        <div className={styles.meals}>
                          {day.meals.map((meal, i) => (
                            <span key={i} className={styles.meal}>{meal}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Itinerario PDF embebido */}
          {pkg.itinerary_pdf && (() => {
            const embedUrl = toEmbedUrl(pkg.itinerary_pdf);
            return embedUrl ? (
              <section className={styles.section}>
                <div className={styles.pdfSectionHeader}>
                  <h2 className={styles.sectionTitle} style={{ margin: 0 }}>📄 Itinerario completo en PDF</h2>
                  <a
                    href={pkg.itinerary_pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.pdfOpenLink}
                  >
                    Abrir en nueva pestaña ↗
                  </a>
                </div>
                <div className={styles.pdfViewer}>
                  <iframe
                    src={embedUrl}
                    title={`Itinerario PDF – ${packageTitle}`}
                    className={styles.pdfFrame}
                    allow="autoplay"
                  />
                </div>
              </section>
            ) : null;
          })()}

          {/* Info importante */}
          {pkg.important_info && pkg.important_info.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Información del destino</h2>
              <div className={styles.infoGrid}>
                {pkg.important_info.map((info, index) => (
                  <div key={index} className={styles.infoCard}>
                    <span className={styles.infoTitle}>{info.title}</span>
                    <span className={styles.infoText}>{info.text}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Términos */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Condiciones</h2>
            <ul className={styles.termsList}>
              {(Array.isArray(pkg.terms_conditions) 
                ? pkg.terms_conditions 
                : pkg.terms_conditions ? [pkg.terms_conditions] : []
              ).map((term, index) => (
                <li key={index} className={styles.termItem}>{term}</li>
              ))}
            </ul>
            {pkg.cancellation_policy && (
              <div className={styles.cancelPolicy}>
                <strong>Política de cancelación:</strong> {pkg.cancellation_policy}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar - Reserva */}
        <aside className={styles.sidebar}>
          <div className={styles.bookingCard}>
            <div className={styles.priceBlock}>
              {pkg.original_price && pkg.price && pkg.original_price > pkg.price && (
                <span className={styles.oldPrice}>${pkg.original_price.toLocaleString()}</span>
              )}
              <div className={styles.currentPrice}>
                <span className={styles.priceAmount}>${(pkg.price || 0).toLocaleString()}</span>
                <span className={styles.priceCurrency}>{pkg.currency || 'MXN'}</span>
              </div>
              <span className={styles.priceNote}>por persona</span>
              {discount > 0 && (
                <span className={styles.discountBadge}>{discount}% OFF</span>
              )}
            </div>

            <div className={styles.bookingInfo}>
              <div className={styles.bookingRow}>
                <span>Duración</span>
                <strong>{pkg.duration}</strong>
              </div>
              <div className={styles.bookingRow}>
                <span>Salidas</span>
                <strong>{pkg.dates || 'Consultar'}</strong>
              </div>
              {pkg.hotel_stars && (
                <div className={styles.bookingRow}>
                  <span>Hotel</span>
                  <strong>{renderStars(pkg.hotel_stars)}</strong>
                </div>
              )}
            </div>

            <button className={styles.btnPrimary} onClick={() => setShowBooking(true)}>
              Reservar ahora
            </button>
            
            <a 
              href={`https://wa.me/527753718942?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnWhatsapp}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Consultar disponibilidad
            </a>

            {pkg.itinerary_pdf && (
              <a
                href={pkg.itinerary_pdf}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnPdf}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="12" y1="18" x2="12" y2="12"/>
                  <line x1="9" y1="15" x2="15" y2="15"/>
                </svg>
                Ver Itinerario PDF
              </a>
            )}

            {pkg.rating && (
              <div className={styles.rating}>
                <span className={styles.ratingScore}>{pkg.rating}</span>
                <div className={styles.ratingStars}>{renderStars(5)}</div>
                <span className={styles.ratingCount}>{pkg.reviews_count} reseñas</span>
              </div>
            )}

            {Array.isArray(pkg.payment_options) && pkg.payment_options.length > 0 && (
              <div className={styles.paymentOptions}>
                <span className={styles.paymentLabel}>Formas de pago</span>
                <div className={styles.paymentList}>
                  {pkg.payment_options.map((method, index) => (
                    <span key={index} className={styles.paymentMethod}>{method}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>

    {showBooking && (
      <BookingModal
        packageData={pkg}
        onClose={() => setShowBooking(false)}
      />
    )}
    </>
  );
}

import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Spinner from '../components/ui/Spinner';
import QuoteModal from '../components/QuoteModal/QuoteModal';
import { useFetch } from '../hooks/useFetch';
import { getPackageById } from '../services/packageService';
import styles from './PackageDetail.module.css';

const PLACEHOLDER_IMAGES = {
  'barrancas-del-cobre': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&q=80',
  'tren-paraiso-maya': 'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=900&q=80',
  'vamos-a-colombia': 'https://images.unsplash.com/photo-1562803500-bc4dd1af4920?w=900&q=80',
  'orlando-verano-magico': 'https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?w=900&q=80',
  'tokyo-moderno': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=900&q=80',
  'bariloche-nieve': 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900&q=80',
};

// Convierte URL de Google Drive /view a /preview para iframe
function toEmbedUrl(url) {
  if (!url) return null;
  return url.replace('/view', '/preview').split('?')[0];
}

export default function PackageDetail() {
  const { id } = useParams();
  const [showQuote, setShowQuote] = useState(false);

  const fetchFn = useCallback(() => getPackageById(id), [id]);
  const { data: pkg, loading, error } = useFetch(fetchFn, [id]);

  if (loading) return <Spinner />;

  if (error || !pkg) {
    return (
      <div className={styles.error}>
        <h2 className={styles.errorTitle}>Paquete no encontrado</h2>
        <Link to="/paquetes" className="btn btn-primary">
          Ver todos los paquetes
        </Link>
      </div>
    );
  }

  const imageSrc = PLACEHOLDER_IMAGES[pkg.id] || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=900&q=80';
  const embedUrl = toEmbedUrl(pkg.itinerary_pdf);

  return (
    <div className={styles.page}>
      <div className="container">
        <Link to="/paquetes" className={styles.backLink}>
          ← Volver a paquetes
        </Link>

        <div className={styles.grid}>
          {/* Left column */}
          <div>
            <div className={styles.imageSection}>
              <img
                src={imageSrc}
                alt={pkg.title}
                className={styles.mainImage}
                loading="eager"
                width="900"
                height="563"
              />
            </div>

            <div className={styles.badges}>
              <span className={`${styles.badge} ${styles.badgePrimary}`}>
                {pkg.type === 'playa' ? '🏖' : pkg.type === 'cultural' ? '🏛' : '🏔'} {pkg.type}
              </span>
              <span className={styles.badge}>📍 {pkg.region}</span>
              <span className={styles.badge}>✈ {pkg.airline}</span>
              {pkg.featured && <span className={`${styles.badge} ${styles.badgePrimary}`}>⭐ Destacado</span>}
            </div>

            <h1 className={styles.title}>{pkg.title}</h1>
            <p className={styles.destination}>📍 {pkg.destination}</p>
            <p className={styles.description}>{pkg.description}</p>

            <h3 className={styles.benefitsTitle}>✅ Incluye</h3>
            <div className={styles.benefitsList}>
              {pkg.benefits.map((benefit, i) => (
                <div key={i} className={styles.benefitItem}>
                  <span className={styles.benefitCheck}>✓</span>
                  {benefit}
                </div>
              ))}
            </div>

            {/* Visor de itinerario embebido */}
            {embedUrl && (
              <div className={styles.pdfSection}>
                <div className={styles.pdfSectionHeader}>
                  <span className={styles.pdfSectionIcon}>🗺️</span>
                  <h3 className={styles.pdfSectionTitle}>Itinerario del viaje</h3>
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
                    title={`Itinerario ${pkg.title}`}
                    className={styles.pdfFrame}
                    allow="autoplay"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right column - booking card */}
          <div>
            <div className={styles.bookingCard}>
              <div className={styles.priceTag}>
                <div>
                  <span className={styles.priceAmount}>${pkg.price.toLocaleString()}</span>{' '}
                  <span className={styles.priceCurrency}>USD</span>
                </div>
                <div className={styles.pricePerPerson}>por persona</div>
              </div>

              <div className={styles.details}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Duración</span>
                  <span className={styles.detailValue}>{pkg.duration}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Fechas</span>
                  <span className={styles.detailValue}>
                    {new Date(pkg.dates.start).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })} -{' '}
                    {new Date(pkg.dates.end).toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Aerolínea</span>
                  <span className={styles.detailValue}>{pkg.airline}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Hotel</span>
                  <span className={styles.detailValue}>
                    {pkg.hotel} {'⭐'.repeat(pkg.hotelStars > 3 ? 1 : 0)} {pkg.hotelStars}★
                  </span>
                </div>
              </div>

              <button
                className="btn btn-primary btn-lg bookBtn"
                style={{ width: '100%', marginBottom: '0.75rem' }}
                onClick={() => setShowQuote(true)}
              >
                Reservar Ahora
              </button>
              <button
                className="btn btn-outline btn-lg"
                style={{ width: '100%', marginBottom: '0.75rem' }}
                onClick={() => setShowQuote(true)}
              >
                Solicitar Cotización
              </button>

              {pkg.itinerary_pdf && (
                <a
                  href={pkg.itinerary_pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.pdfBtn}
                >
                  <span className={styles.pdfIcon}>📄</span>
                  Descargar Itinerario PDF
                </a>
              )}

              <div className={styles.ratingRow}>
                <span className={styles.ratingStar}>⭐ {pkg.rating}</span>
                <span>({pkg.reviewCount} reseñas)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showQuote && <QuoteModal pkg={pkg} onClose={() => setShowQuote(false)} />}
    </div>
  );
}

export default function PackageDetail() {
  const { id } = useParams();
  const [showQuote, setShowQuote] = useState(false);

  const fetchFn = useCallback(() => getPackageById(id), [id]);
  const { data: pkg, loading, error } = useFetch(fetchFn, [id]);

  if (loading) return <Spinner />;

  if (error || !pkg) {
    return (
      <div className={styles.error}>
        <h2 className={styles.errorTitle}>Paquete no encontrado</h2>
        <Link to="/paquetes" className="btn btn-primary">
          Ver todos los paquetes
        </Link>
      </div>
    );
  }

  const imageSrc = PLACEHOLDER_IMAGES[pkg.id] || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=900&q=80';

  return (
    <div className={styles.page}>
      <div className="container">
        <Link to="/paquetes" className={styles.backLink}>
          ← Volver a paquetes
        </Link>

        <div className={styles.grid}>
          {/* Left column */}
          <div>
            <div className={styles.imageSection}>
              <img
                src={imageSrc}
                alt={pkg.title}
                className={styles.mainImage}
                loading="eager"
                width="900"
                height="563"
              />
            </div>

            <div className={styles.badges}>
              <span className={`${styles.badge} ${styles.badgePrimary}`}>
                {pkg.type === 'playa' ? '🏖' : pkg.type === 'cultural' ? '🏛' : '🏔'} {pkg.type}
              </span>
              <span className={styles.badge}>📍 {pkg.region}</span>
              <span className={styles.badge}>✈ {pkg.airline}</span>
              {pkg.featured && <span className={`${styles.badge} ${styles.badgePrimary}`}>⭐ Destacado</span>}
            </div>

            <h1 className={styles.title}>{pkg.title}</h1>
            <p className={styles.destination}>📍 {pkg.destination}</p>
            <p className={styles.description}>{pkg.description}</p>

            <h3 className={styles.benefitsTitle}>✅ Incluye</h3>
            <div className={styles.benefitsList}>
              {pkg.benefits.map((benefit, i) => (
                <div key={i} className={styles.benefitItem}>
                  <span className={styles.benefitCheck}>✓</span>
                  {benefit}
                </div>
              ))}
            </div>
          </div>

          {/* Right column - booking card */}
          <div>
            <div className={styles.bookingCard}>
              <div className={styles.priceTag}>
                <div>
                  <span className={styles.priceAmount}>${pkg.price.toLocaleString()}</span>{' '}
                  <span className={styles.priceCurrency}>USD</span>
                </div>
                <div className={styles.pricePerPerson}>por persona</div>
              </div>

              <div className={styles.details}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Duración</span>
                  <span className={styles.detailValue}>{pkg.duration}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Fechas</span>
                  <span className={styles.detailValue}>
                    {new Date(pkg.dates.start).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })} -{' '}
                    {new Date(pkg.dates.end).toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Aerolínea</span>
                  <span className={styles.detailValue}>{pkg.airline}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Hotel</span>
                  <span className={styles.detailValue}>
                    {pkg.hotel} {'⭐'.repeat(pkg.hotelStars > 3 ? 1 : 0)} {pkg.hotelStars}★
                  </span>
                </div>
              </div>

              <button
                className="btn btn-primary btn-lg bookBtn"
                style={{ width: '100%', marginBottom: '0.75rem' }}
                onClick={() => setShowQuote(true)}
              >
                Reservar Ahora
              </button>
              <button
                className="btn btn-outline btn-lg"
                style={{ width: '100%', marginBottom: '0.75rem' }}
                onClick={() => setShowQuote(true)}
              >
                Solicitar Cotización
              </button>

              {pkg.itinerary_pdf && (
                <a
                  href={pkg.itinerary_pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.pdfBtn}
                >
                  <span className={styles.pdfIcon}>📄</span>
                  Descargar Itinerario PDF
                </a>
              )}

              <div className={styles.ratingRow}>
                <span className={styles.ratingStar}>⭐ {pkg.rating}</span>
                <span>({pkg.reviewCount} reseñas)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showQuote && <QuoteModal pkg={pkg} onClose={() => setShowQuote(false)} />}
    </div>
  );
}

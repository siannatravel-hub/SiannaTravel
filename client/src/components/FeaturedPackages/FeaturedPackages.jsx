import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPackages } from '../../lib/packages';
import styles from './FeaturedPackages.module.css';

export default function FeaturedPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPackages() {
      try {
        const data = await getPackages();
        const featured = (data || []).filter(p => p.is_featured && p.is_active !== false);
        setPackages(featured);
      } catch (err) {
        console.error('Error loading featured packages:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPackages();
  }, []);

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.header}>
            <span className={styles.badge}>Ofertas Exclusivas</span>
            <h2 className={styles.title}>Destinos en Promoción</h2>
            <p className={styles.subtitle}>
              Aprovecha estas ofertas por tiempo limitado
            </p>
          </div>
          <div className={styles.grid}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>Ofertas Exclusivas</span>
          <h2 className={styles.title}>Destinos en Promoción</h2>
          <p className={styles.subtitle}>
            Aprovecha estas ofertas por tiempo limitado
          </p>
        </div>

        <div className={styles.grid}>
          {packages.map((pkg) => (
            <article key={pkg.id} className={styles.card}>
              {/* Imagen clicable → vista del paquete */}
              <Link to={`/paquetes/${pkg.id}`} className={styles.cardImageLink} aria-label={`Ver ${pkg.title}`}>
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className={styles.cardImage}
                  loading="lazy"
                />
                <div className={styles.cardOverlay} />
              </Link>

              {pkg.tag && <span className={styles.cardTag}>{pkg.tag}</span>}

              {pkg.discount > 0 && (
                <span className={styles.cardDiscount}>-{pkg.discount}%</span>
              )}

              <div className={styles.cardContent}>
                <span className={styles.cardDestination}>
                  {pkg.destination}
                </span>
                <h3 className={styles.cardTitle}>{pkg.title}</h3>

                <div className={styles.cardMeta}>
                  <span className={styles.cardRating}>
                    ★ {pkg.rating}
                  </span>
                  <span>{pkg.nights} noches</span>
                </div>

                <div className={styles.cardPricing}>
                  <span className={styles.cardPrice}>
                    ${pkg.price?.toLocaleString()}
                  </span>
                  {pkg.original_price > pkg.price && (
                    <span className={styles.cardOriginalPrice}>
                      ${pkg.original_price?.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className={styles.cardActions}>
                  <Link to={`/paquetes/${pkg.id}`} className={styles.cardDetailBtn}>
                    Ver detalle →
                  </Link>
                  {pkg.itinerary_pdf && (
                    <a
                      href={pkg.itinerary_pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.cardPdfBtn}
                      title={`Descargar itinerario: ${pkg.title}`}
                    >
                      📄 Itinerario PDF
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

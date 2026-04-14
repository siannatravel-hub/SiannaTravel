import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getPackages } from '../lib/packages';
import { useSEO } from '../hooks/useSEO';
import styles from './Packages.module.css';

const FILTER_OPTIONS = [
  { value: 'todos', label: 'Todos', icon: '🌍' },
  { value: 'nacional', label: 'Nacionales', icon: '🇲🇽' },
  { value: 'internacional', label: 'Internacionales', icon: '✈️' },
];

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('todos');

  useSEO({
    title: 'Paquetes de Viaje \u2013 M\u00e9xico y el Mundo',
    description: 'Explora todos nuestros paquetes vacacionales: vuelo + hotel, all-inclusive, tours nacionales e internacionales. Reserva desde Tulancingo con Sianna Travel.',
    url: '/paquetes',
  });

  useEffect(() => {
    async function loadPackages() {
      try {
        const data = await getPackages();
        setPackages(data || []);
      } catch (error) {
        console.error('Error loading packages:', error);
      } finally {
        setLoading(false);
      }
    }
    loadPackages();
  }, []);

  const filteredPackages = useMemo(() => {
    if (activeFilter === 'todos') return packages;
    
    return packages.filter(pkg => {
      const flightType = pkg.flight_type || 'internacional';
      if (activeFilter === 'nacional') {
        return flightType === 'nacional';
      }
      return flightType === 'internacional';
    });
  }, [packages, activeFilter]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Nuestros Paquetes</h1>
            <p className={styles.subtitle}>Descubre destinos increíbles</p>
          </div>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Cargando paquetes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Nuestros Paquetes</h1>
          <p className={styles.subtitle}>
            Encuentra el destino perfecto para tu próxima aventura
          </p>
        </div>

        {/* Filter Tabs */}
        <div className={styles.filterTabs}>
          {FILTER_OPTIONS.map(option => (
            <button
              key={option.value}
              className={`${styles.filterTab} ${activeFilter === option.value ? styles.filterTabActive : ''}`}
              onClick={() => setActiveFilter(option.value)}
            >
              <span className={styles.filterIcon}>{option.icon}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className={styles.resultCount}>
          {filteredPackages.length} paquete{filteredPackages.length !== 1 ? 's' : ''} disponible{filteredPackages.length !== 1 ? 's' : ''}
        </p>

        {/* Packages Grid */}
        {filteredPackages.length > 0 ? (
          <div className={styles.grid}>
            {filteredPackages.map(pkg => (
              <Link 
                to={`/paquetes/${pkg.id}`} 
                key={pkg.id} 
                className={styles.card}
              >
                <div className={styles.cardImage}>
                  <img 
                    src={pkg.image} 
                    alt={pkg.title || pkg.name} 
                    loading="lazy"
                  />
                  <div className={styles.cardOverlay}></div>
                  
                  {pkg.discount > 0 && (
                    <span className={styles.cardDiscount}>-{pkg.discount}%</span>
                  )}
                  
                  <span className={styles.cardType}>
                    {(pkg.flight_type || 'internacional') === 'nacional' ? '🇲🇽 Nacional' : '✈️ Internacional'}
                  </span>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardDestination}>
                    📍 {pkg.destination}{pkg.country ? `, ${pkg.country}` : ''}
                  </div>
                  
                  <h3 className={styles.cardTitle}>{pkg.title || pkg.name}</h3>
                  
                  <p className={styles.cardDescription}>
                    {pkg.description?.slice(0, 100)}{pkg.description?.length > 100 ? '...' : ''}
                  </p>

                  <div className={styles.cardMeta}>
                    <span className={styles.cardDuration}>
                      ⏱️ {pkg.duration}
                    </span>
                    {pkg.rating && (
                      <span className={styles.cardRating}>
                        ⭐ {pkg.rating}
                      </span>
                    )}
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.cardPrice}>
                      {pkg.original_price && pkg.original_price > pkg.price && (
                        <span className={styles.originalPrice}>
                          ${pkg.original_price?.toLocaleString()}
                        </span>
                      )}
                      <span className={styles.currentPrice}>
                        ${pkg.price?.toLocaleString()}
                      </span>
                      <span className={styles.priceLabel}>{pkg.currency || 'MXN'}</span>
                    </div>
                    
                    <span className={styles.cardBtn}>
                      Ver más →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🔍</div>
            <p className={styles.emptyText}>No hay paquetes disponibles en esta categoría</p>
            <button 
              className={styles.emptyBtn}
              onClick={() => setActiveFilter('todos')}
            >
              Ver todos los paquetes
            </button>
          </div>
        )}

        {/* WhatsApp CTA */}
        <div className={styles.packagesWhatsapp}>
          <p className={styles.packagesWhatsappText}>
            ¿No encuentras lo que buscas? Cuéntanos tu viaje ideal
          </p>
          <a
            href="https://wa.me/527753718942?text=Hola%2C%20quiero%20cotizar%20un%20viaje%20personalizado"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.packagesWhatsappBtn}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Cotizar viaje personalizado
          </a>
        </div>
      </div>
    </div>
  );
}


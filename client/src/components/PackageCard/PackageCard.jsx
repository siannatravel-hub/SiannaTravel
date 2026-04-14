import { Link } from 'react-router-dom';
import styles from './PackageCard.module.css';

const TYPE_LABELS = {
  playa: 'Playa',
  cultural: 'Cultural',
  aventura: 'Aventura',
};

// Imágenes de alta calidad de destinos - después reemplazar con propias
const PLACEHOLDER_IMAGES = {
  'barrancas-del-cobre': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=90',
  'tren-paraiso-maya': 'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800&q=90',
  'vamos-a-colombia': 'https://images.unsplash.com/photo-1562803500-bc4dd1af4920?w=800&q=90',
  'orlando-verano-magico': 'https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?w=800&q=90',
  'tokyo-moderno': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=90',
  'bariloche-nieve': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=90',
  'maldivas-lujo': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=90',
  'santorini-grecia': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=90',
};

export default function PackageCard({ pkg }) {
  const imageSrc = PLACEHOLDER_IMAGES[pkg.id] || `https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80`;

  return (
    <Link to={`/paquetes/${pkg.id}`} className={styles.cardLink}>
      <article className={styles.card}>
        <div className={styles.imageWrapper}>
          <img
            src={imageSrc}
            alt={pkg.title}
            className={styles.image}
            loading="lazy"
            decoding="async"
            width="600"
            height="450"
          />
          {pkg.featured && <span className={styles.badge}>Destacado</span>}
          <span className={styles.typeBadge}>{TYPE_LABELS[pkg.type] || pkg.type}</span>
        </div>

        <div className={styles.body}>
          <span className={styles.destination}>{pkg.destination}</span>
          <h3 className={styles.title}>{pkg.title}</h3>
          <div className={styles.meta}>
            <span className={styles.rating}>⭐ {pkg.rating}</span>
            <span>{pkg.duration}</span>
          </div>
          <p className={styles.description}>{pkg.description}</p>
        </div>

        <div className={styles.footer}>
          <div>
            <span className={styles.price}>${pkg.price.toLocaleString()}</span>
            <span className={styles.priceLabel}>{pkg.currency || 'MXN'} / persona</span>
          </div>
          <span className={styles.detailBtn}>
            Ver detalle
            <span>→</span>
          </span>
        </div>
      </article>
    </Link>
  );
}

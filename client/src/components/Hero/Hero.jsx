import { Link } from 'react-router-dom';
import styles from './Hero.module.css';

const HERO_BG = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=90';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div
        className={styles.heroBg}
        style={{ backgroundImage: `url(${HERO_BG})` }}
        aria-hidden="true"
      />
      <div className={styles.heroOverlay} aria-hidden="true" />

      {/* Línea punteada decorativa */}
      <svg className={styles.dashedCurve} viewBox="0 0 220 400" fill="none" aria-hidden="true">
        <path
          d="M 20 400 Q 180 280 160 160 Q 140 60 220 10"
          stroke="white"
          strokeWidth="3"
          strokeDasharray="12 10"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
      </svg>

      <div className={styles.heroContent}>
        {/* Texto principal */}
        <div className={styles.heroText}>
          <img src="/images/logos/logosianna-morado.png" alt="Sianna Travel" className={styles.heroLogo} />
          <h1 className={styles.heroTitle}>
            <span className={styles.heroLine}>VIAJA CON</span>
            <span className={styles.heroLineFlex}>
              <span className={styles.heroBadge}>CONFIANZA</span>
            </span>
            <span className={styles.heroLine}>
              VIVE <span className={styles.planeIcon}>✈</span>
            </span>
            <span className={styles.heroLine}>CON EMOCIÓN</span>
          </h1>

          <p className={styles.heroSubtitle}>¿Te ayudamos?</p>

          <div className={styles.heroActions}>
            <Link to="/contacto" className={styles.btnEscribenos}>
              Escríbenos
            </Link>
          </div>

          <div className={styles.heroPhones}>
            <a href="tel:7752658513" className={styles.heroPhone}>775 265 8513</a>
            <a href="tel:7757525171" className={styles.heroPhone}>775 752 5171</a>
          </div>
        </div>
      </div>
    </section>
  );
}


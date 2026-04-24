import { Link } from 'react-router-dom';
import styles from './Ofertas.module.css';

export default function Ofertas() {
  return (
    <div className={styles.page}>

      {/* Header de la sección */}
      <div className={styles.header}>
        <p className={styles.breadcrumb}>
          <Link to="/">Inicio</Link> / Ofertas
        </p>
        <h1 className={styles.title}>Ofertas de Viaje</h1>
        <p className={styles.subtitle}>
          Descubre destinos increíbles con las mejores promociones disponibles para ti.
        </p>
      </div>

      {/* iframe con colores Sianna */}
      <div className={styles.iframeWrapper}>
        <iframe
          src="https://www.megatravel.com.mx/tools/ofertas-viaje.php?Dest=&txtColor=1D1D1D&aColor=6B21A8&ahColor=9333EA&thBG=4C1D95&thTxColor=FFFFFF&lblTPaq=7C3AED&lblTRange=4C1D95&lblNumRange=7C3AED&itemBack=F3E8FF&ItemHov=6B21A8&txtColorHov=ffffff&ff=1"
          width="800"
          height="1200"
          frameBorder="0"
          allowTransparency="true"
          style={{ maxWidth: '100%', border: 'none' }}
          title="Ofertas de viaje"
        />
      </div>

      {/* CTA de vuelta a Sianna */}
      <div className={styles.cta}>
        <p className={styles.ctaText}>¿Prefieres una experiencia personalizada?</p>
        <Link to="/paquetes" className={styles.ctaBtn}>
          Ver paquetes Sianna Travel →
        </Link>
        <Link to="/contacto" className={styles.ctaBtnSecondary}>
          Contactar un asesor
        </Link>
      </div>

    </div>
  );
}

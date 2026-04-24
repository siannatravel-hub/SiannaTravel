import { Link } from 'react-router-dom';
import styles from './Ofertas.module.css';

export default function Ofertas() {
  return (
    <div className={styles.page}>

      {/* Header de la sección */}
      <div className={styles.header}>
        <p className={styles.breadcrumb}>
          <Link to="/">Inicio</Link> / Más ofertas
        </p>
        <h1 className={styles.title}>Más opciones de viaje</h1>
        <p className={styles.subtitle}>
          Explora una selección adicional de paquetes disponibles a través de nuestros aliados.
          Para una atención personalizada, te recomendamos nuestros{' '}
          <Link to="/paquetes" className={styles.linkAccent}>paquetes propios →</Link>
        </p>
        <div className={styles.disclaimer}>
          <span className={styles.disclaimerIcon}>ℹ</span>
          Estas ofertas son proporcionadas por un proveedor externo. Precios y disponibilidad
          sujetos a cambio. Contáctanos para confirmar antes de reservar.
        </div>
      </div>

      {/* Contenedor del iframe con tratamiento visual secundario */}
      <div className={styles.iframeWrapper}>
        <iframe
          src="https://www.megatravel.com.mx/tools/ofertas-viaje.php?Dest=&txtColor=1D1D1D&lblTPaq=9900FF&lblTRange=570090&lblNumRange=9900FF&itemBack=D5D5D5&ItemHov=360058&txtColorHov=ffffff&ff=1"
          width="800"
          height="1200"
          frameBorder="0"
          allowTransparency="true"
          style={{ maxWidth: '100%', border: 'none' }}
          title="Más ofertas de viaje"
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

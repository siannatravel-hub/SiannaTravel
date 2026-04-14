import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerGrid}>
          <div>
            <Link to="/" className={styles.footerBrand}>
              <img 
                src="/images/logos/logosianna.png" 
                alt="Sianna Travel" 
                className={styles.footerLogo}
              />
            </Link>
            <p className={styles.footerDesc}>
              Tu agencia de viajes de confianza. Creamos experiencias inolvidables
              en los mejores destinos del mundo con atención personalizada.
            </p>
          </div>

          <div>
            <h4 className={styles.footerTitle}>Explorar</h4>
            <Link to="/paquetes" className={styles.footerLink}>Todos los Paquetes</Link>
            <Link to="/viajes-playa" className={styles.footerLink}>Destinos de Playa</Link>
            <Link to="/viajes-culturales" className={styles.footerLink}>Viajes Culturales</Link>
            <Link to="/viajes-aventura" className={styles.footerLink}>Aventura y Ecoturismo</Link>
            <Link to="/blog" className={styles.footerLink}>Blog de Viajes</Link>
          </div>

          <div>
            <h4 className={styles.footerTitle}>Compañía</h4>
            <Link to="/contacto" className={styles.footerLink}>Contacto</Link>
            <Link to="/nosotros" className={styles.footerLink}>Sobre Nosotros</Link>
            <Link to="/terminos" className={styles.footerLink}>Términos</Link>
            <Link to="/privacidad" className={styles.footerLink}>Privacidad</Link>
          </div>

          <div>
            <h4 className={styles.footerTitle}>Contacto</h4>
            <span className={styles.footerLink}>info@siannatravel.com</span>
            <span className={styles.footerLink}>+52 (55) 1234-5678</span>
            <span className={styles.footerLink}>Ciudad de México, MX</span>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span>&copy; {new Date().getFullYear()} Sianna Travel. Todos los derechos reservados.</span>
          <span>Diseñado para viajeros</span>
        </div>
      </div>
    </footer>
  );
}

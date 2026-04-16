import { Link } from 'react-router-dom';
// import Hero from '../components/Hero/Hero'; // Original guardado como respaldo
import Hero from '../components/Hero/HeroCarousel';
import FeaturedPackages from '../components/FeaturedPackages/FeaturedPackages';
import FlightHotelServices from '../components/FlightHotelServices/FlightHotelServices';
import Testimonials from '../components/Testimonials/Testimonials';
import WhyUs from '../components/WhyUs/WhyUs';
import { useSEO } from '../hooks/useSEO';
import styles from './Home.module.css';

export default function Home() {
  useSEO({
    title: 'Agencia de Viajes en Tulancingo | Tours y Paquetes Vacacionales',
    description: 'Sianna Travel — agencia de viajes en Tulancingo, Hidalgo. Paquetes vacacionales, tours turísticos y experiencias únicas por México y el mundo. Viaja con confianza.',
    url: '/',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'TravelAgency',
      name: 'Sianna Travel',
      url: 'https://siannatravel.com',
      telephone: '+52-775-265-8513',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Tulancingo de Bravo',
        addressRegion: 'Hidalgo',
        addressCountry: 'MX',
      },
      priceRange: '$$',
      openingHours: 'Mo-Fr 09:00-18:00',
      sameAs: [],
    },
  });

  return (
    <>
      <Hero />

      {/* Promociones Destacadas - Editables desde Admin */}
      <FeaturedPackages />

      {/* CTA para ver todos los paquetes */}
      <section className={styles.exploreSection}>
        <div className="container">
          <div className={styles.exploreInner}>
            <img src="/images/logos/logosianna.png" alt="Sianna Travel" className={styles.exploreLogo} />
            <div className={styles.exploreText}>
              <h2 className={styles.exploreTitle}>¿Quieres ver todos los destinos?</h2>
              <p className={styles.exploreSubtitle}>Tenemos paquetes nacionales e internacionales para todos los gustos y presupuestos.</p>
            </div>
            <Link to="/paquetes" className={styles.exploreBtn}>
              Ver todos los paquetes →
            </Link>
          </div>
        </div>
      </section>

      {/* Servicios de Vuelos y Hoteles */}
      <FlightHotelServices />

      {/* Why Us */}
      <WhyUs />

      {/* Testimonials */}
      <Testimonials />

      {/* WhatsApp CTA Band */}
      <section className={styles.whatsappCta}>
        <div className={styles.whatsappCtaInner}>
          <div className={styles.whatsappCtaText}>
            <h3 className={styles.whatsappCtaTitle}>¿Tienes dudas? Escríbenos directo</h3>
            <p className={styles.whatsappCtaDesc}>
              Nuestros asesores de viaje están disponibles para ayudarte en tiempo real
            </p>
          </div>
          <a
            href="https://wa.me/527753718942?text=Hola%2C%20me%20interesa%20conocer%20sus%20paquetes%20de%20viaje"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappCtaBtn}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chatea con un asesor
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>¿Listo para tu próxima aventura?</h2>
        <p className={styles.ctaSubtitle}>
          Contáctanos hoy y diseñaremos el viaje perfecto para ti
        </p>
        <div className={styles.ctaActions}>
          <Link to="/paquetes" className="btn btn-secondary btn-lg">
            Explorar Paquetes
          </Link>
          <a
            href="https://wa.me/527753718942?text=Hola%2C%20quiero%20cotizar%20un%20viaje%20personalizado"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-lg"
            style={{ borderColor: '#fff', color: '#fff' }}
          >
            Contactar por WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}

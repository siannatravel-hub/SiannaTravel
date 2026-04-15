import styles from './FlightHotelServices.module.css';

const FLIGHTS_IMG = 'https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=800&q=85';
const HOTELS_IMG = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=85';

export default function FlightHotelServices() {
  return (
    <section className={styles.services}>
      {/* Header con fondo fotográfico */}
      <div className={styles.heroBar}>
        <div className={styles.heroBarOverlay} />
        <div className={`container ${styles.heroBarContent}`}>
          <span className={styles.badge}>Nuestros Servicios</span>
          <h2 className={styles.title}>Vuelos & Hoteles</h2>
          <p className={styles.subtitle}>
            Conectamos tu destino soñado con vuelos nacionales e internacionales y
            hospedaje en los hoteles más exclusivos del mundo.
          </p>
        </div>
      </div>

      <div className="container">
        <div className={styles.grid}>
          {/* Vuelos */}
          <div className={styles.card}>
            <div className={styles.cardImage}>
              <img src={FLIGHTS_IMG} alt="Vista aérea de avión sobre las nubes" loading="lazy" />
              <div className={styles.cardImageOverlay} />
              <span className={styles.cardLabel}>Vuelos</span>
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>Venta de Vuelos</h3>
              <p className={styles.cardDesc}>
                Boletos aéreos con las principales aerolíneas del mundo.
                Encontramos las mejores tarifas para tu próximo destino.
              </p>
              <ul className={styles.cardList}>
                <li>Rutas nacionales a todo México</li>
                <li>Conexiones internacionales a cualquier destino</li>
                <li>Tarifas competitivas y ofertas exclusivas</li>
                <li>Asesoría personalizada en cada reserva</li>
              </ul>
              <a
                href="https://wa.me/527753718942?text=Hola%2C%20me%20interesa%20cotizar%20un%20vuelo"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.cardBtn}
              >
                Cotiza ahora por WhatsApp
              </a>
            </div>
          </div>

          {/* Hoteles */}
          <div className={styles.card}>
            <div className={styles.cardImage}>
              <img src={HOTELS_IMG} alt="Piscina infinita de resort de lujo al atardecer" loading="lazy" />
              <div className={styles.cardImageOverlay} />
              <span className={styles.cardLabel}>Hoteles</span>
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>Reservación de Hoteles</h3>
              <p className={styles.cardDesc}>
                Desde boutiques con encanto hasta resorts all-inclusive de clase mundial.
                Tu estancia perfecta, al mejor precio.
              </p>
              <ul className={styles.cardList}>
                <li>Hoteles en los mejores destinos nacionales</li>
                <li>Resorts internacionales de primer nivel</li>
                <li>Mejores precios garantizados</li>
                <li>Opciones para cada estilo y presupuesto</li>
              </ul>
              <span className={styles.cardTag}>Próximamente: disponibilidad en línea</span>
            </div>
          </div>
        </div>

        {/* Airlines */}
        <div className={styles.airlines}>
          <p className={styles.airlinesLabel}>Trabajamos con las principales aerolíneas</p>
          <div className={styles.airlinesLogos}>
            <span className={styles.airlinePlaceholder}>Aerolíneas próximamente</span>
          </div>
        </div>

        {/* CTA */}
        <div className={styles.ctaBand}>
          <div className={styles.ctaContent}>
            <h3 className={styles.ctaTitle}>¿Listo para despegar?</h3>
            <p className={styles.ctaText}>
              Cotiza tu vuelo u hotel con nuestros asesores de viaje. Atención personalizada y las mejores opciones para ti.
            </p>
          </div>
          <a
            href="https://wa.me/527753718942?text=Hola%2C%20me%20interesa%20cotizar%20un%20vuelo%20%2F%20hotel"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaBtn}
          >
            Cotizar ahora
          </a>
        </div>
      </div>
    </section>
  );
}

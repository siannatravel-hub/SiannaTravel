import styles from './FlightHotelServices.module.css';

export default function FlightHotelServices() {
  return (
    <section className={styles.services}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.badge}>Servicios</span>
          <h2 className={styles.title}>Vuelos y Hoteles</h2>
          <p className={styles.subtitle}>
            Reserva vuelos nacionales e internacionales y hospedaje en los mejores hoteles del mundo, todo desde un solo lugar.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Vuelos */}
          <div className={styles.card}>
            <div className={styles.cardIcon}>✈️</div>
            <h3 className={styles.cardTitle}>Venta de Vuelos</h3>
            <p className={styles.cardDesc}>
              Boletos aéreos nacionales e internacionales con las principales aerolíneas. Encuentra las mejores tarifas y disponibilidad en tiempo real.
            </p>
            <ul className={styles.cardList}>
              <li>Vuelos nacionales a todo México</li>
              <li>Vuelos internacionales a cualquier destino</li>
              <li>Tarifas competitivas y ofertas exclusivas</li>
              <li>Asistencia personalizada en tu reserva</li>
            </ul>
            <span className={styles.cardTag}>Próximamente: reserva en línea</span>
          </div>

          {/* Hoteles */}
          <div className={styles.card}>
            <div className={styles.cardIcon}>🏨</div>
            <h3 className={styles.cardTitle}>Reservación de Hoteles</h3>
            <p className={styles.cardDesc}>
              Hospedaje en hoteles, resorts y boutiques de primer nivel. Desde escapadas nacionales hasta estancias internacionales de lujo.
            </p>
            <ul className={styles.cardList}>
              <li>Hoteles en destinos nacionales</li>
              <li>Resorts internacionales all-inclusive</li>
              <li>Mejores precios garantizados</li>
              <li>Opciones para todos los presupuestos</li>
            </ul>
            <span className={styles.cardTag}>Próximamente: disponibilidad en línea</span>
          </div>
        </div>

        {/* Airlines placeholder */}
        <div className={styles.airlines}>
          <p className={styles.airlinesLabel}>Trabajamos con las principales aerolíneas</p>
          <div className={styles.airlinesLogos}>
            <span className={styles.airlinePlaceholder}>Aerolíneas próximamente</span>
          </div>
        </div>

        <div className={styles.ctaBand}>
          <p className={styles.ctaText}>
            ¿Necesitas cotizar un vuelo u hotel? Contáctanos y te ayudamos a encontrar la mejor opción.
          </p>
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

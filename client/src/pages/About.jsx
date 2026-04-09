import { useSEO } from '../hooks/useSEO';
import styles from './StaticPage.module.css';

export default function About() {
  useSEO({
    title: 'Nosotros – Quiénes Somos',
    description: 'Conoce la historia de Sianna Travel, agencia de viajes fundada en Tulancingo, Hidalgo. Más de 10 años creando experiencias de viaje inolvidables por México y el mundo.',
    url: '/nosotros',
  });
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Sobre Nosotros</h1>
        <p className={styles.heroSubtitle}>Conoce la historia detrás de Sianna Travel</p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Nuestra Historia</h2>
          <p className={styles.text}>
            Sianna Travel nació en 2018 con una visión clara: hacer que viajar sea una experiencia 
            accesible, memorable y libre de complicaciones. Fundada por un grupo de apasionados 
            viajeros, nuestra agencia se ha convertido en un referente en el sector turístico mexicano.
          </p>
          <p className={styles.text}>
            Desde nuestros inicios, hemos gestionado más de 5,000 viajes exitosos, 
            llevando a familias, parejas y grupos de amigos a descubrir los destinos 
            más impresionantes de México y el mundo.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Nuestra Misión</h2>
          <p className={styles.text}>
            Crear experiencias de viaje extraordinarias que superen las expectativas de nuestros 
            clientes, combinando destinos espectaculares con un servicio personalizado y atención 
            al detalle en cada paso del proceso.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Nuestra Visión</h2>
          <p className={styles.text}>
            Ser la agencia de viajes preferida en México, reconocida por nuestra excelencia 
            en servicio, innovación en productos turísticos y compromiso con la satisfacción 
            total del cliente.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Nuestros Valores</h2>
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Confianza</h3>
              <p className={styles.cardText}>
                Construimos relaciones duraderas basadas en la transparencia y honestidad.
              </p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Excelencia</h3>
              <p className={styles.cardText}>
                Nos esforzamos por superar expectativas en cada viaje que organizamos.
              </p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Pasión</h3>
              <p className={styles.cardText}>
                Amamos lo que hacemos y eso se refleja en cada experiencia que creamos.
              </p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Compromiso</h3>
              <p className={styles.cardText}>
                Estamos contigo antes, durante y después de tu viaje.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>¿Por qué elegirnos?</h2>
          <ul className={styles.list}>
            <li>Más de 8 años de experiencia en el sector turístico</li>
            <li>Alianzas con los mejores hoteles y aerolíneas</li>
            <li>Precios competitivos y promociones exclusivas</li>
            <li>Atención personalizada 24/7</li>
            <li>Garantía de satisfacción en todos nuestros paquetes</li>
            <li>Asesores de viaje certificados</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Nuestro Equipo</h2>
          <p className={styles.text}>
            Contamos con un equipo de más de 15 profesionales especializados en diferentes 
            destinos y tipos de viaje. Desde expertos en luna de miel hasta especialistas 
            en viajes de aventura, tenemos el asesor perfecto para ti.
          </p>
        </section>
      </div>
    </div>
  );
}

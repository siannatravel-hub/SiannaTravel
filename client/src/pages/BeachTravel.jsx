import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import styles from './CategoryPage.module.css';

export default function BeachTravel() {
  useSEO({
    title: 'Viajes de Playa – Caribe, All-Inclusive y Resorts',
    description: 'Paquetes de viaje a playas del Caribe mexicano, Riviera Maya, Cancun y destinos internacionales. All-inclusive, hoteles boutique y experiencias de playa desde Tulancingo.',
    url: '/viajes-playa',
  });

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero} style={{backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600)'}}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <span className={styles.heroTag}>Destinos de Playa</span>
          <h1 className={styles.heroTitle}>Donde el mar cuenta historias</h1>
          <p className={styles.heroSubtitle}>
            Arenas blancas, aguas cristalinas y atardeceres que pintan el cielo. 
            Descubre los paraísos costeros que cambiarán tu forma de ver el mundo.
          </p>
          <Link to="/paquetes?type=playa" className={styles.heroBtn}>
            Ver paquetes de playa
          </Link>
        </div>
      </section>

      {/* Intro */}
      <section className={styles.intro}>
        <div className={styles.introContent}>
          <h2 className={styles.introTitle}>El llamado del océano</h2>
          <p className={styles.introText}>
            Hay algo mágico en despertar con el sonido de las olas. El mar tiene el poder 
            de reconectarnos con lo esencial: la paz, la alegría y los momentos compartidos 
            con quienes amamos. En Sianna Travel, hemos curado los destinos de playa más 
            extraordinarios de México y el Caribe para que tu próxima escapada sea inolvidable.
          </p>
        </div>
      </section>

      {/* Experiencias */}
      <section className={styles.experiences}>
        <h2 className={styles.sectionTitle}>Experiencias que te esperan</h2>
        <div className={styles.expGrid}>
          <div className={styles.expCard}>
            <div className={styles.expImage} style={{backgroundImage: 'url(https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800)'}}></div>
            <div className={styles.expContent}>
              <h3>Romance frente al mar</h3>
              <p>
                Cenas con los pies en la arena, suites con vista al océano y spas de clase mundial. 
                Los mejores resorts del Caribe mexicano esperan a las parejas que buscan reconectar.
              </p>
            </div>
          </div>
          <div className={styles.expCard}>
            <div className={styles.expImage} style={{backgroundImage: 'url(https://images.unsplash.com/photo-1602002418082-dd4a8f8c8c2a?w=800)'}}></div>
            <div className={styles.expContent}>
              <h3>Aventuras en familia</h3>
              <p>
                Parques acuáticos, snorkel con tortugas y castillos de arena. Crea recuerdos que 
                tus hijos contarán a sus hijos en destinos diseñados para todas las edades.
              </p>
            </div>
          </div>
          <div className={styles.expCard}>
            <div className={styles.expImage} style={{backgroundImage: 'url(https://images.unsplash.com/photo-1530053969600-caed2596d242?w=800)'}}></div>
            <div className={styles.expContent}>
              <h3>Deportes acuáticos</h3>
              <p>
                Surf en Puerto Escondido, kayak en cenotes, paddleboard al amanecer. 
                Para los espíritus inquietos que buscan adrenalina junto al mar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Destinos destacados */}
      <section className={styles.destinations}>
        <h2 className={styles.sectionTitle}>Destinos que enamoran</h2>
        <div className={styles.destGrid}>
          <div className={styles.destCard}>
            <img src="https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=600" alt="Cancún" />
            <div className={styles.destInfo}>
              <h3>Cancún</h3>
              <p>El icono del Caribe mexicano con playas de postal y vida nocturna vibrante.</p>
            </div>
          </div>
          <div className={styles.destCard}>
            <img src="https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=600" alt="Los Cabos" />
            <div className={styles.destInfo}>
              <h3>Los Cabos</h3>
              <p>Donde el desierto se encuentra con el mar en paisajes cinematográficos.</p>
            </div>
          </div>
          <div className={styles.destCard}>
            <img src="https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=600" alt="Riviera Maya" />
            <div className={styles.destInfo}>
              <h3>Riviera Maya</h3>
              <p>Cenotes místicos, ruinas mayas y playas vírgenes en perfecta armonía.</p>
            </div>
          </div>
          <div className={styles.destCard}>
            <img src="https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600" alt="Puerto Vallarta" />
            <div className={styles.destInfo}>
              <h3>Puerto Vallarta</h3>
              <p>Encanto colonial, malecón romántico y atardeceres sobre el Pacífico.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className={styles.testimonial}>
        <blockquote className={styles.quote}>
          "Celebramos nuestro aniversario en Cancún con Sianna Travel. Cada detalle fue perfecto: 
          la suite con vista al mar, la cena en la playa, el tour privado a Isla Mujeres. 
          Fue el viaje de nuestras vidas."
        </blockquote>
        <cite className={styles.cite}>— María y Carlos, Ciudad de México</cite>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>¿Listo para sentir la arena entre tus dedos?</h2>
        <p className={styles.ctaText}>
          Nuestros asesores especializados en destinos de playa te ayudarán a encontrar 
          el paraíso perfecto para tu próxima aventura.
        </p>
        <div className={styles.ctaButtons}>
          <Link to="/paquetes?type=playa" className={styles.ctaBtnPrimary}>
            Explorar paquetes
          </Link>
          <Link to="/contacto" className={styles.ctaBtnSecondary}>
            Hablar con un asesor
          </Link>
        </div>
      </section>
    </div>
  );
}

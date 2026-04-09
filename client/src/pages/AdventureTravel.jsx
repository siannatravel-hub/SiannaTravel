import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import styles from './CategoryPage.module.css';

export default function AdventureTravel() {
  useSEO({
    title: 'Viajes de Aventura – Ecoturismo y Naturaleza',
    description: 'Paquetes de viaje de aventura: trekking, cascadas, canyoñng, ecoturismo y más. Explora México y el mundo con Sianna Travel desde Tulancingo, Hidalgo.',
    url: '/viajes-aventura',
  });

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero} style={{backgroundImage: 'url(https://images.unsplash.com/photo-1551632811-561732d1e306?w=1600)'}}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <span className={styles.heroTag}>Viajes de Aventura</span>
          <h1 className={styles.heroTitle}>Para quienes sienten el llamado de lo salvaje</h1>
          <p className={styles.heroSubtitle}>
            Cumbres que desafían nubes, selvas inexploradas y adrenalina pura. 
            Despierta al aventurero que llevas dentro.
          </p>
          <Link to="/paquetes?type=aventura" className={styles.heroBtn}>
            Ver paquetes de aventura
          </Link>
        </div>
      </section>

      {/* Intro */}
      <section className={styles.intro}>
        <div className={styles.introContent}>
          <h2 className={styles.introTitle}>La vida comienza donde termina tu zona de confort</h2>
          <p className={styles.introText}>
            Hay un momento mágico cuando llegas a la cima después de horas de escalada, 
            cuando el agua del río te empapa mientras conquistas los rápidos, cuando ves 
            un jaguar en libertad por primera vez. Esos momentos no se compran, se viven. 
            Y en Sianna Travel, hacemos que sean posibles de forma segura e inolvidable.
          </p>
        </div>
      </section>

      {/* Experiencias */}
      <section className={styles.experiences}>
        <h2 className={styles.sectionTitle}>Aventuras que transforman</h2>
        <div className={styles.expGrid}>
          <div className={styles.expCard}>
            <div className={styles.expImage} style={{backgroundImage: 'url(https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800)'}}></div>
            <div className={styles.expContent}>
              <h3>Conexión familiar extrema</h3>
              <p>
                Olvida las pantallas. Imagina a tu familia haciendo rappel en cascadas, 
                acampando bajo las estrellas, navegando en kayak por manglares. Experiencias 
                que forjan lazos inquebrantables y crean las mejores historias.
              </p>
            </div>
          </div>
          <div className={styles.expCard}>
            <div className={styles.expImage} style={{backgroundImage: 'url(https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800)'}}></div>
            <div className={styles.expContent}>
              <h3>Escapadas de pareja</h3>
              <p>
                Naden juntos en cenotes ocultos al amanecer. Vuelen en tirolesa sobre 
                cañones espectaculares. Celebren cada aventura con una copa de vino 
                frente al fuego. El amor se fortalece compartiendo adrenalina.
              </p>
            </div>
          </div>
          <div className={styles.expCard}>
            <div className={styles.expImage} style={{backgroundImage: 'url(https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800)'}}></div>
            <div className={styles.expContent}>
              <h3>Expediciones épicas</h3>
              <p>
                Escala volcanes activos al amanecer. Explora cuevas subterráneas con ríos 
                cristalinos. Haz trekking por selvas donde habitan quetzales. Para los 
                verdaderos buscadores de lo extraordinario.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Destinos destacados */}
      <section className={styles.destinations}>
        <h2 className={styles.sectionTitle}>Territorios de aventura</h2>
        <div className={styles.destGrid}>
          <div className={styles.destCard}>
            <img src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600" alt="Chiapas" />
            <div className={styles.destInfo}>
              <h3>Chiapas</h3>
              <p>Selva lacandona, cascadas monumentales y cañones que quitan el aliento.</p>
            </div>
          </div>
          <div className={styles.destCard}>
            <img src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=600" alt="Barrancas del Cobre" />
            <div className={styles.destInfo}>
              <h3>Barrancas del Cobre</h3>
              <p>Más grandes que el Gran Cañón, tirolesa más larga del mundo.</p>
            </div>
          </div>
          <div className={styles.destCard}>
            <img src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600" alt="Baja California" />
            <div className={styles.destInfo}>
              <h3>Baja California</h3>
              <p>Avistamiento de ballenas, buceo con lobos marinos, desiertos surreales.</p>
            </div>
          </div>
          <div className={styles.destCard}>
            <img src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600" alt="Huasteca Potosina" />
            <div className={styles.destInfo}>
              <h3>Huasteca Potosina</h3>
              <p>El paraíso del ecoturismo: cascadas turquesa, cuevas y ríos cristalinos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className={styles.testimonial}>
        <blockquote className={styles.quote}>
          "Llevamos a nuestros hijos adolescentes a la Huasteca Potosina esperando desconectarlos 
          del celular una semana. Volvimos como una familia diferente. El rappel en Tamul, 
          las noches de fogata, las risas compartidas... Fue el mejor regalo que les hemos dado."
        </blockquote>
        <cite className={styles.cite}>— Familia Rodríguez, Guadalajara</cite>
      </section>

      {/* Safety Note */}
      <section className={styles.safety}>
        <div className={styles.safetyContent}>
          <h3 className={styles.safetyTitle}>Tu seguridad es nuestra prioridad</h3>
          <p className={styles.safetyText}>
            Todos nuestros tours de aventura incluyen guías certificados, equipo de primera 
            calidad, seguros de cobertura amplia y protocolos de seguridad rigurosos. 
            La aventura no tiene que ser temeraria para ser emocionante.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>¿Escuchas el llamado de la aventura?</h2>
        <p className={styles.ctaText}>
          Nuestros especialistas en ecoturismo y aventura diseñarán la expedición perfecta 
          según tu nivel de experiencia y sed de adrenalina.
        </p>
        <div className={styles.ctaButtons}>
          <Link to="/paquetes?type=aventura" className={styles.ctaBtnPrimary}>
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

import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import styles from './CategoryPage.module.css';

export default function CulturalTravel() {
  useSEO({
    title: 'Viajes Culturales – Historia, Arte y Gastronomia',
    description: 'Tours culturales a destinos históricos y artísticos de México y el mundo. Ciudades coloniales, museos, gastronomía y experiencias únicas desde Tulancingo, Hidalgo.',
    url: '/viajes-culturales',
  });

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero} style={{backgroundImage: 'url(https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1600)'}}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <span className={styles.heroTag}>Viajes Culturales</span>
          <h1 className={styles.heroTitle}>Viaja en el tiempo, vive la historia</h1>
          <p className={styles.heroSubtitle}>
            Camina donde caminaron imperios, descubre secretos ancestrales y 
            conecta con las raíces que definen civilizaciones enteras.
          </p>
          <Link to="/paquetes?type=cultural" className={styles.heroBtn}>
            Ver paquetes culturales
          </Link>
        </div>
      </section>

      {/* Intro */}
      <section className={styles.intro}>
        <div className={styles.introContent}>
          <h2 className={styles.introTitle}>Más que turismo: transformación</h2>
          <p className={styles.introText}>
            Cada piedra de Chichén Itzá guarda un secreto. Cada calle de Oaxaca cuenta una historia. 
            Los viajes culturales no son solo destinos, son portales a otras épocas y formas de ver 
            el mundo. En Sianna Travel diseñamos experiencias que te permiten no solo ver, sino 
            sentir y comprender la riqueza de nuestro patrimonio.
          </p>
        </div>
      </section>

      {/* Experiencias */}
      <section className={styles.experiences}>
        <h2 className={styles.sectionTitle}>Historias que cobran vida</h2>
        <div className={styles.expGrid}>
          <div className={styles.expCard}>
            <div className={styles.expImage} style={{backgroundImage: 'url(https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800)'}}></div>
            <div className={styles.expContent}>
              <h3>El legado Maya</h3>
              <p>
                Imagina a tu familia frente a la pirámide de Kukulkán al amanecer, antes que lleguen 
                las multitudes. Un arqueólogo explica cómo este pueblo predijo eclipses hace mil años. 
                Tus hijos no solo ven historia, la viven.
              </p>
            </div>
          </div>
          <div className={styles.expCard}>
            <div className={styles.expImage} style={{backgroundImage: 'url(https://images.unsplash.com/photo-1599639957043-f3aa5c986398?w=800&q=80)'}}></div>
            <div className={styles.expContent}>
              <h3>Romance colonial</h3>
              <p>
                Caminen de la mano por las calles empedradas de San Miguel de Allende al atardecer. 
                Cenen en una hacienda del siglo XVIII. Brinden con mezcal artesanal mientras el sol 
                pinta las cúpulas de dorado.
              </p>
            </div>
          </div>
          <div className={styles.expCard}>
            <div className={styles.expImage} style={{backgroundImage: 'url(https://images.unsplash.com/photo-1570737209810-87a8e7245f88?w=800)'}}></div>
            <div className={styles.expContent}>
              <h3>Sabores ancestrales</h3>
              <p>
                Aprende a hacer mole con una cocinera tradicional en Oaxaca. Visita mercados 
                centenarios. Descubre por qué la gastronomía mexicana es Patrimonio de la Humanidad 
                en cada bocado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Destinos destacados */}
      <section className={styles.destinations}>
        <h2 className={styles.sectionTitle}>Joyas de México</h2>
        <div className={styles.destGrid}>
          <div className={styles.destCard}>
            <img src="https://images.unsplash.com/photo-1518638150340-f706e86654de?w=600" alt="Chichén Itzá" />
            <div className={styles.destInfo}>
              <h3>Chichén Itzá</h3>
              <p>Maravilla del mundo moderno y corazón del imperio maya.</p>
            </div>
          </div>
          <div className={styles.destCard}>
            <img src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600" alt="San Miguel de Allende" />
            <div className={styles.destInfo}>
              <h3>San Miguel de Allende</h3>
              <p>La ciudad más bella de México, joya colonial del Bajío.</p>
            </div>
          </div>
          <div className={styles.destCard}>
            <img src="https://images.unsplash.com/photo-1570737209810-87a8e7245f88?w=600" alt="Oaxaca" />
            <div className={styles.destInfo}>
              <h3>Oaxaca</h3>
              <p>Capital gastronómica, artesanal y espiritual de México.</p>
            </div>
          </div>
          <div className={styles.destCard}>
            <img src="https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=600" alt="Ciudad de México" />
            <div className={styles.destInfo}>
              <h3>Ciudad de México</h3>
              <p>Metrópolis milenaria donde conviven aztecas y vanguardia.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className={styles.testimonial}>
        <blockquote className={styles.quote}>
          "Llevé a mis padres a Oaxaca para celebrar sus 40 años de casados. La experiencia en 
          Monte Albán con guía privado, las clases de cocina tradicional, las noches en la hacienda... 
          Mi madre lloró de emoción. Gracias, Sianna Travel, por hacer posible este sueño."
        </blockquote>
        <cite className={styles.cite}>— Roberto Hernández, Monterrey</cite>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>¿Listo para escribir tu propia historia?</h2>
        <p className={styles.ctaText}>
          Nuestros expertos en viajes culturales diseñarán un itinerario único que 
          combine historia, gastronomía y experiencias auténticas.
        </p>
        <div className={styles.ctaButtons}>
          <Link to="/paquetes?type=cultural" className={styles.ctaBtnPrimary}>
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

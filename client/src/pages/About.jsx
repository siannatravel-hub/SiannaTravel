import { useSEO } from '../hooks/useSEO';
import styles from './StaticPage.module.css';

export default function About() {
  useSEO({
    title: 'Nosotros – Quiénes Somos',
    description: 'Conoce la historia de Sianna Travel, agencia de viajes fundada en México. Desde 2016 creando experiencias de viaje personalizadas, accesibles y seguras.',
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
            Sianna Travel es una agencia de viajes especializada en diseñar experiencias 
            personalizadas, accesibles y seguras, tanto en destinos nacionales como internacionales. 
            Se enfoca en acompañar de forma cercana y constante a cada viajero, desde la planeación 
            hasta el regreso, asegurando momentos memorables y libres de preocupaciones.
          </p>
          <p className={styles.text}>
            La agencia fue fundada e inspirada por su entorno familiar, decididos a asumir el reto 
            de dirigir una agencia de viajes con el propósito de darle un giro emocional y 
            personalizado al negocio. El nombre <strong>Sianna</strong> es un homenaje directo a ellos, 
            ya que está formado por las iniciales de cada miembro de la familia.
          </p>
          <p className={styles.text}>
            Pronto descubrieron que detrás de cada viaje hay sueños, emociones y personas que buscan 
            seguridad, atención y confianza. Así nació el verdadero propósito de Sianna: facilitar 
            el camino para que cualquier persona pueda vivir la experiencia de viajar con 
            acompañamiento empático y profesional, sin importar sus circunstancias.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>¿A quién va dirigido?</h2>
          <p className={styles.text}>
            Sianna Travel está dirigida a personas que desean viajar más de una vez al año, que 
            valoran una atención cercana y el acompañamiento humano. Desde jubilados y familias 
            hasta viajeros primerizos o grupos que se sienten más cómodos viajando en conjunto, 
            el servicio está diseñado para adaptarse con flexibilidad y calidez a cada perfil.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Nuestro Compromiso</h2>
          <p className={styles.text}>
            Desde 2016, Sianna Travel ha operado desde México con alcance nacional e internacional, 
            acompañando a sus clientes a recorrer el mundo con respaldo constante, planes de pago 
            accesibles y una atención que no termina hasta que regresan a casa con el corazón lleno.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Nuestros Valores</h2>
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Confianza</h3>
              <p className={styles.cardText}>
                Construimos relaciones duraderas basadas en la transparencia y cercanía.
              </p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Acompañamiento</h3>
              <p className={styles.cardText}>
                Estamos contigo antes, durante y después de tu viaje. Nunca viajas solo.
              </p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Calidez</h3>
              <p className={styles.cardText}>
                Cada viajero es único. Adaptamos cada experiencia con empatía y flexibilidad.
              </p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Accesibilidad</h3>
              <p className={styles.cardText}>
                Planes de pago flexibles para que viajar esté al alcance de todos.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>¿Por qué elegirnos?</h2>
          <ul className={styles.list}>
            <li>Más de 8 años de experiencia desde 2016</li>
            <li>Acompañamiento personalizado en cada etapa del viaje</li>
            <li>Destinos nacionales e internacionales</li>
            <li>Planes de pago accesibles y flexibles</li>
            <li>Atención humana, cercana y empática</li>
            <li>Diseño de experiencias a la medida de cada viajero</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

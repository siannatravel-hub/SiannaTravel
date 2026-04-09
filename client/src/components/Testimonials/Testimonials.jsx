import styles from './Testimonials.module.css';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'María González',
    initials: 'MG',
    trip: 'Cancún All Inclusive',
    stars: 5,
    text: 'Increíble experiencia desde el primer momento. El hotel era espectacular, las playas hermosas y el servicio impecable. Sianna Travel se encargó de todo, solo tuvimos que disfrutar.',
  },
  {
    id: 2,
    name: 'Carlos Mendoza',
    initials: 'CM',
    trip: 'París Romántico',
    stars: 5,
    text: 'Mi esposa y yo celebramos nuestro aniversario en París gracias a Sianna. Todo perfectamente organizado: vuelos, hotel, tours. El crucero por el Sena fue mágico.',
  },
  {
    id: 3,
    name: 'Ana Rodríguez',
    initials: 'AR',
    trip: 'Machu Picchu Aventura',
    stars: 5,
    text: 'Una aventura que nunca olvidaré. El guía fue excepcional, el tren panorámico increíble y Machu Picchu superó todas mis expectativas. 100% recomendado.',
  },
];

export default function Testimonials() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <h2 className="section-title">Lo que dicen nuestros viajeros</h2>
        <p className="section-subtitle">
          Miles de viajeros confían en nosotros para crear sus mejores recuerdos
        </p>

        <div className={styles.grid}>
          {TESTIMONIALS.map((t) => (
            <article key={t.id} className={styles.testimonial}>
              <div className={styles.stars}>
                {'★'.repeat(t.stars)}{'☆'.repeat(5 - t.stars)}
              </div>
              <p className={styles.quote}>"{t.text}"</p>
              <div className={styles.author}>
                <div className={styles.avatar}>{t.initials}</div>
                <div>
                  <div className={styles.authorName}>{t.name}</div>
                  <div className={styles.authorTrip}>{t.trip}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

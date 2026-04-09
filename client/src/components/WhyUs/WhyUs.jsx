import { useEffect, useRef } from 'react';
import styles from './WhyUs.module.css';

const REASONS = [
  {
    tag: 'Confianza y seguridad',
    title: 'Viajes respaldados por expertos',
    text: 'Más de 10 años conectando familias y viajeros con los mejores destinos del mundo. Cada paquete incluye seguro de viaje internacional, asistencia 24/7 y acompañamiento personalizado de inicio a fin.',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=85',
    imageAlt: 'Avión sobrevolando el horizonte al atardecer',
    imageRight: false,
  },
  {
    tag: 'Precio y valor',
    title: 'El mejor precio, garantizado',
    text: 'Alianzas directas con aerolíneas, cadenas hoteleras y operadores locales nos permiten ofrecerte tarifas exclusivas que no encontrarás en ningún otro lugar. Pagos en múltiples modalidades y MSI.',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=85',
    imageAlt: 'Hotel de lujo frente al mar',
    imageRight: true,
  },
  {
    tag: 'A tu medida',
    title: 'Experiencias 100% personalizadas',
    text: 'No existen dos viajeros iguales. Diseñamos cada itinerario adaptado a tus gustos, presupuesto y ritmo de viaje. Desde escapadas de luna de miel hasta aventuras en familia, tu sueño es nuestra especialidad.',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=85',
    imageAlt: 'Pareja viajando en una playa paradisíaca',
    imageRight: false,
  },
  {
    tag: 'Siempre contigo',
    title: 'Soporte real en todo momento',
    text: 'Un asesor dedicado te acompaña antes, durante y después de tu viaje. Disponibles por WhatsApp, llamada y correo. Porque cuando viajas con Sianna Travel, nunca estás solo.',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=85',
    imageAlt: 'Vista aérea de destino tropical',
    imageRight: true,
  },
];

export default function WhyUs() {
  const sectionRef = useRef(null);
  const rowRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    rowRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Parallax on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const scrollY = window.scrollY;
      const images = sectionRef.current.querySelectorAll(`.${styles.parallaxImg}`);
      images.forEach((img, i) => {
        const rect = img.closest(`.${styles.imageWrapper}`).getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const viewH = window.innerHeight;
        const progress = (viewH / 2 - centerY) / viewH;
        const offset = progress * 80 * (i % 2 === 0 ? 1 : -1);
        img.style.transform = `translateY(${offset}px) scale(1.12)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.headerTag}>¿Por qué Sianna Travel?</span>
        <h2 className={styles.headerTitle}>
          Más que un viaje,<br />
          <em>una experiencia que transforma</em>
        </h2>
      </div>

      {/* Rows */}
      <div className={styles.rows}>
        {REASONS.map((r, i) => (
          <div
            key={i}
            ref={(el) => (rowRefs.current[i] = el)}
            className={`${styles.row} ${r.imageRight ? styles.rowReverse : ''}`}
          >
            {/* Image side */}
            <div className={styles.imageWrapper}>
              <div className={styles.imageFrame}>
                <img
                  src={r.image}
                  alt={r.imageAlt}
                  className={styles.parallaxImg}
                  loading="lazy"
                />
                <div className={styles.imageOverlay} />
              </div>
              <div className={styles.imageAccent} />
            </div>

            {/* Text side */}
            <div className={styles.textWrapper}>
              <span className={styles.rowTag}>{r.tag}</span>
              <h3 className={styles.rowTitle}>{r.title}</h3>
              <p className={styles.rowText}>{r.text}</p>
              <div className={styles.rowLine} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

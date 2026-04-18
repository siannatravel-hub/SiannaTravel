import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './HeroCarousel.module.css';

const SLIDES = [
  {
    id: 'original',
    bg: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&q=80',
    overlay: 'linear-gradient(135deg, rgba(0,60,90,0.82) 0%, rgba(0,100,130,0.70) 50%, rgba(0,150,160,0.55) 100%)',
    logo: '/images/logos/logo-morado-blanco.png',
    badge: null,
    badgeStyle: null,
    title: (
      <>
        <span className={styles.heroLine}>VIAJA CON</span>
        <span className={styles.heroLineFlex}>
          <span className={styles.heroBadgePill}>CONFIANZA</span>
        </span>
        <span className={styles.heroLine}>
          VIVE <span className={styles.planeIcon}>✈</span>
        </span>
        <span className={styles.heroLine}>CON EMOCIÓN</span>
      </>
    ),
    subtitle: '¿Te ayudamos?',
    cta: { label: 'Escríbenos', to: '/contacto', variant: 'glass' },
    phones: ['775 265 8513', '775 752 5171'],
  },
  {
    id: 'vuelos',
    bg: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1400&q=80',
    overlay: 'linear-gradient(135deg, rgba(0,50,80,0.88) 0%, rgba(0,90,120,0.78) 50%, rgba(0,130,150,0.62) 100%)',
    logo: '/images/logos/logo-morado-blanco.png',
    badge: 'VUELOS 2025',
    badgeColor: '#1db8d1',
    title: (
      <>
        <span className={styles.heroLine}>VUELA A</span>
        <span className={styles.heroLineFlex}>
          <span className={styles.heroBadgePillCyan}>CUALQUIER</span>
        </span>
        <span className={styles.heroLine}>
          DESTINO <span className={styles.planeIcon}>✈</span>
        </span>
      </>
    ),
    subtitle: 'Boletos aéreos nacionales e internacionales al mejor precio. Asistencia 24/7 en cada vuelo.',
    cta: { label: 'Cotizar Vuelo', to: '/contacto', variant: 'cyan' },
    phones: ['775 265 8513', '775 752 5171'],
    promoTag: 'VUELOS NACIONALES E INTERNACIONALES',
  },
  {
    id: 'hoteles',
    bg: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&q=80',
    overlay: 'linear-gradient(135deg, rgba(0,40,70,0.90) 0%, rgba(0,80,110,0.80) 50%, rgba(0,120,140,0.65) 100%)',
    logo: '/images/logos/logo-morado-blanco.png',
    badge: 'HOSPEDAJE PREMIUM',
    badgeColor: '#1db8d1',
    title: (
      <>
        <span className={styles.heroLine}>HOTELES</span>
        <span className={styles.heroLineFlex}>
          <span className={styles.heroBadgePillCyan}>QUE</span>
        </span>
        <span className={styles.heroLine}>INSPIRAN 🏨</span>
      </>
    ),
    subtitle: 'Suites, cuartos dobles y todo incluido en los mejores hoteles del mundo. Reserva fácil y rápido.',
    cta: { label: 'Reservar Hotel', to: '/contacto', variant: 'cyan' },
    phones: ['775 265 8513', '775 752 5171'],
    promoTag: 'CUARTOS · SUITES · TODO INCLUIDO',
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const animatingRef = useRef(false);
  const currentRef = useRef(0);
  const timerRef = useRef(null);

  const goTo = useCallback((index) => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    setFading(true);
    setTimeout(() => {
      currentRef.current = index;
      setCurrent(index);
      setFading(false);
      animatingRef.current = false;
    }, 200);
  }, []);

  const next = useCallback(() => {
    goTo((currentRef.current + 1) % SLIDES.length);
  }, [goTo]);

  const prev = useCallback(() => {
    goTo((currentRef.current - 1 + SLIDES.length) % SLIDES.length);
  }, [goTo]);

  // Auto-advance — se crea una sola vez
  useEffect(() => {
    timerRef.current = setInterval(() => {
      goTo((currentRef.current + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timerRef.current);
  }, [goTo]);

  const slide = SLIDES[current];

  return (
    <section className={styles.hero}>
      {/* Backgrounds — pre-renderizamos todos para evitar parpadeo */}
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          className={`${styles.heroBg} ${i === current ? styles.heroBgActive : ''}`}
          style={{ backgroundImage: `url(${s.bg})` }}
          aria-hidden="true"
        />
      ))}

      {/* Overlay dinámico */}
      <div
        className={styles.heroOverlay}
        style={{ background: slide.overlay }}
        aria-hidden="true"
      />

      {/* Línea punteada decorativa */}
      <svg className={styles.dashedCurve} viewBox="0 0 220 400" fill="none" aria-hidden="true">
        <path
          d="M 20 400 Q 180 280 160 160 Q 140 60 220 10"
          stroke="white"
          strokeWidth="3"
          strokeDasharray="12 10"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
      </svg>

      {/* Contenido */}
      <div className={styles.heroContent}>
        <div className={`${styles.heroText} ${fading ? styles.heroTextFade : ''}`}>
          <img
            src={slide.logo}
            alt="Sianna Travel"
            className={styles.heroLogo}
          />

          {/* Tag promo (solo slides 2 y 3) */}
          {slide.promoTag && (
            <span className={styles.promoTag}>{slide.promoTag}</span>
          )}

          <h1 className={styles.heroTitle}>
            {slide.title}
          </h1>

          <p className={styles.heroSubtitle}>{slide.subtitle}</p>

          <div className={styles.heroActions}>
            <Link
              to={slide.cta.to}
              className={slide.cta.variant === 'cyan' ? styles.btnCyan : styles.btnEscribenos}
            >
              {slide.cta.label}
            </Link>
          </div>

          <div className={styles.heroPhones}>
            {slide.phones.map((p) => (
              <a
                key={p}
                href={`tel:${p.replace(/\s/g, '')}`}
                className={styles.heroPhone}
              >
                {p}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Controles prev/next */}
      <button
        className={`${styles.arrow} ${styles.arrowLeft}`}
        onClick={prev}
        aria-label="Anterior"
      >
        ‹
      </button>
      <button
        className={`${styles.arrow} ${styles.arrowRight}`}
        onClick={next}
        aria-label="Siguiente"
      >
        ›
      </button>

      {/* Dots */}
      <div className={styles.dots}>
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Ir a slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

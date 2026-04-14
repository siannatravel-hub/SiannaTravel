import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

const NAV_ITEMS = [
  { path: '/', label: 'Inicio' },
  { path: '/paquetes', label: 'Paquetes' },
  { path: '/blog', label: 'Blog' },
  { path: '/contacto', label: 'Contacto' },
];

const TRAVEL_CATEGORIES = [
  { path: '/viajes-playa', label: 'Playa', icon: '🌊' },
  { path: '/viajes-culturales', label: 'Cultural', icon: '🏛️' },
  { path: '/viajes-aventura', label: 'Aventura', icon: '🏔️' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { pathname } = useLocation();
  const leaveTimer = useRef(null);

  const closeMenu = () => setMenuOpen(false);

  const handleDropdownEnter = () => {
    clearTimeout(leaveTimer.current);
    setDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    leaveTimer.current = setTimeout(() => setDropdownOpen(false), 200);
  };

  useEffect(() => {
    closeMenu();
    setDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    return () => clearTimeout(leaveTimer.current);
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          {isMobile && (
            <button
              className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
              onClick={() => setMenuOpen(prev => !prev)}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
            </button>
          )}

          <Link to="/" className={styles.logo}>
            <img src="/images/logos/logosianna.png" alt="Sianna Travel" className={styles.logoIcon} />
          </Link>

          <nav className={styles.navDesktop}>
            {NAV_ITEMS.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`${styles.navLink} ${pathname === path ? styles.navLinkActive : ''}`}
              >
                {label}
              </Link>
            ))}

            <div
              className={styles.dropdown}
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                className={`${styles.navLink} ${styles.dropdownTrigger} ${dropdownOpen ? styles.dropdownTriggerOpen : ''}`}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                onClick={() => setDropdownOpen(prev => !prev)}
              >
                Experiencias <span className={styles.dropdownArrow}>▾</span>
              </button>
              {dropdownOpen && (
                <div className={styles.dropdownMenu}>
                  {TRAVEL_CATEGORIES.map(({ path, label, icon }) => (
                    <Link key={path} to={path} className={styles.dropdownItem}>
                      <span className={styles.dropdownIcon}>{icon}</span>
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/paquetes" className={styles.ctaBtn}>Reservar Ahora</Link>
          </nav>
        </div>
      </header>

      {/* Mobile drawer */}
      {isMobile && (
        <>
          <div
            className={`${styles.drawerOverlay} ${menuOpen ? styles.drawerOverlayActive : ''}`}
            onClick={closeMenu}
          />

          <div className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}>
            <div className={styles.blobMenuHead}>
              <img src="/images/logos/logosianna.png" alt="" className={styles.blobLogoImg} />
              <span className={styles.blobLogoText}>Sianna<span>Travel</span></span>
              <button className={styles.blobCloseBtn} onClick={closeMenu}>✕</button>
            </div>

            <nav className={styles.blobNav}>
              {NAV_ITEMS.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`${styles.blobLink} ${pathname === path ? styles.blobLinkActive : ''}`}
                  onClick={closeMenu}
                >
                  {label}
                </Link>
              ))}

              <div className={styles.blobDivider}><span>Experiencias</span></div>

              {TRAVEL_CATEGORIES.map(({ path, label, icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`${styles.blobLink} ${pathname === path ? styles.blobLinkActive : ''}`}
                  onClick={closeMenu}
                >
                  <span className={styles.blobIcon}>{icon}</span> {label}
                </Link>
              ))}

              <Link to="/paquetes" className={styles.blobCta} onClick={closeMenu}>
                Reservar Ahora
              </Link>
            </nav>
          </div>
        </>
      )}
    </>
  );
}

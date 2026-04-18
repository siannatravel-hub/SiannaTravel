import { Suspense, useLayoutEffect, useRef } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import WhatsAppWidget from '../WhatsAppWidget';
import Spinner from '../ui/Spinner';

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const isPopRef = useRef(false);
  const scrollPositions = useRef({});
  const prevPathname = useRef(pathname);

  // Save scroll position before navigating away, restore on popstate (back/forward)
  useLayoutEffect(() => {
    const onPop = () => { isPopRef.current = true; };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useLayoutEffect(() => {
    // Save previous page scroll
    const key = 'scroll:' + prevPathname.current;
    sessionStorage.setItem(key, String(window.scrollY));
    scrollPositions.current[prevPathname.current] = window.scrollY;
    prevPathname.current = pathname;

    // Cancel any in-progress smooth scroll before jumping
    document.documentElement.style.scrollBehavior = 'auto';

    if (isPopRef.current) {
      isPopRef.current = false;
      // Intentar desde sessionStorage primero, luego desde ref en memoria
      const fromStorage = sessionStorage.getItem('scroll:' + pathname);
      const saved = fromStorage != null
        ? parseFloat(fromStorage)
        : scrollPositions.current[pathname];

      // doble rAF: espera a que React pinte el contenido antes de scrollear
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo(0, saved != null ? saved : 0);
        });
      });
    } else {
      // New navigation: scroll to top immediately
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <>
      <Header />
      <main style={{ paddingTop: 'var(--header-height, 70px)' }}>
        <Suspense fallback={<Spinner />}>
          {children || <Outlet />}
        </Suspense>
      </main>
      <Footer />
      <WhatsAppWidget />
    </>
  );
}

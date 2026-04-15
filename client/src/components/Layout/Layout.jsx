import { Suspense, useEffect, useRef } from 'react';
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
  useEffect(() => {
    const onPop = () => { isPopRef.current = true; };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    // Save previous page scroll
    scrollPositions.current[prevPathname.current] = window.scrollY;
    prevPathname.current = pathname;

    if (isPopRef.current) {
      // Back/forward: restore saved position
      const saved = scrollPositions.current[pathname];
      if (saved != null) {
        requestAnimationFrame(() => window.scrollTo(0, saved));
      }
      isPopRef.current = false;
    } else {
      // New navigation: scroll to top
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
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

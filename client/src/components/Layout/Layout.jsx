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
    scrollPositions.current[prevPathname.current] = window.scrollY;
    prevPathname.current = pathname;

    // Cancel any in-progress smooth scroll before jumping
    document.documentElement.style.scrollBehavior = 'auto';

    if (isPopRef.current) {
      // Back/forward: restore saved position
      const saved = scrollPositions.current[pathname];
      window.scrollTo(0, saved != null ? saved : 0);
      isPopRef.current = false;
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

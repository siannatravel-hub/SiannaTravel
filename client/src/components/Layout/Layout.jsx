import { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import WhatsAppWidget from '../WhatsAppWidget';

export default function Layout({ children }) {
  const { pathname } = useLocation();

  // Scroll to top on route change - instant scroll
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <>
      <Header />
      <main style={{ paddingTop: 'var(--header-height, 70px)' }}>
        {children || <Outlet />}
      </main>
      <Footer />
      <WhatsAppWidget />
    </>
  );
}

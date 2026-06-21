import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUnreadCount } from '../../lib/solicitudes';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => { getUnreadCount().then(setUnread); }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.dashboardHeader}>
        <div className={styles.dashboardLogo}>
          Sianna <span className={styles.dashboardLogoAccent}>Admin</span>
        </div>
        <div className={styles.headerActions}>
          <span className={styles.userEmail}>{user?.email}</span>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className={styles.dashboardContent}>
        <div className={styles.welcomeCard}>
          <h1 className={styles.welcomeTitle}>Bienvenido al Panel de Admin</h1>
          <p className={styles.welcomeSubtitle}>
            Gestiona los paquetes, precios e imágenes de Sianna Travel
          </p>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>6</div>
            <div className={styles.statLabel}>Paquetes Activos</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>156</div>
            <div className={styles.statLabel}>Cotizaciones Este Mes</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>4.9</div>
            <div className={styles.statLabel}>Calificación Promedio</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>$28.5K</div>
            <div className={styles.statLabel}>Ventas Este Mes</div>
          </div>
        </div>

        <h2 className={styles.sectionTitle}>Acciones Rápidas</h2>
        <div className={styles.actionsGrid}>
          <Link to="/admin/featured" className={styles.actionCard}>
            <div className={styles.actionIcon}>⭐</div>
            <h3 className={styles.actionTitle}>Promociones</h3>
            <p className={styles.actionDesc}>
              Gestionar las 3 ofertas destacadas de la página principal
            </p>
          </Link>

          <Link to="/admin/packages" className={styles.actionCard}>
            <div className={styles.actionIcon}>📦</div>
            <h3 className={styles.actionTitle}>Todos los Paquetes</h3>
            <p className={styles.actionDesc}>
              Editar precios, descripciones e información de los paquetes
            </p>
          </Link>

          <Link to="/admin/blog" className={styles.actionCard}>
            <div className={styles.actionIcon}>📝</div>
            <h3 className={styles.actionTitle}>Blog</h3>
            <p className={styles.actionDesc}>
              Crear y gestionar publicaciones del blog con texto, imágenes y videos
            </p>
          </Link>

          <div className={styles.actionCard}>
            <div className={styles.actionIcon}>🖼</div>
            <h3 className={styles.actionTitle}>Gestionar Imágenes</h3>
            <p className={styles.actionDesc}>
              Subir y actualizar fotos de destinos y paquetes
            </p>
          </div>

          <div className={styles.actionCard}>
            <div className={styles.actionIcon}>💬</div>
            <h3 className={styles.actionTitle}>Ver Cotizaciones</h3>
            <p className={styles.actionDesc}>
              Revisar solicitudes de cotización recientes
            </p>
          </div>
        </div>

        {/* ---- Sección diferenciada: Bot / Automatización ---- */}
        <div
          style={{
            marginTop: 40,
            padding: '24px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(56,189,248,0.10), rgba(14,165,233,0.04))',
            border: '1px solid rgba(56,189,248,0.35)',
          }}
        >
          <h2 className={styles.sectionTitle} style={{ marginTop: 0 }}>
            🤖 Bot / Automatización
          </h2>
          <p style={{ color: '#94a3b8', marginTop: -8, marginBottom: 20, fontSize: '0.92rem' }}>
            Contenido que usa el asistente de WhatsApp (en Postgres).
          </p>
          <div className={styles.actionsGrid}>
            <Link to="/admin/faq" className={styles.actionCard}>
              <div className={styles.actionIcon}>💡</div>
              <h3 className={styles.actionTitle}>FAQ del Bot</h3>
              <p className={styles.actionDesc}>Preguntas y respuestas que responde el asistente.</p>
            </Link>
            <Link to="/admin/solicitudes" className={styles.actionCard} style={{ position: 'relative' }}>
              {unread > 0 && <span className={styles.unreadBadge}>{unread}</span>}
              <div className={styles.actionIcon}>📨</div>
              <h3 className={styles.actionTitle}>Solicitudes / Leads</h3>
              <p className={styles.actionDesc}>Mensajes capturados; estado, prioridad y pausa del bot.</p>
            </Link>
            <Link to="/admin/links" className={styles.actionCard}>
              <div className={styles.actionIcon}>🔗</div>
              <h3 className={styles.actionTitle}>Enlaces</h3>
              <p className={styles.actionDesc}>Links que el bot comparte (catálogo, web, redes, PDFs).</p>
            </Link>
          </div>
        </div>

        <Link to="/" className={styles.backLink}>
          ← Ver sitio público
        </Link>
      </main>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OwnerDashboard from './OwnerDashboard';
import AsesoraDashboard from './AsesoraDashboard';
import styles from './AdminDashboard.module.css';

// La dueña ve el negocio completo; las asesoras, solo sus leads.
export default function AdminDashboard() {
  const { user, signOut, isOwner } = useAuth();
  const navigate = useNavigate();

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
        {isOwner ? <OwnerDashboard user={user} /> : <AsesoraDashboard user={user} />}
      </main>
    </div>
  );
}

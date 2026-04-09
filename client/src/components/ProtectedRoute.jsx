import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, isConfigured } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Verificando sesión...</p>
      </div>
    );
  }

  if (!isConfigured) {
    return (
      <div className="error-container">
        <h2>Supabase no configurado</h2>
        <p>Configura las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}

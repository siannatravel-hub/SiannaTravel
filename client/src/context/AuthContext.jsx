import { createContext, useContext, useEffect, useState } from 'react';
import { apiGet, apiPost } from '../lib/apiClient';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restaurar sesión al cargar (cookie httpOnly → /api/admin/me)
  useEffect(() => {
    apiGet('/admin/me')
      .then((res) => setUser(res.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const signIn = async (email, password) => {
    setError(null);
    try {
      const res = await apiPost('/admin/login', { email, password });
      setUser(res.user ?? null);
      return res;
    } catch (err) {
      const msg = err.message === 'Failed to fetch'
        ? 'No se pudo conectar con el servidor. Verifica que el backend esté activo.'
        : (err.message || 'Credenciales inválidas');
      setError(msg);
      throw new Error(msg);
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      await apiPost('/admin/logout', {});
    } catch { /* ignore */ }
    setUser(null);
  };

  // No usados con el nuevo backend (el admin se gestiona en la BD).
  const signUp = async () => { throw new Error('Registro deshabilitado. El admin se gestiona en la base de datos.'); };
  const resetPassword = async () => { throw new Error('Función no disponible.'); };

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isAuthenticated: !!user,
    isConfigured: true,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

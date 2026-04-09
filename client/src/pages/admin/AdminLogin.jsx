import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminLogin.module.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  
  const { signIn, error, isConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (!email || !password) {
      setLocalError('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setLocalError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConfigured) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <div className={styles.loginLogo}>
              Sianna <span className={styles.loginLogoAccent}>Admin</span>
            </div>
          </div>
          <div className={styles.notConfigured}>
            <h3>Supabase no configurado</h3>
            <p>
              Para habilitar la autenticación, crea un proyecto gratuito en{' '}
              <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" style={{ color: '#f59e0b' }}>
                supabase.com
              </a>{' '}
              y configura las variables de entorno:
            </p>
            <div className={styles.codeBlock}>
              <code>
                VITE_SUPABASE_URL=tu_url<br />
                VITE_SUPABASE_ANON_KEY=tu_key
              </code>
            </div>
          </div>
          <Link to="/" className={styles.backLink}>
            ← Volver al sitio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.loginLogo}>
            Sianna <span className={styles.loginLogoAccent}>Admin</span>
          </div>
          <p className={styles.loginSubtitle}>Accede al panel de administración</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          {(localError || error) && (
            <div className={styles.errorMessage}>
              {localError || error}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.formInput}
              placeholder="admin@siannatravel.com"
              autoComplete="email"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.formInput}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        <Link to="/" className={styles.backLink}>
          ← Volver al sitio
        </Link>
      </div>
    </div>
  );
}

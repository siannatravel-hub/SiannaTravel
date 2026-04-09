import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '6rem 1.5rem',
      maxWidth: '500px',
      margin: '0 auto',
    }}>
      <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🌍</div>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '2rem',
        fontWeight: 700,
        color: 'var(--color-gray-900)',
        marginBottom: '0.75rem',
      }}>
        Página no encontrada
      </h1>
      <p style={{
        color: 'var(--color-gray-500)',
        fontSize: '1.05rem',
        marginBottom: '2rem',
        lineHeight: 1.6,
      }}>
        Parece que esta ruta no existe. ¿Quizás buscabas algún destino increíble?
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-primary btn-lg">Ir al Inicio</Link>
        <Link to="/paquetes" className="btn btn-outline btn-lg">Ver Paquetes</Link>
      </div>
    </div>
  );
}

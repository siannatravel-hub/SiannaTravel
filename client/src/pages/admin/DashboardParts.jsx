import { Link } from 'react-router-dom';
import { hace, linkWhatsApp, normalizar } from '../../lib/adminStats';
import styles from './DashboardViews.module.css';

export function Kpi({ label, value, hint, to, alerta = false, cargando = false }) {
  const contenido = (
    <>
      <span className={styles.kpiLabel}>{label}</span>
      <span className={styles.kpiValue}>{cargando ? '—' : value}</span>
      {hint && <span className={styles.kpiHint}>{hint}</span>}
    </>
  );
  const clase = `${styles.kpi} ${alerta && !cargando && value > 0 ? styles.kpiAlerta : ''}`;
  return to
    ? <Link to={to} className={`${clase} ${styles.kpiLink}`}>{contenido}</Link>
    : <div className={clase}>{contenido}</div>;
}

export function EstadoChip({ estado }) {
  const e = normalizar(estado);
  const esc = e.startsWith('escalado');
  const clase = esc ? styles.chipEscalado
    : e === 'atendido' ? styles.chipAtendido
      : e === 'cerrado' ? styles.chipCerrado
        : styles.chipNuevo;
  return <span className={`${styles.chip} ${clase}`}>{esc ? 'Escalado' : estado || 'Nuevo'}</span>;
}

export function LeadRow({ lead, mostrarAsesora = false, conWhatsApp = false }) {
  const canal = /^fb_/i.test(lead.numero_whatsapp || '') ? 'Cliente de Messenger'
    : /^ig_/i.test(lead.numero_whatsapp || '') ? 'Cliente de Instagram' : null;
  const nombre = lead.nombre_cliente?.trim() || canal || lead.numero_whatsapp || 'Sin nombre';
  const wa = conWhatsApp ? linkWhatsApp(lead.numero_whatsapp) : null;
  return (
    <li className={styles.lead}>
      <span className={styles.avatar} aria-hidden="true">{nombre.charAt(0).toUpperCase()}</span>
      <div className={styles.leadMain}>
        <div className={styles.leadTop}>
          <strong className={styles.leadName}>{nombre}</strong>
          {lead.intencion_compra && <span className={styles.estrella} title="Quiere comprar">★ Quiere comprar</span>}
        </div>
        <p className={styles.leadMsg}>{lead.ultimo_mensaje || 'Sin mensajes todavía'}</p>
        <div className={styles.leadMeta}>
          <span>{hace(lead.fecha_hora)}</span>
          {mostrarAsesora && <span>· {lead.asesor?.trim() || 'Sin asignar'}</span>}
        </div>
      </div>
      <div className={styles.leadSide}>
        <EstadoChip estado={lead.estado} />
        {wa && (
          <a className={styles.btnWa} href={wa} target="_blank" rel="noopener noreferrer">
            Abrir WhatsApp
          </a>
        )}
      </div>
    </li>
  );
}

export function Panel({ titulo, enlace, textoEnlace = 'Ver todos →', children }) {
  return (
    <section className={styles.panel}>
      <header className={styles.panelHead}>
        <h2 className={styles.panelTitle}>{titulo}</h2>
        {enlace && <Link to={enlace} className={styles.panelLink}>{textoEnlace}</Link>}
      </header>
      {children}
    </section>
  );
}

export function ErrorCarga({ onReintentar }) {
  return (
    <div className={styles.errorBox} role="alert">
      <span>No se pudieron cargar las cifras. Revisa tu conexión e inténtalo de nuevo.</span>
      <button type="button" className={styles.btnReintentar} onClick={onReintentar}>Reintentar</button>
    </div>
  );
}

// Accesos a toda la administración. Son los mismos y en el mismo orden para todas las usuarias.
const GRUPOS_ACCESOS = [
  {
    titulo: 'Atención a clientes',
    accesos: [
      { to: '/admin/solicitudes', icono: '📨', titulo: 'Leads', desc: 'Mensajes y contactos del asistente', insignia: true },
      { to: '/admin/faq', icono: '💡', titulo: 'Preguntas frecuentes', desc: 'Lo que responde el asistente' },
      { to: '/admin/links', icono: '🔗', titulo: 'Enlaces', desc: 'Catálogo, redes y PDFs que comparte' },
    ],
  },
  {
    titulo: 'Sitio web',
    accesos: [
      { to: '/admin/packages', icono: '📦', titulo: 'Paquetes', desc: 'Precios, fechas, fotos e itinerarios' },
      { to: '/admin/featured', icono: '⭐', titulo: 'Promociones', desc: 'Las 3 ofertas de la página principal' },
      { to: '/admin/blog', icono: '📝', titulo: 'Blog', desc: 'Publicaciones con texto, imágenes y video' },
    ],
  },
];

export function Accesos({ sinLeer = 0 }) {
  return (
    <>
      {GRUPOS_ACCESOS.map((g) => (
        <section key={g.titulo} className={styles.grupo}>
          <h2 className={styles.grupoTitulo}>{g.titulo}</h2>
          <div className={styles.accesos}>
            {g.accesos.map((a) => (
              <Link key={a.to} to={a.to} className={styles.acceso}>
                {a.insignia && sinLeer > 0 && <span className={styles.insignia}>{sinLeer}</span>}
                <span className={styles.accesoIcono}>{a.icono}</span>
                <span><span className={styles.accesoTitulo}>{a.titulo}</span><span className={styles.accesoDesc}>{a.desc}</span></span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

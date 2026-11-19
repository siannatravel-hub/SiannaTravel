import { Link } from 'react-router-dom';
import useDashboardData from '../../lib/useDashboardData';
import { porAsesora, recientes, resumenLeads, saludo } from '../../lib/adminStats';
import { ErrorCarga, Kpi, LeadRow, Panel } from './DashboardParts';
import styles from './DashboardViews.module.css';

const GRUPOS = [
  {
    titulo: 'Catálogo y sitio',
    accesos: [
      { to: '/admin/packages', icono: '📦', titulo: 'Paquetes', desc: 'Precios, fechas, fotos e itinerarios' },
      { to: '/admin/featured', icono: '⭐', titulo: 'Promociones', desc: 'Las 3 ofertas de la página principal' },
      { to: '/admin/blog', icono: '📝', titulo: 'Blog', desc: 'Publicaciones con texto, imágenes y video' },
    ],
  },
  {
    titulo: 'Asistente de WhatsApp',
    accesos: [
      { to: '/admin/solicitudes', icono: '📨', titulo: 'Leads', desc: 'Todos los contactos del bot', insignia: true },
      { to: '/admin/faq', icono: '💡', titulo: 'Preguntas frecuentes', desc: 'Lo que responde el asistente' },
      { to: '/admin/links', icono: '🔗', titulo: 'Enlaces', desc: 'Catálogo, redes y PDFs que comparte' },
    ],
  },
];

export default function OwnerDashboard({ user }) {
  const { cargando, error, leads, paquetes, sinLeer, recargar } = useDashboardData({ conCatalogo: true });
  const r = resumenLeads(leads);
  const equipo = porAsesora(leads);
  const maxTotal = Math.max(1, ...equipo.map((g) => g.total));
  const activos = paquetes.filter((p) => p.is_active).length;
  const fecha = new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Mexico_City' });

  return (
    <>
      <div className={styles.hero}>
        <div>
          <h1 className={styles.heroTitle}>
            {saludo()}, <span className={styles.heroName}>{user?.nombre || 'bienvenida'}</span>
          </h1>
          <p className={styles.heroSub}>Así va Sianna Travel hoy, {fecha}.</p>
        </div>
        <span className={styles.rolChip}>Dueña</span>
      </div>

      {error && <ErrorCarga onReintentar={recargar} />}

      <div className={styles.kpis}>
        <Kpi label="Leads hoy" value={r.hoy} hint={`${r.delMes} en lo que va del mes`} to="/admin/solicitudes" cargando={cargando} />
        <Kpi label="Por atender" value={r.pendientes} hint="Nuevos y escalados" to="/admin/solicitudes" alerta cargando={cargando} />
        <Kpi label="Listos para cerrar" value={r.listosParaCerrar} hint="Quieren comprar y siguen sin atender" to="/admin/solicitudes" cargando={cargando} />
        <Kpi label="Paquetes activos" value={activos} hint={`de ${paquetes.length} en el catálogo`} to="/admin/packages" cargando={cargando} />
      </div>

      <div className={styles.columns}>
        <Panel titulo="Leads recientes" enlace="/admin/solicitudes">
          {!cargando && leads.length === 0
            ? <p className={styles.vacio}>Todavía no hay leads. Cuando el asistente reciba un mensaje, aparecerá aquí.</p>
            : <ul className={styles.leads}>{recientes(leads, 6).map((l) => <LeadRow key={l.id} lead={l} mostrarAsesora />)}</ul>}
        </Panel>

        <Panel titulo="Equipo">
          {!cargando && equipo.length === 0
            ? <p className={styles.vacio}>Aún no hay leads asignados.</p>
            : (
              <ul className={styles.team}>
                {equipo.map((g) => (
                  <li key={g.clave} className={styles.teamRow}>
                    <div className={styles.teamTop}>
                      <span>{g.nombre}</span>
                      <span className={`${styles.teamPend} ${g.pendientes > 0 ? styles.teamPendAlerta : ''}`}>
                        {g.pendientes} por atender · {g.total} en total
                      </span>
                    </div>
                    <div className={styles.barra}><div className={styles.barraRelleno} style={{ width: `${(g.total / maxTotal) * 100}%` }} /></div>
                  </li>
                ))}
              </ul>
            )}
        </Panel>
      </div>

      {GRUPOS.map((g) => (
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

      <Link to="/" className={styles.volver}>← Ver sitio público</Link>
    </>
  );
}

import { Link } from 'react-router-dom';
import useDashboardData from '../../lib/useDashboardData';
import { estaPendiente, misLeads, resumenLeads, saludo } from '../../lib/adminStats';
import { Accesos, ErrorCarga, Kpi, LeadRow, Panel } from './DashboardParts';
import styles from './DashboardViews.module.css';

// Panel de inicio de las asesoras: primero SUS leads, después los mismos accesos que todas.
export default function AsesoraDashboard({ user }) {
  const { cargando, error, leads, sinLeer, recargar } = useDashboardData({ conCatalogo: false });
  const mios = misLeads(leads, user?.asesora);
  const r = resumenLeads(mios);
  const equipoPendientes = resumenLeads(leads).pendientes;
  // Primero los que quieren comprar; dentro de cada grupo, el orden del servidor (más recientes primero).
  const porAtender = mios
    .filter((l) => estaPendiente(l.estado))
    .sort((a, b) => Number(!!b.intencion_compra) - Number(!!a.intencion_compra))
    .slice(0, 6);
  const nombre = user?.nombre?.split(' ')[0] || 'bienvenida';

  return (
    <>
      <div className={styles.hero}>
        <div>
          <h1 className={styles.heroTitle}>
            {saludo()}, <span className={styles.heroName}>{nombre}</span>
          </h1>
          <p className={styles.heroSub}>
            {user?.asesora
              ? 'Estos son tus leads. Atiéndelos desde aquí o directo por WhatsApp.'
              : 'Estos son los leads del equipo. Atiéndelos desde aquí o directo por WhatsApp.'}
          </p>
        </div>
        <span className={styles.rolChip}>Mis leads</span>
      </div>

      {error && <ErrorCarga onReintentar={recargar} />}

      <div className={styles.kpis}>
        <Kpi label="Por atender" value={r.pendientes} hint="Tuyos: nuevos y escalados" to="/admin/solicitudes" alerta cargando={cargando} />
        <Kpi label="Listos para cerrar" value={r.listosParaCerrar} hint="Quieren comprar" cargando={cargando} />
        <Kpi label="Nuevos hoy" value={r.hoy} hint={`${r.delMes} en el mes`} cargando={cargando} />
        <Kpi label="Equipo por atender" value={equipoPendientes} hint="De todas las asesoras" to="/admin/solicitudes" cargando={cargando} />
      </div>

      <Panel titulo="Mis leads por atender" enlace="/admin/solicitudes" textoEnlace="Ver todos →">
        {!cargando && porAtender.length === 0
          ? <p className={styles.vacio}>✓ Estás al día: no tienes leads pendientes.</p>
          : <ul className={styles.leads}>{porAtender.map((l) => <LeadRow key={l.id} lead={l} conWhatsApp />)}</ul>}
      </Panel>

      <div className={styles.separador} />
      <Accesos sinLeer={sinLeer} />

      <Link to="/" className={styles.volver}>← Ver sitio público</Link>
    </>
  );
}

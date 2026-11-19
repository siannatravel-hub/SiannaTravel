import { Link } from 'react-router-dom';
import useDashboardData from '../../lib/useDashboardData';
import { estaPendiente, recientes, resumenLeads, saludo } from '../../lib/adminStats';
import { ErrorCarga, Kpi, LeadRow, Panel } from './DashboardParts';
import styles from './DashboardViews.module.css';

export default function AsesoraDashboard({ user }) {
  const { cargando, error, leads, recargar } = useDashboardData({ conCatalogo: false });
  const r = resumenLeads(leads);
  // Primero los que quieren comprar, luego los más recientes.
  const porAtender = recientes(leads.filter((l) => estaPendiente(l.estado)), leads.length)
    .sort((a, b) => Number(!!b.intencion_compra) - Number(!!a.intencion_compra))
    .slice(0, 8);
  const nombre = user?.nombre?.split(' ')[0] || 'bienvenida';

  return (
    <>
      <div className={styles.hero}>
        <div>
          <h1 className={styles.heroTitle}>
            {saludo()}, <span className={styles.heroName}>{nombre}</span>
          </h1>
          <p className={styles.heroSub}>Estos son tus leads. Atiéndelos desde aquí o directo por WhatsApp.</p>
        </div>
        <span className={styles.rolChip}>Asesora</span>
      </div>

      {error && <ErrorCarga onReintentar={recargar} />}

      <div className={styles.kpis}>
        <Kpi label="Por atender" value={r.pendientes} hint="Tuyos, nuevos y escalados" to="/admin/solicitudes" alerta cargando={cargando} />
        <Kpi label="Listos para cerrar" value={r.listosParaCerrar} hint="Quieren comprar" cargando={cargando} />
        <Kpi label="Nuevos hoy" value={r.hoy} hint={`${r.delMes} en el mes`} cargando={cargando} />
      </div>

      <Panel titulo="Leads por atender" enlace="/admin/solicitudes" textoEnlace="Ver todos mis leads →">
        {!cargando && porAtender.length === 0
          ? <p className={styles.vacio}>✓ Estás al día: no tienes leads pendientes.</p>
          : <ul className={styles.leads}>{porAtender.map((l) => <LeadRow key={l.id} lead={l} conWhatsApp />)}</ul>}
      </Panel>

      <Link to="/admin/solicitudes" className={styles.cta}>Ver todos mis leads</Link>
    </>
  );
}

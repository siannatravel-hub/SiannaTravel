import { Link } from 'react-router-dom';
import useDashboardData from '../../lib/useDashboardData';
import { leadsPorDia, porAsesora, recientes, resumenLeads, saludo } from '../../lib/adminStats';
import { Accesos, ErrorCarga, Kpi, LeadRow, Panel } from './DashboardParts';
import styles from './DashboardViews.module.css';

// Panel de inicio de la dueña: primero cómo va el negocio, después los accesos de siempre.
export default function OwnerDashboard({ user }) {
  const { cargando, error, leads, paquetes, sinLeer, recargar } = useDashboardData({ conCatalogo: true });
  const r = resumenLeads(leads);
  const equipo = porAsesora(leads);
  const maxTotal = Math.max(1, ...equipo.map((g) => g.total));
  const dias = leadsPorDia(leads, 7);
  const maxDia = Math.max(1, ...dias.map((d) => d.total));
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
        <span className={styles.rolChip}>Resumen del negocio</span>
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

        <div className={styles.columnaDer}>
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

          <Panel titulo="Últimos 7 días">
            <div className={styles.dias}>
              {dias.map((d) => (
                <div key={d.dia} className={styles.dia}>
                  <span className={styles.diaNum}>{d.total}</span>
                  <div className={styles.diaCol}><div className={styles.diaBarra} style={{ height: `${Math.max(4, (d.total / maxDia) * 100)}%` }} /></div>
                  <span className={styles.diaEtq}>{d.etiqueta}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <Accesos sinLeer={sinLeer} />

      <Link to="/" className={styles.volver}>← Ver sitio público</Link>
    </>
  );
}

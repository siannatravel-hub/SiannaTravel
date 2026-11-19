import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSolicitudes, updateSolicitud, deleteSolicitud, markSolicitudesRead } from '../../lib/solicitudes';
import { useAuth } from '../../context/AuthContext';
import { estaPendiente, linkWhatsApp, misLeads, opcionesEstado } from '../../lib/adminStats';
import LeadDetalle from './LeadDetalle';
import styles from './BotAdmin.module.css';
import movil from './SolicitudesMovil.module.css';

const ESTADOS = ['Nuevo', 'Escalado', 'Atendido', 'Cerrado'];
const PRIORIDADES = ['BAJA', 'MEDIA', 'ALTA'];

export default function ManageSolicitudes() {
  const { user, vistaDuena } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedId, setSavedId] = useState(null);
  const [detalleId, setDetalleId] = useState(null);
  // Todas ven y administran todos los leads. Las asesoras abren con sus leads por atender; la dueña con todos.
  const [filtro, setFiltro] = useState(vistaDuena ? 'todos' : 'pendientes');
  const [soloMios, setSoloMios] = useState(!vistaDuena && !!user?.asesora);

  // Lo que hay guardado en el servidor (estado/asesor). Los filtros usan esto y no lo que se está
  // editando: si no, al cambiar el estado la fila desaparecería antes de poder tocar Guardar.
  const [guardado, setGuardado] = useState({});
  const recordar = (lista) => setGuardado((prev) => {
    const next = { ...prev };
    for (const it of lista) next[it.id] = { estado: it.estado, asesor: it.asesor };
    return next;
  });

  const load = async () => {
    setLoading(true);
    const lista = await getSolicitudes();
    setItems(lista);
    setGuardado({});
    recordar(lista);
    setLoading(false);
  };
  useEffect(() => { load().then(() => markSolicitudesRead()); }, []);

  const setField = (id, field, val) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: val } : it)));

  const save = async (it) => {
    await updateSolicitud(it.id, {
      estado: it.estado, prioridad: it.prioridad, asesor: it.asesor,
      bot_pausado: it.bot_pausado,
    });
    recordar([it]);
    setSavedId(it.id);
    setTimeout(() => setSavedId(null), 1500);
  };

  const remove = async (id) => {
    if (!confirm('¿Eliminar esta solicitud?')) return;
    await deleteSolicitud(id);
    load();
  };

  const fecha = (f) => (f ? new Date(f).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' }) : '—');

  const enServidor = (it) => guardado[it.id] || it;
  const mios = soloMios ? new Set(misLeads(items.map((it) => ({ id: it.id, asesor: enServidor(it).asesor })), user?.asesora).map((x) => x.id)) : null;
  const base = mios ? items.filter((it) => mios.has(it.id)) : items;
  const porAtender = base.filter((it) => estaPendiente(enServidor(it).estado));
  const visibles = filtro === 'pendientes' ? porAtender : base;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Solicitudes / <span>Leads</span></h1>
        <Link to="/admin" className={styles.back}>← Volver al panel</Link>
      </div>
      <p className={styles.subtitle}>Mensajes y leads capturados por el bot. Cambia estado, prioridad, asesor o pausa el bot por contacto.</p>

      <div className={styles.toolbar} style={{ flexWrap: 'wrap' }}>
        <button className={filtro === 'pendientes' ? styles.btn : styles.btnGhost} onClick={() => setFiltro('pendientes')}>
          Por atender ({porAtender.length})
        </button>
        <button className={filtro === 'todos' ? styles.btn : styles.btnGhost} onClick={() => setFiltro('todos')}>
          Todos ({base.length})
        </button>
        {user?.asesora && (
          <button className={soloMios ? styles.btn : styles.btnGhost} onClick={() => setSoloMios((v) => !v)}
            title={soloMios ? 'Mostrando solo tus leads; toca para ver los de todas' : 'Toca para ver solo tus leads'}>
            {soloMios ? '✓ Solo mis leads' : 'Solo mis leads'}
          </button>
        )}
        <button className={styles.btnGhost} onClick={load}>↻ Actualizar</button>
      </div>

      {loading ? <p className={styles.empty}>Cargando...</p>
        : visibles.length === 0 ? <p className={styles.empty}>{items.length === 0 ? 'Aún no hay solicitudes.'
          : soloMios && base.length === 0 ? 'No tienes leads asignados. Quita "Solo mis leads" para ver los de todas.'
            : '✓ Estás al día: no hay leads por atender.'}</p>
          : (
            <div className={styles.card} style={{ overflowX: 'auto' }}>
              <table className={`${styles.table} ${movil.tarjetas}`}>
                <thead>
                  <tr>
                    <th>Cliente</th><th>WhatsApp</th><th>Último mensaje</th>
                    <th>Estado</th><th>Prioridad</th><th>Asesor</th><th>Bot</th><th>Fecha</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {visibles.map((it) => (
                    <tr key={it.id}>
                      <td data-label="Cliente">
                        <button type="button" className={movil.verChat} onClick={() => setDetalleId(it.id)} title="Ver conversación">
                          {it.nombre_cliente || 'Sin nombre'}{it.historial ? ' 💬' : ''}
                        </button>
                      </td>
                      <td data-label="WhatsApp">
                        {linkWhatsApp(it.numero_whatsapp)
                          ? <a href={linkWhatsApp(it.numero_whatsapp)} target="_blank" rel="noopener noreferrer">{it.numero_whatsapp}</a>
                          : (it.numero_whatsapp || '—')}
                      </td>
                      <td data-label="Último mensaje" style={{ maxWidth: 220 }}>{it.ultimo_mensaje || '—'}</td>
                      <td data-label="Estado">
                        <select className={styles.select} value={it.estado || 'Nuevo'}
                          onChange={(e) => setField(it.id, 'estado', e.target.value)}>
                          {opcionesEstado(ESTADOS, it.estado || 'Nuevo').map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td data-label="Prioridad">
                        <select className={styles.select} value={it.prioridad || 'MEDIA'}
                          onChange={(e) => setField(it.id, 'prioridad', e.target.value)}>
                          {PRIORIDADES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td data-label="Asesor">
                        <input className={styles.input} style={{ minWidth: 90 }} value={it.asesor || ''}
                          onChange={(e) => setField(it.id, 'asesor', e.target.value)} />
                      </td>
                      <td data-label="Bot">
                        <label className={styles.checkbox}>
                          <input type="checkbox" checked={!!it.bot_pausado}
                            onChange={(e) => setField(it.id, 'bot_pausado', e.target.checked)} /> Pausado
                        </label>
                      </td>
                      <td data-label="Fecha">{fecha(it.fecha_hora)}</td>
                      <td data-label="">
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          {savedId === it.id && <span className={styles.saved}>✓</span>}
                          <button className={styles.btn} onClick={() => save(it)}>Guardar</button>
                          <button className={styles.btnDanger} onClick={() => remove(it.id)}>✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      {detalleId && <LeadDetalle lead={items.find((x) => x.id === detalleId)} onClose={() => setDetalleId(null)} />}
    </div>
  );
}

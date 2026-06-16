import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSolicitudes, updateSolicitud, deleteSolicitud } from '../../lib/solicitudes';
import styles from './BotAdmin.module.css';

const ESTADOS = ['Nuevo', 'Escalado', 'Atendido', 'Cerrado'];
const PRIORIDADES = ['BAJA', 'MEDIA', 'ALTA'];

export default function ManageSolicitudes() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedId, setSavedId] = useState(null);

  const load = async () => {
    setLoading(true);
    setItems(await getSolicitudes());
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const setField = (id, field, val) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: val } : it)));

  const save = async (it) => {
    await updateSolicitud(it.id, {
      estado: it.estado, prioridad: it.prioridad, asesor: it.asesor,
      bot_pausado: it.bot_pausado,
    });
    setSavedId(it.id);
    setTimeout(() => setSavedId(null), 1500);
  };

  const remove = async (id) => {
    if (!confirm('¿Eliminar esta solicitud?')) return;
    await deleteSolicitud(id);
    load();
  };

  const fecha = (f) => (f ? new Date(f).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' }) : '—');

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Solicitudes / <span>Leads</span></h1>
        <Link to="/admin" className={styles.back}>← Volver al panel</Link>
      </div>
      <p className={styles.subtitle}>Mensajes y leads capturados por el bot. Cambia estado, prioridad, asesor o pausa el bot por contacto.</p>

      <div className={styles.toolbar}>
        <button className={styles.btnGhost} onClick={load}>↻ Actualizar</button>
      </div>

      {loading ? <p className={styles.empty}>Cargando...</p>
        : items.length === 0 ? <p className={styles.empty}>Aún no hay solicitudes.</p>
          : (
            <div className={styles.card} style={{ overflowX: 'auto' }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Cliente</th><th>WhatsApp</th><th>Último mensaje</th>
                    <th>Estado</th><th>Prioridad</th><th>Asesor</th><th>Bot</th><th>Fecha</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.id}>
                      <td>{it.nombre_cliente || '—'}</td>
                      <td>{it.numero_whatsapp || '—'}</td>
                      <td style={{ maxWidth: 220 }}>{it.ultimo_mensaje || '—'}</td>
                      <td>
                        <select className={styles.select} value={it.estado || 'Nuevo'}
                          onChange={(e) => setField(it.id, 'estado', e.target.value)}>
                          {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td>
                        <select className={styles.select} value={it.prioridad || 'MEDIA'}
                          onChange={(e) => setField(it.id, 'prioridad', e.target.value)}>
                          {PRIORIDADES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td>
                        <input className={styles.input} style={{ minWidth: 90 }} value={it.asesor || ''}
                          onChange={(e) => setField(it.id, 'asesor', e.target.value)} />
                      </td>
                      <td>
                        <label className={styles.checkbox}>
                          <input type="checkbox" checked={!!it.bot_pausado}
                            onChange={(e) => setField(it.id, 'bot_pausado', e.target.checked)} /> Pausado
                        </label>
                      </td>
                      <td>{fecha(it.fecha_hora)}</td>
                      <td>
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
    </div>
  );
}

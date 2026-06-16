import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLinks, createLink, updateLink, deleteLink } from '../../lib/links';
import styles from './BotAdmin.module.css';

const BLANK = { clave: '', titulo: '', url: '', descripcion: '', activo: true, orden: 0 };

export default function ManageLinks() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nuevo, setNuevo] = useState(BLANK);
  const [savedId, setSavedId] = useState(null);

  const load = async () => {
    setLoading(true);
    setItems(await getLinks());
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const setField = (id, field, val) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: val } : it)));

  const save = async (it) => {
    await updateLink(it.id, {
      clave: it.clave, titulo: it.titulo, url: it.url,
      descripcion: it.descripcion, activo: it.activo, orden: Number(it.orden) || 0,
    });
    setSavedId(it.id);
    setTimeout(() => setSavedId(null), 1500);
  };

  const remove = async (id) => {
    if (!confirm('¿Eliminar este enlace?')) return;
    await deleteLink(id);
    load();
  };

  const crear = async () => {
    if (!nuevo.clave.trim() || !nuevo.url.trim()) return alert('Clave y URL son obligatorias');
    try {
      await createLink({ ...nuevo, orden: Number(nuevo.orden) || 0 });
      setNuevo(BLANK);
      load();
    } catch (e) { alert(e.message); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Enlaces del <span>Bot</span></h1>
        <Link to="/admin" className={styles.back}>← Volver al panel</Link>
      </div>
      <p className={styles.subtitle}>Enlaces que el asistente puede compartir (catálogo, web, redes, PDFs...). La "clave" es única.</p>

      {/* Nuevo */}
      <div className={styles.card}>
        <div className={`${styles.row} ${styles.row3}`}>
          <div className={styles.field}>
            <span className={styles.label}>Clave (única)</span>
            <input className={styles.input} value={nuevo.clave}
              onChange={(e) => setNuevo({ ...nuevo, clave: e.target.value })} placeholder="catalogo, web..." />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Orden</span>
            <input className={styles.input} type="number" value={nuevo.orden}
              onChange={(e) => setNuevo({ ...nuevo, orden: e.target.value })} />
          </div>
          <label className={styles.checkbox} style={{ alignSelf: 'end' }}>
            <input type="checkbox" checked={nuevo.activo}
              onChange={(e) => setNuevo({ ...nuevo, activo: e.target.checked })} /> Activo
          </label>
        </div>
        <div className={`${styles.row} ${styles.row2}`}>
          <div className={styles.field}>
            <span className={styles.label}>Título</span>
            <input className={styles.input} value={nuevo.titulo}
              onChange={(e) => setNuevo({ ...nuevo, titulo: e.target.value })} />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>URL</span>
            <input className={styles.input} value={nuevo.url}
              onChange={(e) => setNuevo({ ...nuevo, url: e.target.value })} placeholder="https://..." />
          </div>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Descripción</span>
          <input className={styles.input} value={nuevo.descripcion}
            onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })} />
        </div>
        <div className={styles.cardActions}>
          <button className={styles.btn} onClick={crear}>+ Agregar enlace</button>
        </div>
      </div>

      {/* Lista */}
      {loading ? <p className={styles.empty}>Cargando...</p>
        : items.length === 0 ? <p className={styles.empty}>Aún no hay enlaces.</p>
          : items.map((it) => (
            <div className={styles.card} key={it.id}>
              <div className={`${styles.row} ${styles.row3}`}>
                <div className={styles.field}>
                  <span className={styles.label}>Clave</span>
                  <input className={styles.input} value={it.clave || ''}
                    onChange={(e) => setField(it.id, 'clave', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <span className={styles.label}>Orden</span>
                  <input className={styles.input} type="number" value={it.orden ?? 0}
                    onChange={(e) => setField(it.id, 'orden', e.target.value)} />
                </div>
                <label className={styles.checkbox} style={{ alignSelf: 'end' }}>
                  <input type="checkbox" checked={!!it.activo}
                    onChange={(e) => setField(it.id, 'activo', e.target.checked)} /> Activo
                </label>
              </div>
              <div className={`${styles.row} ${styles.row2}`}>
                <div className={styles.field}>
                  <span className={styles.label}>Título</span>
                  <input className={styles.input} value={it.titulo || ''}
                    onChange={(e) => setField(it.id, 'titulo', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <span className={styles.label}>URL</span>
                  <input className={styles.input} value={it.url || ''}
                    onChange={(e) => setField(it.id, 'url', e.target.value)} />
                </div>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>Descripción</span>
                <input className={styles.input} value={it.descripcion || ''}
                  onChange={(e) => setField(it.id, 'descripcion', e.target.value)} />
              </div>
              <div className={styles.cardActions}>
                {savedId === it.id && <span className={styles.saved}>✓ Guardado</span>}
                <button className={styles.btnDanger} onClick={() => remove(it.id)}>Eliminar</button>
                <button className={styles.btn} onClick={() => save(it)}>Guardar</button>
              </div>
            </div>
          ))}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFaqs, createFaq, updateFaq, deleteFaq } from '../../lib/faq';
import styles from './BotAdmin.module.css';

const BLANK = { categoria: '', pregunta: '', respuesta: '', activo: true, orden: 0 };

export default function ManageFaq() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nuevo, setNuevo] = useState(BLANK);
  const [savedId, setSavedId] = useState(null);

  const load = async () => {
    setLoading(true);
    setItems(await getFaqs());
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const setField = (id, field, val) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: val } : it)));

  const save = async (it) => {
    await updateFaq(it.id, {
      categoria: it.categoria, pregunta: it.pregunta, respuesta: it.respuesta,
      activo: it.activo, orden: Number(it.orden) || 0,
    });
    setSavedId(it.id);
    setTimeout(() => setSavedId(null), 1500);
  };

  const remove = async (id) => {
    if (!confirm('¿Eliminar esta pregunta?')) return;
    await deleteFaq(id);
    load();
  };

  const crear = async () => {
    if (!nuevo.pregunta.trim() || !nuevo.respuesta.trim()) return alert('Pregunta y respuesta son obligatorias');
    await createFaq({ ...nuevo, orden: Number(nuevo.orden) || 0 });
    setNuevo(BLANK);
    load();
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>FAQ del <span>Bot</span></h1>
        <Link to="/admin" className={styles.back}>← Volver al panel</Link>
      </div>
      <p className={styles.subtitle}>Preguntas y respuestas que usa el asistente de WhatsApp.</p>

      {/* Nueva */}
      <div className={styles.card}>
        <div className={`${styles.row} ${styles.row3}`}>
          <div className={styles.field}>
            <span className={styles.label}>Categoría</span>
            <input className={styles.input} value={nuevo.categoria}
              onChange={(e) => setNuevo({ ...nuevo, categoria: e.target.value })} placeholder="Pagos, Reservas..." />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Orden</span>
            <input className={styles.input} type="number" value={nuevo.orden}
              onChange={(e) => setNuevo({ ...nuevo, orden: e.target.value })} />
          </div>
          <label className={styles.checkbox} style={{ alignSelf: 'end' }}>
            <input type="checkbox" checked={nuevo.activo}
              onChange={(e) => setNuevo({ ...nuevo, activo: e.target.checked })} /> Activa
          </label>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Pregunta</span>
          <input className={styles.input} value={nuevo.pregunta}
            onChange={(e) => setNuevo({ ...nuevo, pregunta: e.target.value })} />
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Respuesta</span>
          <textarea className={styles.textarea} value={nuevo.respuesta}
            onChange={(e) => setNuevo({ ...nuevo, respuesta: e.target.value })} />
        </div>
        <div className={styles.cardActions}>
          <button className={styles.btn} onClick={crear}>+ Agregar pregunta</button>
        </div>
      </div>

      {/* Lista */}
      {loading ? <p className={styles.empty}>Cargando...</p>
        : items.length === 0 ? <p className={styles.empty}>Aún no hay preguntas.</p>
          : items.map((it) => (
            <div className={styles.card} key={it.id}>
              <div className={`${styles.row} ${styles.row3}`}>
                <div className={styles.field}>
                  <span className={styles.label}>Categoría</span>
                  <input className={styles.input} value={it.categoria || ''}
                    onChange={(e) => setField(it.id, 'categoria', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <span className={styles.label}>Orden</span>
                  <input className={styles.input} type="number" value={it.orden ?? 0}
                    onChange={(e) => setField(it.id, 'orden', e.target.value)} />
                </div>
                <label className={styles.checkbox} style={{ alignSelf: 'end' }}>
                  <input type="checkbox" checked={!!it.activo}
                    onChange={(e) => setField(it.id, 'activo', e.target.checked)} /> Activa
                </label>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>Pregunta</span>
                <input className={styles.input} value={it.pregunta || ''}
                  onChange={(e) => setField(it.id, 'pregunta', e.target.value)} />
              </div>
              <div className={styles.field}>
                <span className={styles.label}>Respuesta</span>
                <textarea className={styles.textarea} value={it.respuesta || ''}
                  onChange={(e) => setField(it.id, 'respuesta', e.target.value)} />
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

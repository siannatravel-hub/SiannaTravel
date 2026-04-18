import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getPackages, togglePackageFeatured, updatePackagesOrder } from '../../lib/packages';
import styles from './ManageFeatured.module.css';

export default function ManageFeatured() {
  const { user } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null); // id del paquete que se está guardando
  const [message, setMessage] = useState({ type: '', text: '' });
  const [reorderMode, setReorderMode] = useState(false);
  const [reorderedFeatured, setReorderedFeatured] = useState([]);
  const [savingOrder, setSavingOrder] = useState(false);

  useEffect(() => {
    loadPackages();
  }, []);

  async function loadPackages() {
    setLoading(true);
    try {
      const data = await getPackages();
      // Ordenar: featured primero, luego por título
      const sorted = [...(data || [])].sort((a, b) => {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return (a.title || '').localeCompare(b.title || '');
      });
      setPackages(sorted);
    } catch (err) {
      console.error('Error loading packages:', err);
      setMessage({ type: 'error', text: 'Error al cargar paquetes' });
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleFeatured(pkg) {
    const newValue = !pkg.is_featured;
    setSaving(pkg.id);
    setMessage({ type: '', text: '' });
    try {
      await togglePackageFeatured(pkg.id, newValue);
      setPackages(prev =>
        prev.map(p => (p.id === pkg.id ? { ...p, is_featured: newValue } : p))
          .sort((a, b) => {
            if (a.is_featured && !b.is_featured) return -1;
            if (!a.is_featured && b.is_featured) return 1;
            return (a.title || '').localeCompare(b.title || '');
          })
      );
      setMessage({
        type: 'success',
        text: newValue
          ? `"${pkg.title}" activado como promoción`
          : `"${pkg.title}" removido de promociones`,
      });
    } catch (err) {
      console.error('Error toggling featured:', err);
      setMessage({ type: 'error', text: `Error: ${err.message || err}` });
    } finally {
      setSaving(null);
    }
  }

  const featuredCount = packages.filter(p => p.is_featured).length;

  function startReorderMode() {
    setReorderedFeatured(packages.filter(p => p.is_featured));
    setReorderMode(true);
  }

  function cancelReorderMode() {
    setReorderMode(false);
    setReorderedFeatured([]);
  }

  function moveFeatured(index, direction) {
    setReorderedFeatured(prev => {
      const arr = [...prev];
      const swapIndex = index + direction;
      if (swapIndex < 0 || swapIndex >= arr.length) return arr;
      [arr[index], arr[swapIndex]] = [arr[swapIndex], arr[index]];
      return arr;
    });
  }

  async function saveOrder() {
    setSavingOrder(true);
    try {
      const orderedDbIds = reorderedFeatured.map(p => p._db_id).filter(Boolean);
      if (orderedDbIds.length === 0) throw new Error('No hay IDs de BD disponibles. Sincroniza los paquetes con la BD primero.');
      await updatePackagesOrder(orderedDbIds);
      setReorderMode(false);
      setReorderedFeatured([]);
      setMessage({ type: 'success', text: '✅ Orden de promociones guardado.' });
      await loadPackages();
    } catch (err) {
      setMessage({ type: 'error', text: '❌ ' + (err.message || 'Error al guardar el orden') });
    } finally {
      setSavingOrder(false);
    }
  }

  return (
    <div className={styles.managePackages}>
      <header className={styles.header}>
        <Link to="/admin" className={styles.backBtn}>
          ← Volver al Dashboard
        </Link>
        <h1 className={styles.pageTitle}>Gestionar Promociones</h1>
        {!loading && featuredCount > 0 && (
          <button
            className={styles.reorderBtn}
            onClick={reorderMode ? cancelReorderMode : startReorderMode}
            disabled={savingOrder}
          >
            {reorderMode ? '✕ Cancelar' : '🔀 Reordenar'}
          </button>
        )}
      </header>

      <main className={styles.content}>
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        <div className={styles.intro}>
          <h2>Paquetes en Promoción</h2>
          <p>
            Selecciona qué paquetes aparecen en la sección "Destinos en Promoción" de la página principal.
            Activa o desactiva la estrella para mostrar u ocultar cada paquete de la sección de promociones.
          </p>
          <p style={{ marginTop: '0.5rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
            Promociones activas: <strong style={{ color: '#f59e0b' }}>{featuredCount}</strong>
          </p>
        </div>

        {loading ? (
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>Cargando paquetes...</p>
        ) : packages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.5)' }}>
            <p>No hay paquetes creados aún.</p>
            <Link to="/admin/packages" className={styles.editBtn} style={{ display: 'inline-block', marginTop: '1rem' }}>
              Ir a Gestionar Paquetes
            </Link>
          </div>
        ) : reorderMode ? (
          <div className={styles.reorderContainer}>
            <div className={styles.reorderHeader}>
              <p className={styles.reorderHint}>Usa ↑↓ para cambiar el orden en que aparecen las promociones en la página principal.</p>
              <button className={styles.saveOrderBtn} onClick={saveOrder} disabled={savingOrder}>
                {savingOrder ? '⏳ Guardando...' : '💾 Guardar Orden'}
              </button>
            </div>
            <div className={styles.reorderList}>
              {reorderedFeatured.map((pkg, index) => (
                <div key={pkg.id} className={styles.reorderItem}>
                  <span className={styles.reorderIndex}>{index + 1}</span>
                  <img src={pkg.image} alt={pkg.title} className={styles.reorderThumb} />
                  <div className={styles.reorderInfo}>
                    <span className={styles.reorderTitle}>{pkg.title}</span>
                    <span className={styles.reorderMeta}>{pkg.destination}</span>
                  </div>
                  <div className={styles.reorderBtns}>
                    <button
                      className={styles.reorderMoveBtn}
                      onClick={() => moveFeatured(index, -1)}
                      disabled={index === 0}
                      title="Subir"
                    >↑</button>
                    <button
                      className={styles.reorderMoveBtn}
                      onClick={() => moveFeatured(index, 1)}
                      disabled={index === reorderedFeatured.length - 1}
                      title="Bajar"
                    >↓</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.packagesGrid}>
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={styles.packageCard}
                style={{
                  borderColor: pkg.is_featured
                    ? 'rgba(245, 158, 11, 0.4)'
                    : 'rgba(255, 255, 255, 0.1)',
                }}
              >
                <div className={styles.packageImage}>
                  <img src={pkg.image} alt={pkg.title} />
                  {pkg.is_featured && (
                    <span className={styles.packageTag}>En Promoción</span>
                  )}
                  {pkg.discount > 0 && (
                    <span className={styles.packageDiscount}>-{pkg.discount}%</span>
                  )}
                </div>
                <div className={styles.packageDetails}>
                  <h3 className={styles.packageName}>{pkg.title}</h3>
                  <p className={styles.packageDest}>{pkg.destination}</p>
                  <div className={styles.packageMeta}>
                    <span className={styles.packagePrice}>
                      ${pkg.price?.toLocaleString()} <small>{pkg.currency || 'MXN'}</small>
                    </span>
                    {pkg.original_price > pkg.price && (
                      <span className={styles.packageOriginal}>
                        ${pkg.original_price?.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className={styles.packageActions}>
                    <button
                      onClick={() => handleToggleFeatured(pkg)}
                      disabled={saving === pkg.id}
                      className={pkg.is_featured ? styles.deleteBtn : styles.saveBtn}
                      style={{ flex: 1 }}
                    >
                      {saving === pkg.id
                        ? '⏳ Guardando...'
                        : pkg.is_featured
                          ? '★ Quitar de Promoción'
                          : '☆ Activar Promoción'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

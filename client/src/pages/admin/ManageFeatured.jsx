import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getFeaturedPackages,
  updateFeaturedPackage,
  createFeaturedPackage,
  deleteFeaturedPackage,
  initializeFeaturedPackages,
  syncDefaultFeaturedToDatabase,
} from '../../lib/featuredPackages';
import ImageUpload from '../../components/admin/ImageUpload';
import styles from './ManageFeatured.module.css';

export default function ManageFeatured() {
  const { user } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPkg, setEditingPkg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Form state
  const [form, setForm] = useState({
    title: '',
    destination: '',
    price: '',
    original_price: '',
    discount: '',
    image: '',
    tag: '',
    nights: '',
    rating: '',
    link: '',
  });

  useEffect(() => {
    loadPackages();
  }, []);

  async function loadPackages() {
    setLoading(true);
    const { data, error } = await getFeaturedPackages();
    if (!error) {
      setPackages(data);
    }
    setLoading(false);
  }

  function openEditModal(pkg) {
    setEditingPkg(pkg);
    setForm({
      title: pkg.title || '',
      destination: pkg.destination || '',
      price: pkg.price?.toString() || '',
      original_price: pkg.original_price?.toString() || '',
      discount: pkg.discount?.toString() || '',
      image: pkg.image || '',
      tag: pkg.tag || '',
      nights: pkg.nights?.toString() || '',
      rating: pkg.rating?.toString() || '',
      link: pkg.link || '',
    });
    setIsModalOpen(true);
  }

  function openCreateModal() {
    setEditingPkg(null);
    setForm({
      title: '',
      destination: '',
      price: '',
      original_price: '',
      discount: '',
      image: '',
      tag: 'Oferta',
      nights: '5',
      rating: '4.8',
      link: '/paquetes',
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingPkg(null);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Auto-calculate discount
    if (name === 'price' || name === 'original_price') {
      const price = name === 'price' ? Number(value) : Number(form.price);
      const original = name === 'original_price' ? Number(value) : Number(form.original_price);
      if (original > price && price > 0) {
        const discount = Math.round(((original - price) / original) * 100);
        setForm((prev) => ({ ...prev, discount: discount.toString() }));
      }
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage({ type: '', text: '' });

    const packageData = {
      title: form.title,
      destination: form.destination,
      price: Number(form.price),
      original_price: Number(form.original_price) || Number(form.price),
      discount: Number(form.discount) || 0,
      image: form.image,
      tag: form.tag,
      nights: Number(form.nights),
      rating: Number(form.rating),
      link: form.link || '/paquetes',
    };

    let result;
    if (editingPkg) {
      // If the package only exists in the local defaults (string id), create it in the DB
      const numericId = parseInt(editingPkg.id, 10);
      const hasRealDbId = !isNaN(numericId) && String(numericId) === String(editingPkg.id);
      if (hasRealDbId) {
        result = await updateFeaturedPackage(numericId, packageData);
      } else {
        result = await createFeaturedPackage(packageData);
      }
    } else {
      result = await createFeaturedPackage(packageData);
    }

    if (result.error) {
      setMessage({ type: 'error', text: `Error: ${result.error.message || result.error}` });
    } else {
      setMessage({ type: 'success', text: editingPkg ? 'Paquete actualizado correctamente' : 'Paquete creado correctamente' });
      closeModal();
      loadPackages();
    }

    setSaving(false);
  }

  async function handleDelete(id) {
    if (!confirm('¿Estás seguro de eliminar este paquete?')) return;

    const { error } = await deleteFeaturedPackage(id);
    if (error) {
      setMessage({ type: 'error', text: `Error al eliminar: ${error.message || error}` });
    } else {
      setMessage({ type: 'success', text: 'Paquete eliminado' });
      loadPackages();
    }
  }

  async function handleInitialize() {
    const { error } = await initializeFeaturedPackages();
    if (error) {
      setMessage({ type: 'error', text: `Error: ${error.message || error}` });
    } else {
      setMessage({ type: 'success', text: 'Paquetes inicializados en la base de datos' });
      loadPackages();
    }
  }

  async function handleSyncToDatabase() {
    if (!confirm('¿Sincronizar promociones del código con Supabase?\nEsto borrará todas las promociones en BD y las reemplazará con las definidas en el código. Continuêr?')) return;
    setSyncing(true);
    setMessage({ type: '', text: '' });
    const { error } = await syncDefaultFeaturedToDatabase();
    if (error) {
      setMessage({ type: 'error', text: `Error al sincronizar: ${error.message || error}` });
    } else {
      setMessage({ type: 'success', text: '✅ Promociones sincronizadas correctamente desde el código.' });
      loadPackages();
    }
    setSyncing(false);
  }

  return (
    <div className={styles.managePackages}>
      <header className={styles.header}>
        <Link to="/admin" className={styles.backBtn}>
          ← Volver al Dashboard
        </Link>
        <h1 className={styles.pageTitle}>Gestionar Promociones</h1>
      </header>

      <main className={styles.content}>
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        <div className={styles.intro}>
          <h2>Paquetes Destacados / Promociones</h2>
          <p>
            Estos son los 3 paquetes que aparecen en la sección "Destinos en Promoción" de la página principal.
            Puedes editar la información, cambiar las imágenes y actualizar los precios.
          </p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={openCreateModal} className={styles.saveBtn}>
              + Añadir Paquete
            </button>
            <button onClick={handleInitialize} className={styles.editBtn}>
              Inicializar en BD
            </button>
            <button
              onClick={handleSyncToDatabase}
              disabled={syncing}
              className={styles.syncBtn}
              title="Borra las promociones de Supabase y las reemplaza con las del código"
            >
              {syncing ? '⏳ Sincronizando...' : '🔄 Sincronizar desde código'}
            </button>
          </div>
        </div>

        {loading ? (
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>Cargando paquetes...</p>
        ) : (
          <div className={styles.packagesGrid}>
            {packages.map((pkg) => (
              <div key={pkg.id} className={styles.packageCard}>
                <div className={styles.packageImage}>
                  <img src={pkg.image} alt={pkg.title} />
                  {pkg.tag && <span className={styles.packageTag}>{pkg.tag}</span>}
                  {pkg.discount > 0 && (
                    <span className={styles.packageDiscount}>-{pkg.discount}%</span>
                  )}
                </div>
                <div className={styles.packageDetails}>
                  <h3 className={styles.packageName}>{pkg.title}</h3>
                  <p className={styles.packageDest}>{pkg.destination}</p>
                  <div className={styles.packageMeta}>
                    <span className={styles.packagePrice}>
                      ${pkg.price?.toLocaleString()}
                    </span>
                    {pkg.original_price > pkg.price && (
                      <span className={styles.packageOriginal}>
                        ${pkg.original_price?.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className={styles.packageActions}>
                    <button
                      onClick={() => openEditModal(pkg)}
                      className={styles.editBtn}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className={styles.deleteBtn}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className={styles.modal} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>{editingPkg ? 'Editar Paquete' : 'Nuevo Paquete'}</h3>
              <button onClick={closeModal} className={styles.closeBtn}>
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Título</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className={styles.formInput}
                  placeholder="Ej: Maldivas Todo Incluido"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Destino</label>
                <input
                  type="text"
                  name="destination"
                  value={form.destination}
                  onChange={handleChange}
                  className={styles.formInput}
                  placeholder="Ej: Maldivas"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Precio (USD)</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    className={styles.formInput}
                    placeholder="2999"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Precio Original</label>
                  <input
                    type="number"
                    name="original_price"
                    value={form.original_price}
                    onChange={handleChange}
                    className={styles.formInput}
                    placeholder="3499"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Noches</label>
                  <input
                    type="number"
                    name="nights"
                    value={form.nights}
                    onChange={handleChange}
                    className={styles.formInput}
                    placeholder="5"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Rating</label>
                  <input
                    type="number"
                    name="rating"
                    value={form.rating}
                    onChange={handleChange}
                    className={styles.formInput}
                    placeholder="4.8"
                    step="0.1"
                    min="0"
                    max="5"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Etiqueta (Tag)</label>
                <input
                  type="text"
                  name="tag"
                  value={form.tag}
                  onChange={handleChange}
                  className={styles.formInput}
                  placeholder="Ej: Oferta Especial, Más Vendido"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Imagen del Paquete</label>
                <ImageUpload
                  value={form.image}
                  onChange={(url) => setForm(prev => ({ ...prev, image: url }))}
                  folder="featured"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Link (opcional)</label>
                <input
                  type="text"
                  name="link"
                  value={form.link}
                  onChange={handleChange}
                  className={styles.formInput}
                  placeholder="/paquetes"
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button onClick={closeModal} className={styles.cancelBtn}>
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className={styles.saveBtn}
                disabled={saving || !form.title || !form.price}
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

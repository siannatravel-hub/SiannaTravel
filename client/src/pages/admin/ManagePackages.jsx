import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getPackages,
  updatePackage,
  deletePackage,
  getPackageHistory,
  togglePackageStatus,
  fieldLabels,
  initializePackages,
  syncDefaultsToDatabase
} from '../../lib/packages';
import ImageUpload from '../../components/admin/ImageUpload';
import styles from './ManagePackages.module.css';

const TABS = [
  { id: 'general', label: '📋 General' },
  { id: 'vuelo_hotel', label: '✈️ Vuelo & Hotel' },
  { id: 'galeria', label: '🖼️ Galería' },
  { id: 'itinerario', label: '🗓️ Itinerario' },
  { id: 'condiciones', label: '📜 Condiciones' },
];

export default function ManagePackages() {
  const { user } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editTab, setEditTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  useEffect(() => {
    loadPackages();
  }, []);

  async function loadPackages() {
    try {
      setLoading(true);
      let data = await getPackages();
      if (data.length === 0) {
        data = await initializePackages();
      }
      setPackages(data);
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSyncToDatabase() {
    if (!confirm('¿Sincronizar los paquetes del código con Supabase?\nEsto SOLO inserta paquetes nuevos que no existan aún en la base de datos. Los cambios que hayas hecho en el admin (imágenes, contenido, etc.) NO se sobreescriben.')) return;
    setSyncing(true);
    setSyncMessage('');
    try {
      await syncDefaultsToDatabase();
      setSyncMessage('✅ Paquetes sincronizados correctamente con Supabase.');
      await loadPackages();
    } catch (error) {
      setSyncMessage('❌ ' + (error.message || 'Error al sincronizar'));
    } finally {
      setSyncing(false);
    }
  }

  function openEditModal(pkg) {
    setSelectedPackage(pkg);
    setEditForm({
      ...pkg,
      includes: Array.isArray(pkg.includes) ? [...pkg.includes] : [],
      gallery: Array.isArray(pkg.gallery) ? [...pkg.gallery] : [],
      flight_includes: Array.isArray(pkg.flight_includes) ? [...pkg.flight_includes] : [],
      transfers_included: Array.isArray(pkg.transfers_included) ? [...pkg.transfers_included] : [],
      itinerary: Array.isArray(pkg.itinerary)
        ? pkg.itinerary.map(d => ({ ...d, meals: Array.isArray(d.meals) ? [...d.meals] : [] }))
        : [],
      important_info: Array.isArray(pkg.important_info)
        ? pkg.important_info.map(i => ({ ...i }))
        : [],
      terms_conditions: Array.isArray(pkg.terms_conditions)
        ? [...pkg.terms_conditions]
        : pkg.terms_conditions ? [pkg.terms_conditions] : [],
      payment_options: Array.isArray(pkg.payment_options) ? [...pkg.payment_options] : [],
    });
    setEditTab('general');
  }

  function closeEditModal() {
    setSelectedPackage(null);
    setEditForm({});
  }

  function handleInputChange(field, value) {
    setEditForm(prev => ({ ...prev, [field]: value }));
  }

  // Simple string array helpers
  function handleArrayItemChange(field, index, value) {
    setEditForm(prev => {
      const arr = [...(prev[field] || [])];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  }

  function addArrayItem(field, defaultValue = '') {
    setEditForm(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), defaultValue]
    }));
  }

  function removeArrayItem(field, index) {
    setEditForm(prev => {
      const arr = [...(prev[field] || [])];
      arr.splice(index, 1);
      return { ...prev, [field]: arr };
    });
  }

  // Itinerary helpers
  function handleItineraryChange(index, subfield, value) {
    setEditForm(prev => {
      const itinerary = [...(prev.itinerary || [])];
      itinerary[index] = { ...itinerary[index], [subfield]: value };
      return { ...prev, itinerary };
    });
  }

  function handleItineraryMealChange(dayIndex, mealIndex, value) {
    setEditForm(prev => {
      const itinerary = [...(prev.itinerary || [])];
      const meals = [...(itinerary[dayIndex].meals || [])];
      meals[mealIndex] = value;
      itinerary[dayIndex] = { ...itinerary[dayIndex], meals };
      return { ...prev, itinerary };
    });
  }

  function addItineraryDay() {
    setEditForm(prev => {
      const itinerary = [...(prev.itinerary || [])];
      itinerary.push({ day: itinerary.length + 1, title: '', description: '', meals: [] });
      return { ...prev, itinerary };
    });
  }

  function removeItineraryDay(index) {
    setEditForm(prev => {
      const itinerary = [...(prev.itinerary || [])];
      itinerary.splice(index, 1);
      return { ...prev, itinerary: itinerary.map((d, i) => ({ ...d, day: i + 1 })) };
    });
  }

  function addItineraryMeal(dayIndex) {
    setEditForm(prev => {
      const itinerary = [...(prev.itinerary || [])];
      const meals = [...(itinerary[dayIndex].meals || []), ''];
      itinerary[dayIndex] = { ...itinerary[dayIndex], meals };
      return { ...prev, itinerary };
    });
  }

  function removeItineraryMeal(dayIndex, mealIndex) {
    setEditForm(prev => {
      const itinerary = [...(prev.itinerary || [])];
      const meals = [...(itinerary[dayIndex].meals || [])];
      meals.splice(mealIndex, 1);
      itinerary[dayIndex] = { ...itinerary[dayIndex], meals };
      return { ...prev, itinerary };
    });
  }

  // Important info helpers
  function handleImportantInfoChange(index, subfield, value) {
    setEditForm(prev => {
      const important_info = [...(prev.important_info || [])];
      important_info[index] = { ...important_info[index], [subfield]: value };
      return { ...prev, important_info };
    });
  }

  function addImportantInfo() {
    setEditForm(prev => ({
      ...prev,
      important_info: [...(prev.important_info || []), { title: '', text: '' }]
    }));
  }

  function removeImportantInfo(index) {
    setEditForm(prev => {
      const important_info = [...(prev.important_info || [])];
      important_info.splice(index, 1);
      return { ...prev, important_info };
    });
  }

  async function handleSave() {
    if (!selectedPackage) return;
    
    setSaving(true);
    try {
      const updates = {};
      const scalarFields = [
        'title', 'destination', 'country', 'region', 'description',
        'price', 'original_price', 'discount', 'duration', 'nights',
        'image', 'category', 'rating', 'reviews_count', 'is_featured',
        'airline', 'flight_type', 'service_type', 'persons',
        'hotel_name', 'hotel_stars', 'room_type', 'accommodation_type',
        'itinerary_pdf', 'dates', 'contact_whatsapp', 'cancellation_policy'
      ];
      
      for (const field of scalarFields) {
        // Si la columna no existe aún en la BD, el objeto del paquete no tendrá esa clave → omitir
        if (!(field in selectedPackage) && editForm[field] !== undefined && editForm[field] !== '') {
          // La columna no existe en la BD todavía, saltar
          continue;
        }
        if (editForm[field] !== selectedPackage[field]) {
          let value = editForm[field];
          if (['price', 'original_price', 'discount', 'nights', 'hotel_stars', 'persons', 'reviews_count'].includes(field)) {
            value = parseInt(value) || 0;
          }
          if (field === 'rating') {
            value = parseFloat(value) || 0;
          }
          updates[field] = value;
        }
      }

      // Array fields — only include if the column exists in the DB record
      const arrayFields = [
        'includes', 'gallery', 'flight_includes', 'transfers_included',
        'itinerary', 'important_info', 'terms_conditions', 'payment_options'
      ];
      for (const field of arrayFields) {
        if (field in selectedPackage) {
          updates[field] = editForm[field] || [];
        }
      }

      if (Object.keys(updates).length > 0) {
        await updatePackage(selectedPackage.id, updates, user?.email || 'admin');
        await loadPackages();
      }
      
      closeEditModal();
    } catch (error) {
      console.error('Error saving package:', error);
      alert('Error al guardar los cambios:\n' + (error.message || error));
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus(pkg) {
    try {
      await togglePackageStatus(pkg.id, !pkg.is_active);
      await loadPackages();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  }

  async function handleDeletePackage(pkg) {
    if (!confirm(`¿Eliminar permanentemente el paquete "${pkg.title || '(sin título)'}"?\n\nEsta acción no se puede deshacer.`)) return;
    try {
      await deletePackage(pkg.id);
      await loadPackages();
    } catch (error) {
      console.error('Error deleting package:', error);
      alert('Error al eliminar el paquete:\n' + (error.message || error));
    }
  }

  async function openHistoryModal(pkg) {
    setShowHistory(pkg);
    setLoadingHistory(true);
    try {
      const historyData = await getPackageHistory(pkg.id);
      setHistory(historyData);
    } catch (error) {
      console.error('Error loading history:', error);
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  }

  function closeHistoryModal() {
    setShowHistory(null);
    setHistory([]);
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function formatValue(value, field) {
    if (value === null || value === undefined || value === '') return '(vacío)';
    if (field === 'price' || field === 'original_price') return `$${value}`;
    if (field === 'discount') return `${value}%`;
    if (field === 'is_active' || field === 'is_featured') return value === 'true' ? 'Sí' : 'No';
    if (value.length > 30) return value.substring(0, 30) + '...';
    return value;
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando paquetes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.titleIcon}>📦</span>
          Gestión de Paquetes
        </h1>
        <div className={styles.headerActions}>
          <button
            className={styles.syncBtn}
            onClick={handleSyncToDatabase}
            disabled={syncing}
            title="Envía los paquetes definidos en el código hacia Supabase (upsert por id)"
          >
            {syncing ? '⏳ Sincronizando...' : '🔄 Sincronizar con BD'}
          </button>
          <Link to="/admin" className={styles.backBtn}>
            ← Volver al Dashboard
          </Link>
        </div>
      </div>
      {syncMessage && (
        <div className={`${styles.syncMessage} ${syncMessage.startsWith('✅') ? styles.syncSuccess : styles.syncError}`}>
          {syncMessage}
          <button className={styles.syncMessageClose} onClick={() => setSyncMessage('')}>×</button>
        </div>
      )}

      {packages.length === 0 ? (
        <div className={styles.emptyState}>
          <span>📦</span>
          <h3>No hay paquetes</h3>
          <p>Aún no se han creado paquetes de viaje</p>
          <button className={styles.addBtn} onClick={loadPackages}>
            Cargar paquetes de ejemplo
          </button>
        </div>
      ) : (
        <div className={styles.packagesGrid}>
          {packages.map(pkg => (
            <div 
              key={pkg.id} 
              className={`${styles.packageCard} ${!pkg.is_active ? styles.inactive : ''}`}
            >
              <div className={styles.packageImage}>
                <img src={pkg.image} alt={pkg.title} />
                <span className={`${styles.statusBadge} ${pkg.is_active ? styles.active : styles.inactive}`}>
                  {pkg.is_active ? 'Activo' : 'Inactivo'}
                </span>
                {pkg.is_featured && (
                  <span className={styles.featuredBadge}>⭐ Destacado</span>
                )}
              </div>
              
              <div className={styles.packageInfo}>
                <h3 className={styles.packageTitle}>{pkg.title}</h3>
                <p className={styles.packageDestination}>
                  {pkg.destination}, {pkg.country} • {pkg.duration}
                </p>
                
                <div className={styles.packageMeta}>
                  <div className={styles.packagePrice}>
                    ${pkg.price?.toLocaleString()}
                    {pkg.original_price && (
                      <span>${pkg.original_price?.toLocaleString()}</span>
                    )}
                  </div>
                  <div className={styles.packageRating}>
                    ⭐ {pkg.rating}
                  </div>
                </div>
                
                <div className={styles.packageActions}>
                  <button 
                    className={styles.editBtn}
                    onClick={() => openEditModal(pkg)}
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    className={styles.historyBtn}
                    onClick={() => openHistoryModal(pkg)}
                  >
                    📋 Historial
                  </button>
                  <button 
                    className={`${styles.toggleBtn} ${pkg.is_active ? styles.deactivate : ''}`}
                    onClick={() => handleToggleStatus(pkg)}
                  >
                    {pkg.is_active ? '🔴' : '🟢'}
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeletePackage(pkg)}
                    title="Eliminar paquete permanentemente"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Edición */}
      {selectedPackage && (
        <div className={styles.modalOverlay} onClick={closeEditModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Editar Paquete</h2>
              <button className={styles.closeBtn} onClick={closeEditModal}>×</button>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  className={`${styles.tab} ${editTab === tab.id ? styles.tabActive : ''}`}
                  onClick={() => setEditTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className={styles.modalBody}>
              {/* ── General ── */}
              {editTab === 'general' && (
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Título del Paquete</label>
                    <input type="text" value={editForm.title || ''} onChange={e => handleInputChange('title', e.target.value)} placeholder="ej: Cancún Todo Incluido" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Destino</label>
                    <input type="text" value={editForm.destination || ''} onChange={e => handleInputChange('destination', e.target.value)} placeholder="ej: Cancún, México" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>País</label>
                    <input type="text" value={editForm.country || ''} onChange={e => handleInputChange('country', e.target.value)} placeholder="ej: México" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Región</label>
                    <select value={editForm.region || ''} onChange={e => handleInputChange('region', e.target.value)}>
                      <option value="">Seleccionar región</option>
                      <option value="Caribe">Caribe</option>
                      <option value="Europa">Europa</option>
                      <option value="Asia">Asia</option>
                      <option value="Norteamérica">Norteamérica</option>
                      <option value="Sudamérica">Sudamérica</option>
                      <option value="Medio Oriente">Medio Oriente</option>
                      <option value="África">África</option>
                      <option value="Oceanía">Oceanía</option>
                      <option value="Norte de México">Norte de México</option>
                    </select>
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Descripción</label>
                    <textarea value={editForm.description || ''} onChange={e => handleInputChange('description', e.target.value)} placeholder="Descripción del paquete..." />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Precio ($)</label>
                    <input type="number" value={editForm.price || ''} onChange={e => handleInputChange('price', e.target.value)} placeholder="ej: 1899" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Precio Original ($)</label>
                    <input type="number" value={editForm.original_price || ''} onChange={e => handleInputChange('original_price', e.target.value)} placeholder="ej: 2299" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Descuento (%)</label>
                    <input type="number" value={editForm.discount || ''} onChange={e => handleInputChange('discount', e.target.value)} placeholder="ej: 17" min="0" max="100" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Duración</label>
                    <input type="text" value={editForm.duration || ''} onChange={e => handleInputChange('duration', e.target.value)} placeholder="ej: 6 días / 5 noches" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Noches</label>
                    <input type="number" value={editForm.nights || ''} onChange={e => handleInputChange('nights', e.target.value)} placeholder="ej: 5" min="1" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Calificación (0-5)</label>
                    <input type="number" value={editForm.rating || ''} onChange={e => handleInputChange('rating', e.target.value)} placeholder="ej: 4.8" min="0" max="5" step="0.1" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>N° de Reseñas</label>
                    <input type="number" value={editForm.reviews_count || ''} onChange={e => handleInputChange('reviews_count', e.target.value)} placeholder="ej: 124" min="0" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Categoría</label>
                    <select value={editForm.category || ''} onChange={e => handleInputChange('category', e.target.value)}>
                      <option value="">Seleccionar categoría</option>
                      <option value="playa">🏖️ Playa</option>
                      <option value="cultural">🏛️ Cultural</option>
                      <option value="aventura">🏔️ Aventura</option>
                      <option value="lujo">💎 Lujo</option>
                      <option value="romantico">💕 Romántico</option>
                      <option value="familiar">👨‍👩‍👧‍👦 Familiar</option>
                      <option value="familia">🎡 Familia</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Fechas / Salidas</label>
                    <input type="text" value={editForm.dates || ''} onChange={e => handleInputChange('dates', e.target.value)} placeholder="ej: Salidas todos los lunes" />
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Imagen Principal</label>
                    <ImageUpload value={editForm.image || ''} onChange={(url) => handleInputChange('image', url)} folder="packages" />
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.checkboxGroup}>
                      <input type="checkbox" checked={editForm.is_featured || false} onChange={e => handleInputChange('is_featured', e.target.checked)} />
                      <span>⭐ Marcar como paquete destacado</span>
                    </label>
                  </div>
                </div>
              )}

              {/* ── Vuelo & Hotel ── */}
              {editTab === 'vuelo_hotel' && (
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Aerolínea</label>
                    <input type="text" value={editForm.airline || ''} onChange={e => handleInputChange('airline', e.target.value)} placeholder="ej: Aeroméxico" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Tipo de Vuelo</label>
                    <select value={editForm.flight_type || ''} onChange={e => handleInputChange('flight_type', e.target.value)}>
                      <option value="">Seleccionar</option>
                      <option value="nacional">Nacional</option>
                      <option value="internacional">Internacional</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Tipo de Servicio</label>
                    <select value={editForm.service_type || ''} onChange={e => handleInputChange('service_type', e.target.value)}>
                      <option value="">Seleccionar</option>
                      <option value="paquete">Paquete completo</option>
                      <option value="hotel">Solo hotel</option>
                      <option value="vuelo">Solo vuelo</option>
                      <option value="crucero">Crucero</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Personas</label>
                    <input type="number" value={editForm.persons || ''} onChange={e => handleInputChange('persons', e.target.value)} placeholder="ej: 2" min="1" />
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Incluye en el vuelo</label>
                    <div className={styles.arrayEditor}>
                      {(editForm.flight_includes || []).map((item, i) => (
                        <div key={i} className={styles.arrayItem}>
                          <input type="text" value={item} onChange={e => handleArrayItemChange('flight_includes', i, e.target.value)} placeholder="ej: Equipaje documentado 23kg" />
                          <button className={styles.removeItemBtn} onClick={() => removeArrayItem('flight_includes', i)}>×</button>
                        </div>
                      ))}
                      <button className={styles.addItemBtn} onClick={() => addArrayItem('flight_includes')}>+ Agregar</button>
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Nombre del Hotel</label>
                    <input type="text" value={editForm.hotel_name || ''} onChange={e => handleInputChange('hotel_name', e.target.value)} placeholder="ej: Grand Fiesta Americana" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Estrellas del Hotel</label>
                    <select value={editForm.hotel_stars || ''} onChange={e => handleInputChange('hotel_stars', e.target.value)}>
                      <option value="">Seleccionar</option>
                      <option value="1">★ 1 estrella</option>
                      <option value="2">★★ 2 estrellas</option>
                      <option value="3">★★★ 3 estrellas</option>
                      <option value="4">★★★★ 4 estrellas</option>
                      <option value="5">★★★★★ 5 estrellas</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Tipo de Habitación</label>
                    <input type="text" value={editForm.room_type || ''} onChange={e => handleInputChange('room_type', e.target.value)} placeholder="ej: Suite Vista al Mar" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Régimen de Alojamiento</label>
                    <select value={editForm.accommodation_type || ''} onChange={e => handleInputChange('accommodation_type', e.target.value)}>
                      <option value="">Seleccionar</option>
                      <option value="Todo Incluido">Todo Incluido</option>
                      <option value="Media Pensión">Media Pensión</option>
                      <option value="Solo Desayuno">Solo Desayuno</option>
                      <option value="Solo Habitación">Solo Habitación</option>
                    </select>
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Qué incluye el paquete</label>
                    <div className={styles.arrayEditor}>
                      {(editForm.includes || []).map((item, i) => (
                        <div key={i} className={styles.arrayItem}>
                          <input type="text" value={item} onChange={e => handleArrayItemChange('includes', i, e.target.value)} placeholder="ej: Vuelo redondo" />
                          <button className={styles.removeItemBtn} onClick={() => removeArrayItem('includes', i)}>×</button>
                        </div>
                      ))}
                      <button className={styles.addItemBtn} onClick={() => addArrayItem('includes')}>+ Agregar</button>
                    </div>
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Traslados incluidos</label>
                    <div className={styles.arrayEditor}>
                      {(editForm.transfers_included || []).map((item, i) => (
                        <div key={i} className={styles.arrayItem}>
                          <input type="text" value={item} onChange={e => handleArrayItemChange('transfers_included', i, e.target.value)} placeholder="ej: Aeropuerto → Hotel" />
                          <button className={styles.removeItemBtn} onClick={() => removeArrayItem('transfers_included', i)}>×</button>
                        </div>
                      ))}
                      <button className={styles.addItemBtn} onClick={() => addArrayItem('transfers_included')}>+ Agregar</button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Galería ── */}
              {editTab === 'galeria' && (
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Imágenes de la galería</label>
                    <p className={styles.fieldHint}>Agrega hasta 8 imágenes para la galería del paquete.</p>
                    <div className={styles.galleryEditor}>
                      {(editForm.gallery || []).map((url, i) => (
                        <div key={i} className={styles.galleryItem}>
                          {url && (
                            <div className={styles.galleryPreview}>
                              <img src={url} alt={`Galería ${i + 1}`} />
                            </div>
                          )}
                          <div className={styles.galleryItemControls}>
                            <ImageUpload
                              value={url}
                              onChange={(newUrl) => handleArrayItemChange('gallery', i, newUrl)}
                              folder="packages/gallery"
                            />
                            <button className={styles.removeGalleryBtn} onClick={() => removeArrayItem('gallery', i)}>
                              ✕ Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                      {(editForm.gallery || []).length < 8 && (
                        <button className={styles.addGalleryBtn} onClick={() => addArrayItem('gallery', '')}>
                          + Agregar imagen
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Itinerario ── */}
              {editTab === 'itinerario' && (
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>URL del Itinerario PDF (Google Drive)</label>
                    <input
                      type="url"
                      value={editForm.itinerary_pdf || ''}
                      onChange={e => handleInputChange('itinerary_pdf', e.target.value)}
                      placeholder="https://drive.google.com/file/d/..."
                    />
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Días del Itinerario</label>
                    <div className={styles.itineraryEditor}>
                      {(editForm.itinerary || []).map((day, i) => (
                        <div key={i} className={styles.itineraryDay}>
                          <div className={styles.itineraryDayHeader}>
                            <span className={styles.dayBadge}>Día {day.day}</span>
                            <button className={styles.removeDayBtn} onClick={() => removeItineraryDay(i)}>× Eliminar</button>
                          </div>
                          <div className={styles.itineraryDayFields}>
                            <div className={styles.formGroup}>
                              <label>Título del día</label>
                              <input
                                type="text"
                                value={day.title || ''}
                                onChange={e => handleItineraryChange(i, 'title', e.target.value)}
                                placeholder="ej: Llegada a Cancún"
                              />
                            </div>
                            <div className={styles.formGroup}>
                              <label>Descripción</label>
                              <textarea
                                value={day.description || ''}
                                onChange={e => handleItineraryChange(i, 'description', e.target.value)}
                                placeholder="Descripción del día..."
                                rows={3}
                              />
                            </div>
                            <div className={styles.formGroup}>
                              <label>Comidas incluidas</label>
                              <div className={styles.mealsEditor}>
                                {(day.meals || []).map((meal, mi) => (
                                  <div key={mi} className={styles.mealItem}>
                                    <select value={meal} onChange={e => handleItineraryMealChange(i, mi, e.target.value)}>
                                      <option value="">Seleccionar</option>
                                      <option value="Desayuno">Desayuno</option>
                                      <option value="Almuerzo">Almuerzo</option>
                                      <option value="Cena">Cena</option>
                                    </select>
                                    <button className={styles.removeItemBtn} onClick={() => removeItineraryMeal(i, mi)}>×</button>
                                  </div>
                                ))}
                                <button className={styles.addItemBtn} onClick={() => addItineraryMeal(i)}>+ Comida</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button className={styles.addDayBtn} onClick={addItineraryDay}>
                        + Agregar día
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Condiciones ── */}
              {editTab === 'condiciones' && (
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Información del Destino</label>
                    <div className={styles.arrayEditor}>
                      {(editForm.important_info || []).map((info, i) => (
                        <div key={i} className={styles.infoCard}>
                          <div className={styles.infoCardFields}>
                            <input
                              type="text"
                              value={info.title || ''}
                              onChange={e => handleImportantInfoChange(i, 'title', e.target.value)}
                              placeholder="ej: Documentación"
                            />
                            <input
                              type="text"
                              value={info.text || ''}
                              onChange={e => handleImportantInfoChange(i, 'text', e.target.value)}
                              placeholder="ej: Pasaporte vigente mínimo 6 meses"
                            />
                          </div>
                          <button className={styles.removeItemBtn} onClick={() => removeImportantInfo(i)}>×</button>
                        </div>
                      ))}
                      <button className={styles.addItemBtn} onClick={addImportantInfo}>+ Agregar info</button>
                    </div>
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Términos y Condiciones</label>
                    <div className={styles.arrayEditor}>
                      {(editForm.terms_conditions || []).map((term, i) => (
                        <div key={i} className={styles.arrayItem}>
                          <input
                            type="text"
                            value={term}
                            onChange={e => handleArrayItemChange('terms_conditions', i, e.target.value)}
                            placeholder="ej: Precios sujetos a disponibilidad"
                          />
                          <button className={styles.removeItemBtn} onClick={() => removeArrayItem('terms_conditions', i)}>×</button>
                        </div>
                      ))}
                      <button className={styles.addItemBtn} onClick={() => addArrayItem('terms_conditions')}>+ Agregar</button>
                    </div>
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Política de Cancelación</label>
                    <textarea
                      value={editForm.cancellation_policy || ''}
                      onChange={e => handleInputChange('cancellation_policy', e.target.value)}
                      placeholder="ej: Cancelación gratuita hasta 30 días antes del viaje..."
                      rows={3}
                    />
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Formas de Pago</label>
                    <div className={styles.arrayEditor}>
                      {(editForm.payment_options || []).map((opt, i) => (
                        <div key={i} className={styles.arrayItem}>
                          <input
                            type="text"
                            value={opt}
                            onChange={e => handleArrayItemChange('payment_options', i, e.target.value)}
                            placeholder="ej: Tarjeta de crédito"
                          />
                          <button className={styles.removeItemBtn} onClick={() => removeArrayItem('payment_options', i)}>×</button>
                        </div>
                      ))}
                      <button className={styles.addItemBtn} onClick={() => addArrayItem('payment_options')}>+ Agregar</button>
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>WhatsApp de contacto</label>
                    <input
                      type="text"
                      value={editForm.contact_whatsapp || ''}
                      onChange={e => handleInputChange('contact_whatsapp', e.target.value)}
                      placeholder="ej: 527753718942"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={closeEditModal}>
                Cancelar
              </button>
              <button 
                className={styles.saveBtn} 
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Historial */}
      {showHistory && (
        <div className={styles.modalOverlay} onClick={closeHistoryModal}>
          <div 
            className={`${styles.modal} ${styles.historyModal}`} 
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Historial de Cambios</h2>
              <button className={styles.closeBtn} onClick={closeHistoryModal}>×</button>
            </div>
            
            <div className={styles.modalBody}>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>
                📦 {showHistory.title}
              </p>
              
              {loadingHistory ? (
                <div className={styles.loading}>
                  <div className={styles.spinner}></div>
                  <p>Cargando historial...</p>
                </div>
              ) : history.length === 0 ? (
                <div className={styles.emptyHistory}>
                  <span>📋</span>
                  <p>No hay cambios registrados</p>
                </div>
              ) : (
                <div className={styles.historyList}>
                  {history.map(item => (
                    <div key={item.id} className={styles.historyItem}>
                      <div className={styles.historyHeader}>
                        <span className={styles.historyField}>
                          {fieldLabels[item.field_changed] || item.field_changed}
                        </span>
                        <span className={styles.historyDate}>
                          {formatDate(item.changed_at)}
                        </span>
                      </div>
                      <div className={styles.historyValues}>
                        <span className={styles.oldValue}>
                          {formatValue(item.old_value, item.field_changed)}
                        </span>
                        <span className={styles.arrow}>→</span>
                        <span className={styles.newValue}>
                          {formatValue(item.new_value, item.field_changed)}
                        </span>
                      </div>
                      {item.changed_by && (
                        <div className={styles.historyUser}>
                          Por: {item.changed_by}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

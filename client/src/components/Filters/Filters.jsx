import styles from './Filters.module.css';

const TYPE_OPTIONS = [
  { value: '', label: 'Todos los tipos' },
  { value: 'playa', label: '🏖 Playa' },
  { value: 'cultural', label: '🏛 Cultural' },
  { value: 'aventura', label: '🏔 Aventura' },
];

const REGION_OPTIONS = [
  { value: '', label: 'Todas las regiones' },
  { value: 'Caribe', label: 'Caribe' },
  { value: 'Europa', label: 'Europa' },
  { value: 'Sudamérica', label: 'Sudamérica' },
  { value: 'Asia', label: 'Asia' },
];

const SORT_OPTIONS = [
  { value: '', label: 'Relevancia' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'rating', label: 'Mejor calificados' },
];

export default function Filters({ filters, onChange, onClear }) {
  function handleChange(key, value) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className={styles.filters}>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Tipo de viaje</label>
        <select
          className={styles.filterSelect}
          value={filters.type || ''}
          onChange={(e) => handleChange('type', e.target.value)}
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Región</label>
        <select
          className={styles.filterSelect}
          value={filters.region || ''}
          onChange={(e) => handleChange('region', e.target.value)}
        >
          {REGION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Precio máximo (USD)</label>
        <input
          type="number"
          className={styles.filterInput}
          placeholder="Sin límite"
          value={filters.maxPrice || ''}
          onChange={(e) => handleChange('maxPrice', e.target.value)}
          min="0"
          step="100"
        />
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Ordenar por</label>
        <select
          className={styles.filterSelect}
          value={filters.sort || ''}
          onChange={(e) => handleChange('sort', e.target.value)}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <button className={styles.clearBtn} onClick={onClear}>
        ✕ Limpiar
      </button>
    </div>
  );
}

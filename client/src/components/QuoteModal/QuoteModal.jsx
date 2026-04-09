import { useEffect } from 'react';
import { useForm } from '../../hooks/useForm';
import { submitQuote } from '../../services/contactService';
import styles from './QuoteModal.module.css';

export default function QuoteModal({ pkg, onClose }) {
  const { values, errors, submitting, submitted, submitError, handleChange, handleSubmit } =
    useForm(
      { name: '', email: '', phone: '', travelers: '2', notes: '' },
      (data) => submitQuote({ ...data, packageId: pkg.id })
    );

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Solicitar cotización">
        <div className={styles.header}>
          <h2 className={styles.title}>Solicitar Cotización</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        <div className={styles.body}>
          <div className={styles.packageInfo}>
            <div>
              <div className={styles.packageInfoTitle}>{pkg.title}</div>
              <div className={styles.packageInfoPrice}>
                Desde ${pkg.price.toLocaleString()} USD · {pkg.duration}
              </div>
            </div>
          </div>

          {submitted ? (
            <div className={styles.successMsg}>
              <div className={styles.successIcon}>✅</div>
              <h3 className={styles.successTitle}>¡Cotización enviada!</h3>
              <p className={styles.successText}>
                Nuestro equipo te contactará en las próximas 24 horas con los detalles de tu viaje.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {submitError && <div className={styles.errorMsg}>{submitError}</div>}

              <div className="form-group">
                <label className="form-label" htmlFor="quote-name">Nombre completo *</label>
                <input
                  id="quote-name"
                  name="name"
                  type="text"
                  className="form-input"
                  value={values.name}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                />
                {errors.name && <small style={{ color: 'var(--color-error)' }}>{errors.name}</small>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="quote-email">Email *</label>
                <input
                  id="quote-email"
                  name="email"
                  type="email"
                  className="form-input"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                />
                {errors.email && <small style={{ color: 'var(--color-error)' }}>{errors.email}</small>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="quote-phone">Teléfono</label>
                <input
                  id="quote-phone"
                  name="phone"
                  type="tel"
                  className="form-input"
                  value={values.phone}
                  onChange={handleChange}
                  placeholder="+52 (55) 1234-5678"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="quote-travelers">Viajeros</label>
                <select
                  id="quote-travelers"
                  name="travelers"
                  className="form-select"
                  value={values.travelers}
                  onChange={handleChange}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? 'persona' : 'personas'}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="quote-notes">Notas adicionales</label>
                <textarea
                  id="quote-notes"
                  name="notes"
                  className="form-textarea"
                  value={values.notes}
                  onChange={handleChange}
                  placeholder="Fechas preferidas, requerimientos especiales..."
                  rows="3"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={submitting}>
                {submitting ? 'Enviando...' : 'Solicitar Cotización'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

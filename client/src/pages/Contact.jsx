import { useForm } from '../hooks/useForm';
import { useSEO } from '../hooks/useSEO';
import { submitContact } from '../services/contactService';
import styles from './Contact.module.css';

export default function Contact() {
  useSEO({
    title: 'Contacto – Cotiza tu Viaje',
    description: 'Contáctanos en Sianna Travel, Tulancingo. Llámanos al 775-265-8513 o escríbenos por WhatsApp. Cotizamos tu paquete de viaje sin costo.',
    url: '/contacto',
  });

  const { values, errors, submitting, submitted, submitError, handleChange, handleSubmit, reset } =
    useForm({ name: '', email: '', phone: '', message: '' }, submitContact);

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.grid}>
          {/* Left - info */}
          <div className={styles.infoSection}>
            <h1>Hablemos de tu próximo viaje</h1>
            <p>
              Nuestro equipo de expertos en viajes está listo para ayudarte a planificar unas vacaciones 
              inolvidables. Contáctanos y recibe asesoría personalizada sin compromiso.
            </p>

            <div className={styles.contactMethods}>
              <div className={styles.contactMethod}>
                <div className={styles.contactIcon}>📧</div>
                <div>
                  <div className={styles.contactLabel}>Email</div>
                  <div className={styles.contactValue}>info@siannatravel.com</div>
                </div>
              </div>
              <div className={styles.contactMethod}>
                <div className={styles.contactIcon}>📞</div>
                <div>
                  <div className={styles.contactLabel}>Teléfono</div>
                  <div className={styles.contactValue}>+52 775 265 8513</div>
                </div>
              </div>
              <div className={styles.contactMethod}>
                <div className={styles.contactIconWa}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <div className={styles.contactLabel}>WhatsApp</div>
                  <a href="https://wa.me/527753718942" target="_blank" rel="noopener noreferrer" className={styles.contactValueLink}>
                    +52 775 371 8942
                  </a>
                </div>
              </div>
              <div className={styles.contactMethod}>
                <div className={styles.contactIcon}>📍</div>
                <div>
                  <div className={styles.contactLabel}>Oficina</div>
                  <div className={styles.contactValue}>Tulancingo de Bravo, Hidalgo</div>
                </div>
              </div>
              <div className={styles.contactMethod}>
                <div className={styles.contactIcon}>⏰</div>
                <div>
                  <div className={styles.contactLabel}>Horario</div>
                  <div className={styles.contactValue}>Lun - Vie: 9:00 - 18:00</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - form */}
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Envíanos un mensaje</h2>

            {submitted ? (
              <div className={styles.successCard}>
                <div className={styles.successIcon}>✅</div>
                <h3 className={styles.successTitle}>¡Mensaje enviado!</h3>
                <p className={styles.successText}>
                  Gracias por contactarnos. Te responderemos en las próximas 24 horas.
                </p>
                <button className="btn btn-outline" style={{ marginTop: '1.5rem' }} onClick={reset}>
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {submitError && <div className={styles.errorMsg}>{submitError}</div>}

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">Nombre completo *</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    className="form-input"
                    value={values.name}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                  />
                  {errors.name && <small style={{ color: 'var(--color-error)' }}>{errors.name}</small>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-email">Email *</label>
                  <input
                    id="contact-email"
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
                  <label className="form-label" htmlFor="contact-phone">Teléfono</label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    className="form-input"
                    value={values.phone}
                    onChange={handleChange}
                    placeholder="+52 (55) 1234-5678"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-message">Mensaje *</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    className="form-textarea"
                    value={values.message}
                    onChange={handleChange}
                    placeholder="Cuéntanos sobre el viaje que tienes en mente..."
                    rows="5"
                  />
                  {errors.message && <small style={{ color: 'var(--color-error)' }}>{errors.message}</small>}
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={submitting}>
                  {submitting ? 'Enviando...' : 'Enviar Mensaje'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Banner inferior con imagen de viaje */}
      <div className={styles.heroBanner}>
        <div className={styles.bannerBg} />
        <div className={styles.bannerOverlay} />
        <div className={styles.bannerContent}>
          <span className={styles.bannerTag}>Sianna Travel • Tulancingo, Hidalgo</span>
          <h2 className={styles.bannerTitle}>Tu aventura comienza aquí</h2>
          <p className={styles.bannerSub}>Desde el corazón de Hidalgo hacia cualquier rincón del mundo</p>
          <a
            href="https://wa.me/527753718942?text=Hola%2C%20quiero%20info%20sobre%20sus%20paquetes"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.bannerBtn}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Escríbenos ahora
          </a>
        </div>
      </div>
    </div>
  );
}

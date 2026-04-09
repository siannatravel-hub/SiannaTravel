import styles from './StaticPage.module.css';

export default function Terms() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Términos y Condiciones</h1>
        <p className={styles.heroSubtitle}>Última actualización: Marzo 2026</p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Aceptación de los Términos</h2>
          <p className={styles.text}>
            Al acceder y utilizar los servicios de Sianna Travel, usted acepta estar sujeto 
            a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos 
            términos, no podrá acceder al servicio.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Reservaciones</h2>
          <p className={styles.text}>
            <strong>2.1 Proceso de Reserva:</strong> Las reservaciones se consideran confirmadas 
            una vez que se reciba el pago del anticipo correspondiente y se emita la confirmación 
            por escrito por parte de Sianna Travel.
          </p>
          <p className={styles.text}>
            <strong>2.2 Anticipos:</strong> Se requiere un anticipo mínimo del 50% del valor total 
            del paquete para confirmar la reservación. El saldo restante deberá liquidarse al menos 
            15 días antes de la fecha de salida.
          </p>
          <p className={styles.text}>
            <strong>2.3 Documentación:</strong> Es responsabilidad del cliente contar con la 
            documentación vigente necesaria para viajar (pasaporte, visas, vacunas, etc.).
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Precios y Pagos</h2>
          <p className={styles.text}>
            <strong>3.1 Cotizaciones:</strong> Los precios publicados están sujetos a disponibilidad 
            y pueden variar sin previo aviso hasta el momento de la confirmación.
          </p>
          <p className={styles.text}>
            <strong>3.2 Moneda:</strong> Todos los precios están expresados en dólares estadounidenses (USD) 
            a menos que se indique lo contrario.
          </p>
          <p className={styles.text}>
            <strong>3.3 Formas de Pago:</strong> Aceptamos efectivo, transferencias bancarias, 
            tarjetas de crédito y débito. Algunos pagos con tarjeta pueden generar cargos adicionales.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Política de Cancelación</h2>
          <p className={styles.text}>
            <strong>4.1 Cancelación por el Cliente:</strong>
          </p>
          <ul className={styles.list}>
            <li>Más de 30 días antes: Reembolso del 100% del anticipo</li>
            <li>Entre 29 y 15 días: Penalidad del 50% del anticipo</li>
            <li>Menos de 15 días: No reembolsable</li>
            <li>No presentación (No Show): No reembolsable</li>
          </ul>
          <p className={styles.text}>
            <strong>4.2 Cancelación por Sianna Travel:</strong> En caso de cancelación por parte 
            de la agencia debido a fuerza mayor o circunstancias extraordinarias, se ofrecerá 
            reprogramación o reembolso total.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Cambios y Modificaciones</h2>
          <p className={styles.text}>
            Cualquier cambio en las reservaciones está sujeto a disponibilidad y puede generar 
            cargos adicionales. Las solicitudes de cambio deben realizarse con al menos 7 días 
            de anticipación.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Responsabilidades</h2>
          <p className={styles.text}>
            <strong>6.1 Sianna Travel actúa como intermediario</strong> entre el cliente y los 
            proveedores de servicios (aerolíneas, hoteles, transportistas). No somos responsables 
            directos por las acciones u omisiones de dichos proveedores.
          </p>
          <p className={styles.text}>
            <strong>6.2 Seguro de Viaje:</strong> Recomendamos encarecidamente la contratación 
            de un seguro de viaje que cubra cancelaciones, gastos médicos y equipaje.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>7. Quejas y Reclamaciones</h2>
          <p className={styles.text}>
            Cualquier queja o reclamación debe presentarse por escrito dentro de los 30 días 
            siguientes a la finalización del viaje. Las reclamaciones se procesarán en un 
            plazo máximo de 15 días hábiles.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>8. Legislación Aplicable</h2>
          <p className={styles.text}>
            Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier 
            controversia será sometida a los tribunales competentes de la Ciudad de México.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>9. Contacto</h2>
          <p className={styles.text}>
            Para cualquier consulta sobre estos términos, contáctenos en:
          </p>
          <ul className={styles.list}>
            <li>Email: legal@siannatravel.com</li>
            <li>Teléfono: +52 (55) 1234-5678</li>
            <li>Dirección: Ciudad de México, México</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

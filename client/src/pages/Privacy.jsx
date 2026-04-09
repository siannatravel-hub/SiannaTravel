import styles from './StaticPage.module.css';

export default function Privacy() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Política de Privacidad</h1>
        <p className={styles.heroSubtitle}>Última actualización: Marzo 2026</p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Información que Recopilamos</h2>
          <p className={styles.text}>
            En Sianna Travel, recopilamos información que usted nos proporciona directamente 
            al utilizar nuestros servicios:
          </p>
          <ul className={styles.list}>
            <li><strong>Datos personales:</strong> Nombre completo, fecha de nacimiento, nacionalidad</li>
            <li><strong>Datos de contacto:</strong> Correo electrónico, número telefónico, dirección</li>
            <li><strong>Datos de viaje:</strong> Pasaporte, preferencias de viaje, historial de reservaciones</li>
            <li><strong>Datos de pago:</strong> Información de tarjetas (procesada de forma segura)</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Uso de la Información</h2>
          <p className={styles.text}>
            Utilizamos su información personal para:
          </p>
          <ul className={styles.list}>
            <li>Procesar y gestionar sus reservaciones de viaje</li>
            <li>Comunicarnos con usted sobre su viaje</li>
            <li>Enviar confirmaciones, recordatorios e itinerarios</li>
            <li>Mejorar nuestros servicios y experiencia del cliente</li>
            <li>Enviar ofertas y promociones (con su consentimiento)</li>
            <li>Cumplir con obligaciones legales</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Compartir Información</h2>
          <p className={styles.text}>
            Compartimos su información únicamente con:
          </p>
          <ul className={styles.list}>
            <li><strong>Proveedores de servicios:</strong> Aerolíneas, hoteles, transportistas 
            y otros proveedores necesarios para su viaje</li>
            <li><strong>Procesadores de pago:</strong> Para gestionar transacciones de forma segura</li>
            <li><strong>Autoridades:</strong> Cuando sea requerido por ley o para cumplir 
            con regulaciones migratorias</li>
          </ul>
          <p className={styles.text}>
            <strong>No vendemos ni alquilamos su información personal a terceros.</strong>
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Protección de Datos</h2>
          <p className={styles.text}>
            Implementamos medidas de seguridad técnicas y organizativas para proteger 
            su información personal:
          </p>
          <ul className={styles.list}>
            <li>Cifrado SSL en todas las transmisiones de datos</li>
            <li>Acceso restringido a información personal</li>
            <li>Almacenamiento seguro en servidores protegidos</li>
            <li>Auditorías regulares de seguridad</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Sus Derechos</h2>
          <p className={styles.text}>
            De acuerdo con la Ley Federal de Protección de Datos Personales, usted tiene derecho a:
          </p>
          <ul className={styles.list}>
            <li><strong>Acceso:</strong> Conocer qué datos personales tenemos sobre usted</li>
            <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
            <li><strong>Cancelación:</strong> Solicitar la eliminación de sus datos</li>
            <li><strong>Oposición:</strong> Oponerse al uso de sus datos para fines específicos</li>
          </ul>
          <p className={styles.text}>
            Para ejercer estos derechos, envíe un correo a: privacidad@siannatravel.com
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Cookies</h2>
          <p className={styles.text}>
            Nuestro sitio web utiliza cookies para:
          </p>
          <ul className={styles.list}>
            <li>Recordar sus preferencias de navegación</li>
            <li>Analizar el tráfico del sitio</li>
            <li>Mejorar la funcionalidad del sitio</li>
          </ul>
          <p className={styles.text}>
            Puede configurar su navegador para rechazar cookies, aunque esto podría 
            afectar la funcionalidad del sitio.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>7. Retención de Datos</h2>
          <p className={styles.text}>
            Conservamos su información personal durante el tiempo necesario para:
          </p>
          <ul className={styles.list}>
            <li>Cumplir con los fines para los que fue recopilada</li>
            <li>Cumplir con obligaciones legales y fiscales (generalmente 5 años)</li>
            <li>Resolver disputas y hacer cumplir nuestros acuerdos</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>8. Menores de Edad</h2>
          <p className={styles.text}>
            No recopilamos intencionalmente información de menores de 18 años sin el 
            consentimiento de sus padres o tutores legales. Los datos de menores que 
            viajan se recopilan únicamente con autorización del adulto responsable.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>9. Cambios a esta Política</h2>
          <p className={styles.text}>
            Nos reservamos el derecho de modificar esta política de privacidad. 
            Cualquier cambio será publicado en esta página con la fecha de actualización. 
            Le recomendamos revisar esta política periódicamente.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>10. Contacto</h2>
          <p className={styles.text}>
            Si tiene preguntas sobre esta política de privacidad, contáctenos:
          </p>
          <ul className={styles.list}>
            <li>Email: privacidad@siannatravel.com</li>
            <li>Teléfono: +52 (55) 1234-5678</li>
            <li>Dirección: Ciudad de México, México</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

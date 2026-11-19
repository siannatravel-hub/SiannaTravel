import { useEffect } from 'react';
import { hace, linkChatwoot, linkWhatsApp, nombreAsesora, parseHistorial } from '../../lib/adminStats';
import styles from './LeadDetalle.module.css';

// Panel con todo lo que sabe el CRM de un lead: datos, lo que pide y la conversación con el bot.
export default function LeadDetalle({ lead, onClose }) {
  useEffect(() => {
    const alTeclear = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', alTeclear);
    return () => document.removeEventListener('keydown', alTeclear);
  }, [onClose]);

  if (!lead) return null;
  const canal = /^fb_/i.test(lead.numero_whatsapp || '') ? 'Messenger' : /^ig_/i.test(lead.numero_whatsapp || '') ? 'Instagram' : 'WhatsApp';
  const nombre = lead.nombre_cliente?.trim() || `Cliente de ${canal}`;
  const mensajes = parseHistorial(lead.historial);
  const wa = canal === 'WhatsApp' ? linkWhatsApp(lead.numero_whatsapp) : null;
  const chatwoot = linkChatwoot(lead);
  // Messenger no pasa por Chatwoot: la asesora contesta desde la bandeja de Meta Business Suite.
  const messenger = canal === 'Messenger' ? 'https://business.facebook.com/latest/inbox/messenger' : null;

  const datos = [
    ['Canal', canal],
    ['Teléfono', canal === 'WhatsApp' ? lead.numero_whatsapp : null],
    ['Correo', lead.correo],
    ['Asesora', lead.asesor ? nombreAsesora(lead.asesor) : null],
    ['Estado', lead.estado],
    ['Prioridad', lead.prioridad],
    ['Servicio', lead.tipo_servicio],
    ['Último contacto', lead.fecha_hora ? hace(lead.fecha_hora) : null],
  ].filter(([, v]) => v);

  return (
    <div className={styles.fondo} onClick={onClose} role="presentation">
      <aside className={styles.panel} role="dialog" aria-modal="true" aria-label={`Conversación con ${nombre}`}
        onClick={(e) => e.stopPropagation()}>
        <header className={styles.cabeza}>
          <div>
            <h2 className={styles.nombre}>{nombre}</h2>
            {lead.intencion_compra && <span className={styles.estrella}>★ Quiere comprar</span>}
            {lead.bot_pausado && <span className={styles.pausa}>Bot en pausa</span>}
          </div>
          <button className={styles.cerrar} onClick={onClose} aria-label="Cerrar">✕</button>
        </header>

        <dl className={styles.datos}>
          {datos.map(([k, v]) => (<div key={k}><dt>{k}</dt><dd>{v}</dd></div>))}
        </dl>

        {lead.resumen && (
          <section className={styles.resumen}>
            <h3 className={styles.titulo}>Resumen para ti</h3>
            <p className={styles.texto}>{lead.resumen}</p>
          </section>
        )}

        {lead.descripcion && (
          <section>
            <h3 className={styles.titulo}>Lo que busca</h3>
            <p className={styles.texto}>{lead.descripcion}</p>
          </section>
        )}

        <section className={styles.chatBloque}>
          <h3 className={styles.titulo}>Conversación con el bot</h3>
          {mensajes.length > 0 ? (
            <ol className={styles.chat}>
              {mensajes.map((m, i) => (
                <li key={i} className={`${styles.burbuja} ${m.rol === 'cliente' ? styles.cliente : styles.bot}`}>
                  <span className={styles.quien}>{m.rol === 'cliente' ? nombre : m.rol === 'bot' ? 'Bot' : 'Asesora'}</span>
                  {m.texto}
                </li>
              ))}
            </ol>
          ) : (
            <p className={styles.vacio}>
              Aún no hay conversación guardada.{lead.ultimo_mensaje ? ' Lo último que escribió el cliente:' : ''}
              {lead.ultimo_mensaje && <q className={styles.cita}>{lead.ultimo_mensaje}</q>}
            </p>
          )}
        </section>

        {(wa || chatwoot || messenger) && (
          <footer className={styles.pie}>
            {wa && <a className={styles.wa} href={wa} target="_blank" rel="noopener noreferrer">Abrir WhatsApp</a>}
            {messenger && <a className={styles.wa} href={messenger} target="_blank" rel="noopener noreferrer">Abrir Messenger</a>}
            {chatwoot && <a className={styles.cw} href={chatwoot} target="_blank" rel="noopener noreferrer">Ver chat completo</a>}
          </footer>
        )}
      </aside>
    </div>
  );
}

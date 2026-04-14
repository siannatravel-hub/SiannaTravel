import { useState, useEffect } from 'react';
import styles from './WhatsAppWidget.module.css';

const WHATSAPP_NUMBER = '527753718942';

const QUICK_MESSAGES = [
  'Hola, me interesa conocer sus paquetes de viaje',
  'Quiero cotizar un viaje personalizado',
  'Necesito información sobre disponibilidad',
  'Me gustaría hablar con un asesor',
];

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  function handleSend() {
    const text = message.trim() || QUICK_MESSAGES[0];
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setMessage('');
    setOpen(false);
  }

  function handleQuickMessage(msg) {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setOpen(false);
  }

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className={styles.chatPanel}>
          <div className={styles.chatHeader}>
            <div className={styles.chatHeaderInfo}>
              <div className={styles.chatAvatar}>
                <img src="/images/logos/logosianna.png" alt="Sianna Travel" />
              </div>
              <div>
                <div className={styles.chatName}>Sianna Travel</div>
                <div className={styles.chatStatus}>
                  <span className={styles.statusDot}></span> En línea
                </div>
              </div>
            </div>
            <button className={styles.chatClose} onClick={() => setOpen(false)}>
              ×
            </button>
          </div>

          <div className={styles.chatBody}>
            {/* Welcome bubble */}
            <div className={styles.bubble}>
              <p className={styles.bubbleText}>
                ¡Hola! 👋 Bienvenido a <strong>Sianna Travel</strong>. ¿En qué podemos ayudarte hoy?
              </p>
              <span className={styles.bubbleTime}>Ahora</span>
            </div>

            {/* Quick replies */}
            <div className={styles.quickReplies}>
              {QUICK_MESSAGES.map((msg, i) => (
                <button
                  key={i}
                  className={styles.quickBtn}
                  onClick={() => handleQuickMessage(msg)}
                >
                  {msg}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className={styles.chatInput}>
            <input
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Escribe tu mensaje..."
              className={styles.input}
            />
            <button className={styles.sendBtn} onClick={handleSend}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        className={`${styles.fab} ${open ? styles.fabSend : ''}`}
        onClick={open ? handleSend : () => setOpen(true)}
        aria-label={open ? 'Enviar mensaje por WhatsApp' : 'Chatea con nosotros por WhatsApp'}
      >
        {open ? (
          <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        )}
        {!open && <span className={styles.fabPulse}></span>}
      </button>

      {/* Tooltip */}
      {!open && showTooltip && (
        <div className={styles.tooltip} onClick={() => setShowTooltip(false)}>
          <span>Chatea con nosotros</span>
          <button className={styles.tooltipClose} onClick={e => { e.stopPropagation(); setShowTooltip(false); }}>×</button>
        </div>
      )}
    </>
  );
}

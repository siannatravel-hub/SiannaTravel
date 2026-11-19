// Cifras y utilidades del panel admin. Funciones puras: se calculan en el navegador
// a partir de las solicitudes (leads) que ya devuelve la API.

const TZ = 'America/Mexico_City';

export const normalizar = (s) =>
  String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');

// n8n escribe 'EscaladoHumano'; el panel ofrece 'Escalado'. Ambos cuentan como escalados.
export const esEscalado = (estado) => normalizar(estado).startsWith('escalado');

// Un lead está pendiente mientras nadie lo marque como Atendido o Cerrado.
export const estaPendiente = (estado) => {
  const e = normalizar(estado);
  return e === '' || e === 'nuevo' || e.startsWith('escalado');
};

const dia = (f) => new Date(f).toLocaleDateString('en-CA', { timeZone: TZ }); // AAAA-MM-DD

export function resumenLeads(items, ahora = new Date()) {
  const hoy = dia(ahora);
  const mes = hoy.slice(0, 7);
  const r = { total: items.length, hoy: 0, delMes: 0, pendientes: 0, listosParaCerrar: 0 };
  for (const it of items) {
    const d = it.fecha_hora ? dia(it.fecha_hora) : null;
    if (d === hoy) r.hoy += 1;
    if (d && d.startsWith(mes)) r.delMes += 1;
    const pendiente = estaPendiente(it.estado);
    if (pendiente) r.pendientes += 1;
    if (pendiente && it.intencion_compra) r.listosParaCerrar += 1;
  }
  return r;
}

// Leads por asesora (sin importar acentos ni mayúsculas), con los pendientes de cada una.
export function porAsesora(items) {
  const grupos = new Map();
  for (const it of items) {
    const clave = normalizar(it.asesor) || '_sin';
    if (!grupos.has(clave)) {
      grupos.set(clave, { clave, nombre: String(it.asesor || '').trim() || 'Sin asignar', total: 0, pendientes: 0 });
    }
    const g = grupos.get(clave);
    g.total += 1;
    if (estaPendiente(it.estado)) g.pendientes += 1;
  }
  return [...grupos.values()].sort((a, b) => b.pendientes - a.pendientes || b.total - a.total);
}

export const recientes = (items, n = 6) =>
  [...items].sort((a, b) => new Date(b.fecha_hora || 0) - new Date(a.fecha_hora || 0)).slice(0, n);

export function saludo(ahora = new Date()) {
  const h = Number(ahora.toLocaleString('en-US', { hour: 'numeric', hour12: false, timeZone: TZ }));
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export function hace(fecha, ahora = new Date()) {
  if (!fecha) return '—';
  const min = Math.round((ahora - new Date(fecha)) / 60000);
  if (min < 1) return 'ahora';
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? 'ayer' : `hace ${d} días`;
}

// Solo los contactos de WhatsApp tienen número real; los de Messenger/Instagram son 'fb_…'/'ig_…'.
export function linkWhatsApp(numero) {
  const digitos = String(numero || '').replace(/\D/g, '');
  if (!/^\d{10,15}$/.test(digitos) || /^(fb|ig)_/i.test(String(numero || ''))) return null;
  return `https://wa.me/${digitos}`;
}

// El <select> de estado debe incluir el valor actual aunque no esté en la lista fija.
export const opcionesEstado = (base, actual) =>
  actual && !base.includes(actual) ? [...base, actual] : base;

// Leads recibidos por día en los últimos N días (el último elemento es hoy).
export function leadsPorDia(items, dias = 7, ahora = new Date()) {
  const out = [];
  for (let i = dias - 1; i >= 0; i -= 1) {
    const d = new Date(ahora.getTime() - i * 86400000);
    out.push({
      dia: dia(d),
      etiqueta: d.toLocaleDateString('es-MX', { weekday: 'short', timeZone: TZ }).replace('.', ''),
      total: 0,
    });
  }
  const porDia = new Map(out.map((o) => [o.dia, o]));
  for (const it of items) {
    if (!it.fecha_hora) continue;
    const o = porDia.get(dia(it.fecha_hora));
    if (o) o.total += 1;
  }
  return out;
}

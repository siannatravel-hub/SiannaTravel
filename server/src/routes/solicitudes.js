import { crudRouter } from '../crud.js';

// Admin CRUD de solicitudes de mensaje / leads.
export const adminSolicitudesRouter = crudRouter({
  table: 'solicitudes',
  allowed: ['numero_whatsapp', 'nombre_cliente', 'correo', 'origen', 'numero_negocio',
    'tipo_servicio', 'descripcion', 'estado', 'prioridad', 'asesor', 'ultimo_mensaje',
    'seguimiento_enviado', 'bot_pausado', 'fecha_pausa_bot', 'intencion_compra', 'fecha_hora'],
  orderBy: 'fecha_hora DESC NULLS LAST, id DESC',
});

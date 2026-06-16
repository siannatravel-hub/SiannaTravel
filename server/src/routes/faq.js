import { crudRouter } from '../crud.js';

// Admin CRUD de la FAQ del bot.
export const adminFaqRouter = crudRouter({
  table: 'faq',
  allowed: ['categoria', 'pregunta', 'respuesta', 'activo', 'orden'],
  orderBy: 'orden ASC, id ASC',
});

import { apiGet, apiPut, apiDelete } from './apiClient';

export async function getSolicitudes() {
  try {
    const { data } = await apiGet('/admin/solicitudes');
    return data || [];
  } catch (e) {
    console.warn('Error fetching solicitudes:', e.message);
    return [];
  }
}

export async function updateSolicitud(id, updates) {
  const { data } = await apiPut(`/admin/solicitudes/${id}`, updates);
  return data;
}

export async function deleteSolicitud(id) {
  await apiDelete(`/admin/solicitudes/${id}`);
  return true;
}

export async function getUnreadCount() {
  try {
    const res = await apiGet('/admin/solicitudes/unread-count');
    return res.count ?? 0;
  } catch {
    return 0;
  }
}

export async function markSolicitudesRead() {
  try {
    await apiPut('/admin/solicitudes/mark-read', {});
  } catch { /* silent */ }
}

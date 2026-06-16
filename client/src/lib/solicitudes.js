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

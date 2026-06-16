import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';

export async function getLinks() {
  try {
    const { data } = await apiGet('/admin/links');
    return data || [];
  } catch (e) {
    console.warn('Error fetching links:', e.message);
    return [];
  }
}

export async function createLink(d) {
  const { data } = await apiPost('/admin/links', d);
  return data;
}

export async function updateLink(id, updates) {
  const { data } = await apiPut(`/admin/links/${id}`, updates);
  return data;
}

export async function deleteLink(id) {
  await apiDelete(`/admin/links/${id}`);
  return true;
}

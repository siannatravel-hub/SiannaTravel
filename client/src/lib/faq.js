import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';

export async function getFaqs() {
  try {
    const { data } = await apiGet('/admin/faq');
    return data || [];
  } catch (e) {
    console.warn('Error fetching faq:', e.message);
    return [];
  }
}

export async function createFaq(d) {
  const { data } = await apiPost('/admin/faq', d);
  return data;
}

export async function updateFaq(id, updates) {
  const { data } = await apiPut(`/admin/faq/${id}`, updates);
  return data;
}

export async function deleteFaq(id) {
  await apiDelete(`/admin/faq/${id}`);
  return true;
}

import { api } from './api';

export async function getPackages(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      params.append(key, value);
    }
  });
  const query = params.toString();
  return api.get(`/packages${query ? `?${query}` : ''}`);
}

export async function getPackageById(id) {
  return api.get(`/packages/${id}`);
}

export async function getFeaturedPackages() {
  return api.get('/packages/featured');
}

export async function getFilterOptions() {
  return api.get('/packages/filters');
}

import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';

export function generateSlug(title) {
  return (title || '')
    .toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ---- Lectura pública ----
export async function getBlogPosts() {
  try {
    const { data } = await apiGet('/blog');
    return data || [];
  } catch (e) {
    console.warn('Error fetching blog posts:', e.message);
    return [];
  }
}

export async function getBlogPostBySlug(slug) {
  try {
    const { data } = await apiGet(`/blog/${slug}`);
    return data || null;
  } catch (e) {
    console.warn('Error fetching blog post:', e.message);
    return null;
  }
}

// ---- Admin ----
export async function getAllBlogPosts() {
  try {
    const { data } = await apiGet('/admin/blog');
    return data || [];
  } catch (e) {
    console.warn('Error fetching all blog posts:', e.message);
    return [];
  }
}

export async function createBlogPost(postData) {
  const slug = postData.slug || generateSlug(postData.title);
  const { data } = await apiPost('/admin/blog', { ...postData, slug });
  return data || null;
}

export async function updateBlogPost(id, updates) {
  if (updates.title && !updates.slug) updates.slug = generateSlug(updates.title);
  const { data } = await apiPut(`/admin/blog/${id}`, updates);
  return data || null;
}

export async function deleteBlogPost(id) {
  await apiDelete(`/admin/blog/${id}`);
  return true;
}

export function toggleBlogPostPublished(id, isPublished) {
  return updateBlogPost(id, {
    is_published: isPublished,
    published_at: isPublished ? new Date().toISOString() : null,
  });
}

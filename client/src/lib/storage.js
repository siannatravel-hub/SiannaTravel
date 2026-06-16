import { apiUpload } from './apiClient';

// Sube una imagen al backend (que la guarda en disco y la sirve en /images/uploads).
// Mantiene la misma firma que antes: devuelve { url, path }.
export async function uploadImage(file, folder = 'packages') {
  if (!file) throw new Error('No se proporcionó archivo');

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Tipo de archivo no permitido. Use JPG, PNG, WebP o GIF.');
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('El archivo es muy grande. Máximo 5MB.');
  }

  const form = new FormData();
  form.append('file', file);
  form.append('folder', folder);
  const { url, path } = await apiUpload('/admin/upload', form);
  return { url, path };
}

// Compatibilidad: el borrado físico lo gestiona el servidor; aquí es no-op.
export async function deleteImage() { /* no-op */ }

export async function replaceImage(newFile, _oldPath, folder = 'packages') {
  return uploadImage(newFile, folder);
}

// Verifica si una URL apunta a una imagen subida por el admin.
export function isStorageUrl(url) {
  return !!url && (url.includes('/images/uploads') || url.includes('supabase'));
}

import { supabase } from './supabase';

const BUCKET_NAME = 'package-images';

/**
 * Sube una imagen a Supabase Storage
 * @param {File} file - Archivo de imagen a subir
 * @param {string} folder - Carpeta dentro del bucket (ej: 'packages', 'featured')
 * @returns {Promise<{url: string, path: string}>}
 */
export async function uploadImage(file, folder = 'packages') {
  if (!file) throw new Error('No se proporcionó archivo');
  
  // Validar tipo de archivo
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Tipo de archivo no permitido. Use JPG, PNG, WebP o GIF.');
  }
  
  // Validar tamaño (máximo 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('El archivo es muy grande. Máximo 5MB.');
  }
  
  // Generar nombre único
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  const extension = file.name.split('.').pop().toLowerCase();
  const fileName = `${folder}/${timestamp}-${randomId}.${extension}`;
  
  // Subir archivo
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) {
    console.error('Error uploading:', error);
    throw new Error('Error al subir la imagen: ' + error.message);
  }
  
  // Obtener URL pública
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);
  
  return {
    url: urlData.publicUrl,
    path: data.path
  };
}

/**
 * Elimina una imagen de Supabase Storage
 * @param {string} path - Ruta del archivo (ej: 'packages/123-abc.jpg')
 */
export async function deleteImage(path) {
  if (!path) return;
  
  // Extraer solo el path relativo si viene la URL completa
  const relativePath = path.includes(BUCKET_NAME) 
    ? path.split(`${BUCKET_NAME}/`)[1]
    : path;
  
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([relativePath]);
  
  if (error) {
    console.error('Error deleting image:', error);
    throw new Error('Error al eliminar la imagen');
  }
}

/**
 * Reemplaza una imagen existente
 * @param {File} newFile - Nuevo archivo
 * @param {string} oldPath - Ruta de la imagen anterior (opcional)
 * @param {string} folder - Carpeta destino
 */
export async function replaceImage(newFile, oldPath, folder = 'packages') {
  // Subir nueva imagen
  const result = await uploadImage(newFile, folder);
  
  // Intentar eliminar la anterior si existe y es del storage
  if (oldPath && oldPath.includes(BUCKET_NAME)) {
    try {
      await deleteImage(oldPath);
    } catch (e) {
      console.warn('No se pudo eliminar imagen anterior:', e);
    }
  }
  
  return result;
}

/**
 * Verifica si una URL es del storage de Supabase
 */
export function isStorageUrl(url) {
  return url && url.includes('supabase') && url.includes(BUCKET_NAME);
}

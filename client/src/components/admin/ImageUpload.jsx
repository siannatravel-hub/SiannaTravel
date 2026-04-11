import { useState, useRef } from 'react';
import { uploadImage, replaceImage } from '../../lib/storage';
import { isSupabaseConfigured } from '../../lib/supabase';
import styles from './ImageUpload.module.css';

export default function ImageUpload({ 
  value, 
  onChange, 
  folder = 'packages',
  showUrlFallback = true 
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState(value || '');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleUpload(file);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await handleUpload(file);
    }
  };

  const handleUpload = async (file) => {
    if (!isSupabaseConfigured()) {
      setError('Sube la imagen a un host (ej: Imgur, Cloudinary) y pega la URL abajo.');
      setShowUrlInput(true);
      return;
    }
    setError(null);
    setUploading(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 100);

    try {
      const result = await replaceImage(file, value, folder);
      setProgress(100);
      onChange(result.url);
    } catch (err) {
      setError('Error al subir archivo. Usa la opción de URL.');
      setShowUrlInput(true);
    } finally {
      clearInterval(progressInterval);
      setUploading(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const handleRemove = () => {
    onChange('');
    setUrlInputValue('');
    setShowUrlInput(false);
  };

  const handleUrlApply = () => {
    if (urlInputValue.trim()) {
      onChange(urlInputValue.trim());
      setShowUrlInput(false);
      setError(null);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.uploadContainer}>
      {value ? (
        <div className={styles.previewContainer}>
          <img src={value} alt="Preview" className={styles.previewImage} />
          <div className={styles.previewOverlay}>
            <button 
              type="button"
              className={`${styles.overlayBtn} ${styles.changeBtn}`}
              onClick={openFileDialog}
            >
              📷 Subir archivo
            </button>
            <button 
              type="button"
              className={`${styles.overlayBtn} ${styles.urlBtn}`}
              onClick={() => { setUrlInputValue(value); setShowUrlInput(v => !v); }}
            >
              🔗 Cambiar URL
            </button>
            <button 
              type="button"
              className={`${styles.overlayBtn} ${styles.removeBtn}`}
              onClick={handleRemove}
            >
              🗑️ Quitar
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`${styles.dropZone} ${isDragging ? styles.dragOver : ''} ${uploading ? styles.uploading : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <span className={styles.uploadIcon}>📁</span>
          <p className={styles.uploadText}>
            Arrastra una imagen aquí o <strong>haz clic para seleccionar</strong>
          </p>
          <p className={styles.uploadHint}>
            JPG, PNG, WebP o GIF • Máximo 5MB
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className={styles.hiddenInput}
      />

      {uploading && (
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className={styles.progressText}>Subiendo imagen... {progress}%</p>
        </div>
      )}

      {error && (
        <div className={styles.errorMessage}>
          ⚠️ {error}
        </div>
      )}

      {/* URL input: siempre visible cuando no hay imagen, o cuando se activa el toggle */}
      {showUrlFallback && (!value || showUrlInput) && (
        <div className={styles.urlFallback}>
          <label className={styles.urlFallbackLabel}>
            {value ? 'Nueva URL de imagen:' : 'O pega una URL de imagen:'}
          </label>
          <div className={styles.urlInputRow}>
            <input
              type="url"
              value={urlInputValue}
              onChange={e => setUrlInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleUrlApply()}
              placeholder="https://images.unsplash.com/..."
              className={styles.urlInput}
            />
            <button
              type="button"
              className={styles.urlApplyBtn}
              onClick={handleUrlApply}
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useRef } from 'react';
import { uploadImage, replaceImage } from '../../lib/storage';
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
    setError(null);
    setUploading(true);
    setProgress(0);

    // Simular progreso
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 100);

    try {
      const result = await replaceImage(file, value, folder);
      setProgress(100);
      onChange(result.url);
    } catch (err) {
      setError(err.message);
    } finally {
      clearInterval(progressInterval);
      setUploading(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  const handleUrlChange = (e) => {
    setError(null);
    onChange(e.target.value);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.uploadContainer}>
      {value ? (
        // Preview de imagen existente
        <div className={styles.previewContainer}>
          <img src={value} alt="Preview" className={styles.previewImage} />
          <div className={styles.previewOverlay}>
            <button 
              type="button"
              className={`${styles.overlayBtn} ${styles.changeBtn}`}
              onClick={openFileDialog}
            >
              📷 Cambiar
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
        // Zona de drop
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

      {/* Barra de progreso */}
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

      {/* Mensaje de error */}
      {error && (
        <div className={styles.errorMessage}>
          ⚠️ {error}
        </div>
      )}

      {/* Input de URL como alternativa */}
      {showUrlFallback && !value && (
        <div className={styles.urlFallback}>
          <label className={styles.urlFallbackLabel}>
            O pega una URL de imagen:
          </label>
          <input
            type="url"
            value={value || ''}
            onChange={handleUrlChange}
            placeholder="https://..."
            className={styles.urlInput}
          />
        </div>
      )}
    </div>
  );
}

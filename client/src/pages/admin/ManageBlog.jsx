import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getAllBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  toggleBlogPostPublished,
} from '../../lib/blog';
import ImageUpload from '../../components/admin/ImageUpload';
import styles from './ManageBlog.module.css';

export default function ManageBlog() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [saving, setSaving] = useState(false);

  // Editor form state
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    cover_image: '',
    author: '',
    content: [], // array of blocks
  });

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      setLoading(true);
      const data = await getAllBlogPosts();
      setPosts(data);
    } catch (err) {
      console.error('Error loading blog posts:', err);
    } finally {
      setLoading(false);
    }
  }

  function openNewPost() {
    setEditingPost(null);
    setForm({
      title: '',
      excerpt: '',
      cover_image: '',
      author: user?.email || 'Sianna Travel',
      content: [{ type: 'text', value: '' }],
    });
    setShowEditor(true);
  }

  function openEditPost(post) {
    setEditingPost(post);
    let content;
    try {
      content = typeof post.content === 'string' ? JSON.parse(post.content) : post.content;
    } catch {
      content = [{ type: 'text', value: post.content || '' }];
    }
    setForm({
      title: post.title || '',
      excerpt: post.excerpt || '',
      cover_image: post.cover_image || '',
      author: post.author || '',
      content: Array.isArray(content) ? content : [{ type: 'text', value: '' }],
    });
    setShowEditor(true);
  }

  function closeEditor() {
    setShowEditor(false);
    setEditingPost(null);
  }

  // --- Content blocks ---
  function addBlock(type) {
    setForm(prev => ({
      ...prev,
      content: [...prev.content, { type, value: '', caption: '' }],
    }));
  }

  function updateBlock(index, field, value) {
    setForm(prev => {
      const content = [...prev.content];
      content[index] = { ...content[index], [field]: value };
      return { ...prev, content };
    });
  }

  function removeBlock(index) {
    setForm(prev => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index),
    }));
  }

  function moveBlock(index, direction) {
    setForm(prev => {
      const content = [...prev.content];
      const target = index + direction;
      if (target < 0 || target >= content.length) return prev;
      [content[index], content[target]] = [content[target], content[index]];
      return { ...prev, content };
    });
  }

  // --- Save ---
  async function handleSave() {
    if (!form.title.trim()) {
      alert('El título es obligatorio');
      return;
    }
    setSaving(true);
    try {
      const postData = {
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        cover_image: form.cover_image,
        author: form.author.trim() || 'Sianna Travel',
        content: JSON.stringify(form.content),
      };

      if (editingPost) {
        await updateBlogPost(editingPost.id, postData);
      } else {
        await createBlogPost(postData);
      }

      await loadPosts();
      closeEditor();
    } catch (err) {
      console.error('Error saving post:', err);
      alert('Error al guardar la publicación');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(post) {
    if (!window.confirm(`¿Eliminar "${post.title}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteBlogPost(post.id);
      await loadPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  }

  async function handleTogglePublish(post) {
    try {
      await toggleBlogPostPublished(post.id, !post.is_published);
      await loadPosts();
    } catch (err) {
      console.error('Error toggling publish:', err);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return 'Sin fecha';
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando publicaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.titleIcon}>📝</span>
          Gestión del Blog
        </h1>
        <div className={styles.headerActions}>
          <button className={styles.newBtn} onClick={openNewPost}>
            + Nueva Publicación
          </button>
          <Link to="/admin" className={styles.backBtn}>
            ← Dashboard
          </Link>
        </div>
      </div>

      {/* Posts list */}
      {posts.length === 0 ? (
        <div className={styles.emptyState}>
          <span>📝</span>
          <h3>No hay publicaciones</h3>
          <p>Crea tu primera publicación de blog</p>
          <button className={styles.newBtn} onClick={openNewPost}>
            + Nueva Publicación
          </button>
        </div>
      ) : (
        <div className={styles.postsList}>
          {posts.map(post => (
            <div key={post.id} className={styles.postRow}>
              <div className={styles.postThumb}>
                {post.cover_image ? (
                  <img src={post.cover_image} alt={post.title} />
                ) : (
                  <div className={styles.noThumb}>📝</div>
                )}
              </div>
              <div className={styles.postInfo}>
                <h3 className={styles.postTitle}>{post.title}</h3>
                <p className={styles.postMeta}>
                  {post.author || 'Sianna Travel'} · {formatDate(post.published_at || post.created_at)}
                </p>
              </div>
              <div className={styles.postStatus}>
                <span className={`${styles.badge} ${post.is_published ? styles.published : styles.draft}`}>
                  {post.is_published ? 'Publicado' : 'Borrador'}
                </span>
              </div>
              <div className={styles.postActions}>
                <button
                  className={styles.actionBtn}
                  onClick={() => openEditPost(post)}
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  className={styles.actionBtn}
                  onClick={() => handleTogglePublish(post)}
                  title={post.is_published ? 'Despublicar' : 'Publicar'}
                >
                  {post.is_published ? '🔴' : '🟢'}
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  onClick={() => handleDelete(post)}
                  title="Eliminar"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor modal */}
      {showEditor && (
        <div className={styles.editorOverlay} onClick={closeEditor}>
          <div className={styles.editor} onClick={e => e.stopPropagation()}>
            <div className={styles.editorHeader}>
              <h2>{editingPost ? 'Editar Publicación' : 'Nueva Publicación'}</h2>
              <button className={styles.closeBtn} onClick={closeEditor}>×</button>
            </div>

            <div className={styles.editorBody}>
              {/* Basic fields */}
              <div className={styles.fieldGroup}>
                <label>Título</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="Título de la publicación"
                  className={styles.input}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label>Extracto / Resumen</label>
                <textarea
                  value={form.excerpt}
                  onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))}
                  placeholder="Breve descripción que aparece en la lista del blog..."
                  className={styles.textarea}
                  rows={2}
                />
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label>Autor</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={e => setForm(p => ({ ...p, author: e.target.value }))}
                    placeholder="Sianna Travel"
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label>Imagen de Portada</label>
                <ImageUpload
                  value={form.cover_image}
                  onChange={url => setForm(p => ({ ...p, cover_image: url }))}
                  folder="blog"
                />
              </div>

              {/* Content blocks */}
              <div className={styles.blocksSection}>
                <label className={styles.blocksLabel}>Contenido</label>

                {form.content.map((block, idx) => (
                  <div key={idx} className={styles.block}>
                    <div className={styles.blockHeader}>
                      <span className={styles.blockType}>
                        {block.type === 'text' && '📄 Texto'}
                        {block.type === 'image' && '🖼️ Imagen'}
                        {block.type === 'video' && '🎬 Video'}
                      </span>
                      <div className={styles.blockControls}>
                        <button
                          type="button"
                          onClick={() => moveBlock(idx, -1)}
                          disabled={idx === 0}
                          className={styles.moveBtn}
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => moveBlock(idx, 1)}
                          disabled={idx === form.content.length - 1}
                          className={styles.moveBtn}
                        >
                          ▼
                        </button>
                        <button
                          type="button"
                          onClick={() => removeBlock(idx)}
                          className={styles.removeBtnSmall}
                        >
                          ×
                        </button>
                      </div>
                    </div>

                    {block.type === 'text' && (
                      <textarea
                        value={block.value}
                        onChange={e => updateBlock(idx, 'value', e.target.value)}
                        placeholder="Escribe tu contenido aquí... (soporta **negritas** y *cursivas*)"
                        className={styles.blockTextarea}
                        rows={5}
                      />
                    )}

                    {block.type === 'image' && (
                      <>
                        <ImageUpload
                          value={block.value}
                          onChange={url => updateBlock(idx, 'value', url)}
                          folder="blog"
                        />
                        <input
                          type="text"
                          value={block.caption || ''}
                          onChange={e => updateBlock(idx, 'caption', e.target.value)}
                          placeholder="Pie de foto (opcional)"
                          className={styles.captionInput}
                        />
                      </>
                    )}

                    {block.type === 'video' && (
                      <>
                        <input
                          type="url"
                          value={block.value}
                          onChange={e => updateBlock(idx, 'value', e.target.value)}
                          placeholder="URL del video (YouTube, Vimeo, etc.)"
                          className={styles.input}
                        />
                        <input
                          type="text"
                          value={block.caption || ''}
                          onChange={e => updateBlock(idx, 'caption', e.target.value)}
                          placeholder="Descripción del video (opcional)"
                          className={styles.captionInput}
                        />
                      </>
                    )}
                  </div>
                ))}

                <div className={styles.addBlockRow}>
                  <button
                    type="button"
                    className={styles.addBlockBtn}
                    onClick={() => addBlock('text')}
                  >
                    📄 Texto
                  </button>
                  <button
                    type="button"
                    className={styles.addBlockBtn}
                    onClick={() => addBlock('image')}
                  >
                    🖼️ Imagen
                  </button>
                  <button
                    type="button"
                    className={styles.addBlockBtn}
                    onClick={() => addBlock('video')}
                  >
                    🎬 Video
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.editorFooter}>
              <button className={styles.cancelBtn} onClick={closeEditor}>
                Cancelar
              </button>
              <button
                className={styles.saveBtn}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Guardando...' : editingPost ? 'Guardar Cambios' : 'Publicar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

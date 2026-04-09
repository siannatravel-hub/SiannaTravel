import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPosts } from '../lib/blog';
import { useSEO } from '../hooks/useSEO';
import styles from './Blog.module.css';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: 'Blog de Viajes – Guías, Consejos y Destinos',
    description: 'Artículos de viaje, guías de destinos, consejos para turistas y cultura mexicana. El blog de Sianna Travel desde Tulancingo, Hidalgo.',
    url: '/blog',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Blog Sianna Travel',
      url: 'https://siannatravel.com/blog',
      publisher: {
        '@type': 'Organization',
        name: 'Sianna Travel',
        url: 'https://siannatravel.com',
      },
    },
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getBlogPosts();
        setPosts(data);
      } catch (err) {
        console.error('Error loading blog:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.blogPage}>
      {/* Hero */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Blog de Viajes</h1>
        <p className={styles.heroSubtitle}>
          Historias, guías y consejos para inspirar tu próxima aventura
        </p>
      </section>

      {/* Posts grid */}
      <section className={styles.postsSection}>
        <div className={styles.postsGrid}>
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className={styles.postCard}
            >
              <div className={styles.postImage}>
                <img
                  src={post.cover_image}
                  alt={post.title}
                  loading="lazy"
                />
              </div>
              <div className={styles.postContent}>
                <time className={styles.postDate}>
                  {formatDate(post.published_at)}
                </time>
                <h2 className={styles.postTitle}>{post.title}</h2>
                <p className={styles.postExcerpt}>{post.excerpt}</p>
                <span className={styles.readMore}>Leer más →</span>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className={styles.empty}>
            <p>Aún no hay publicaciones. ¡Vuelve pronto!</p>
          </div>
        )}
      </section>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPostBySlug } from '../lib/blog';
import { useSEO } from '../hooks/useSEO';
import styles from './BlogPost.module.css';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useSEO(
    post
      ? {
          title: post.title,
          description: post.excerpt?.slice(0, 155) || post.title,
          url: `/blog/${post.slug}`,
          image: post.cover_image
            ? post.cover_image.startsWith('http')
              ? post.cover_image
              : `https://siannatravel.com${post.cover_image}`
            : undefined,
          type: 'article',
          schema: {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt || '',
            image: post.cover_image || '',
            datePublished: post.published_at || post.created_at || '',
            dateModified: post.updated_at || post.published_at || '',
            url: `https://siannatravel.com/blog/${post.slug}`,
            author: {
              '@type': 'Organization',
              name: 'Sianna Travel',
              url: 'https://siannatravel.com',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Sianna Travel',
              logo: {
                '@type': 'ImageObject',
                url: 'https://siannatravel.com/images/logos/logo.png',
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://siannatravel.com/blog/${post.slug}`,
            },
          },
        }
      : { title: 'Blog – Artículo', url: `/blog/${slug}` }
  );

  useEffect(() => {
    async function load() {
      try {
        const data = await getBlogPostBySlug(slug);
        setPost(data);
      } catch (err) {
        console.error('Error loading post:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  function parseContent(contentStr) {
    try {
      return typeof contentStr === 'string' ? JSON.parse(contentStr) : contentStr;
    } catch {
      return [{ type: 'text', value: contentStr }];
    }
  }

  function renderBlock(block, index) {
    switch (block.type) {
      case 'image':
        return (
          <figure key={index} className={styles.figure}>
            <img src={block.value} alt={block.caption || ''} loading="lazy" />
            {block.caption && <figcaption>{block.caption}</figcaption>}
          </figure>
        );

      case 'video':
        return (
          <div key={index} className={styles.videoWrap}>
            {block.value.includes('youtube.com') || block.value.includes('youtu.be') ? (
              <iframe
                src={toYouTubeEmbed(block.value)}
                title={block.caption || 'Video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video controls src={block.value} />
            )}
            {block.caption && <p className={styles.videoCaption}>{block.caption}</p>}
          </div>
        );

      case 'text':
      default:
        return (
          <div
            key={index}
            className={styles.textBlock}
            dangerouslySetInnerHTML={{ __html: simpleMarkdown(block.value) }}
          />
        );
    }
  }

  function toYouTubeEmbed(url) {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/);
    return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : url;
  }

  function simpleMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>')
      .replace(/^(.+)$/s, '<p>$1</p>');
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={styles.notFound}>
        <h2>Publicación no encontrada</h2>
        <Link to="/blog" className={styles.backLink}>← Volver al blog</Link>
      </div>
    );
  }

  const blocks = parseContent(post.content);

  return (
    <article className={styles.article}>
      {/* Cover */}
      <header className={styles.header}>
        <img src={post.cover_image} alt={post.title} className={styles.coverImage} />
        <div className={styles.headerOverlay}></div>
        <div className={styles.headerContent}>
          <Link to="/blog" className={styles.backBtn}>← Blog</Link>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.meta}>
            <span>{post.author || 'Sianna Travel'}</span>
            <span>·</span>
            <time>{formatDate(post.published_at)}</time>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className={styles.body}>
        {blocks.map((block, i) => renderBlock(block, i))}
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <Link to="/blog" className={styles.footerLink}>← Volver al blog</Link>
        <Link to="/paquetes" className={styles.footerCta}>Ver paquetes de viaje</Link>
      </footer>
    </article>
  );
}

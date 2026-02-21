import { notFound } from 'next/navigation';
import NotionContentRenderer from '@/components/blog/NotionContentRenderer';
import Image from 'next/image';
import { format } from 'date-fns';
import styles from './blogpost.module.css';
import Newsletter from '@/components/NewsletterCTA/NewsletterCTA';

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/blog/${slug}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) notFound();
  const post = await res.json();

  return (
    <main className={styles.container}>  {/* ← Added container for consistent padding */}
      <article className={styles.article}>
        {post.coverImage && (
          <div className={styles.coverImageWrapper}>
            <img
              src={post.coverImage}
              alt={post.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {post.featured && (
              <div className={styles.featuredBadge}>
                <span className={styles.badgeIcon}>⭐</span>
                Featured
              </div>
            )}
          </div>
        )}

        <h1 className={styles.title}>{post.title}</h1>

        <div className={styles.meta}>
          {post.author && <span>By {post.author}</span>}
          {post.date && <span>{format(new Date(post.date), 'PPP')}</span>}
          {post.readTime && <span>{post.readTime} read</span>}
          {post.status && <span className={styles.status}>{post.status}</span>}
        </div>

        {post.excerpt && (
          <blockquote className={styles.excerpt}>{post.excerpt}</blockquote>
        )}

        <section className={styles.content}>
          {post.blocks?.length > 0 ? (
            <NotionContentRenderer blocks={post.blocks} />
          ) : (
            <p className={styles.noContent}>No content available.</p>
          )}
        </section>

        {post.tags?.length > 0 && (
          <div className={styles.postTags}>
            {post.tags.map((tag: string) => (
              <span key={tag} className={styles.postTag}>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>

      <Newsletter />
    </main>
  );
}
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import styles from './blog-post.module.css';
import NotionContentRenderer from '@/components/blog/NotionContentRenderer';


export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/blog/${params.slug}`);
  const post = await response.json();
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: [post.coverImage],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/blog/${params.slug}`, {
    next: { revalidate: 60 }
  });
  
  if (!response.ok) notFound();
  
  const post = await response.json();

  return (
    <article className={styles.container}>
      {post.coverImage && (
        <div className={styles.heroImage}>
          <img 
            src={post.coverImage} 
            alt={post.title}
            className={styles.image}
          />
        </div>
      )}
      
      <div className={styles.header}>
        <div className={styles.breadcrumb}>
          <a href="/blog">Blog</a>
          <span> / </span>
          <span>{post.title}</span>
        </div>
        
        <h1 className={styles.title}>{post.title}</h1>
        
        <div className={styles.meta}>
          <time dateTime={post.date} className={styles.date}>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          
          {post.tags.length > 0 && (
            <div className={styles.tags}>
              {post.tags.map((tag: string) => (
                <span key={tag} className={styles.tag}>#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className={styles.content}>
        <NotionContentRenderer content={post.content} />
      </div>
    </article>
  );
}
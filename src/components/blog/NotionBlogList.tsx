// components/blog/NotionBlogList.tsx
'use client';
import { Calendar, Tag } from 'lucide-react';
import Link from 'next/link';
import styles from './NotionBlogList.module.css';

interface NotionPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  coverImage: string;
  tags: string[];
}

export default function NotionBlogList({ posts = [] }: { posts?: NotionPost[] }) {
  // Ensure posts is always an array
  const safePosts = Array.isArray(posts) ? posts : [];
  
  if (safePosts.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No posts available.</p>
      </div>
    );
  }
  
  return (
    <div className={styles.grid}>
      {safePosts.map((post) => (
        <article key={post.id || Math.random()} className={styles.card}>
          {post.coverImage && (
            <div className={styles.imageContainer}>
              <img 
                src={post.coverImage} 
                alt={post.title || 'Blog post image'}
                className={styles.image}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
          
          <div className={styles.content}>
            <div className={styles.meta}>
              <span className={styles.date}>
                <Calendar size={14} />
                {post.date ? new Date(post.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                }) : 'No date'}
              </span>
              
              {post.tags && post.tags.length > 0 && (
                <div className={styles.tags}>
                  <Tag size={14} />
                  {post.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              )}
            </div>
            
            <h2 className={styles.title}>
              <Link href={`/blog/${post.slug || post.id || '#'}`}>
                {post.title || 'Untitled Post'}
              </Link>
            </h2>
            
            <p className={styles.excerpt}>
              {post.excerpt || 'No excerpt available.'}
            </p>
            
            <Link 
              href={`/blog/${post.slug || post.id || '#'}`} 
              className={styles.readMore}
            >
              Read Article →
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
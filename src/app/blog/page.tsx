// app/blog/page.tsx
import NotionBlogList from '@/components/blog/NotionBlogList';
import styles from './blogPage.module.css';

export default async function BlogPage() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/blog`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      console.error('Failed to fetch posts:', response.status);
      return (
        <div className={styles.container}>
          <h1 className={styles.title}>Our Blog</h1>
          <p className={styles.error}>
            Failed to load blog posts. Please try again later.
          </p>
        </div>
      );
    }
    
    const posts = await response.json();
    
    // Ensure posts is an array
    const safePosts = Array.isArray(posts) ? posts : [];
    
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Our Blog</h1>
        <p className={styles.description}>
          Written by our team in Notion - no coding required!
        </p>
        {safePosts.length > 0 ? (
          <NotionBlogList posts={safePosts} />
        ) : (
          <div className={styles.emptyState}>
            <p>No blog posts found. Please add some posts in Notion.</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error in BlogPage:', error);
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Our Blog</h1>
        <p className={styles.error}>
          An error occurred while loading the blog. Please try again later.
        </p>
      </div>
    );
  }
}
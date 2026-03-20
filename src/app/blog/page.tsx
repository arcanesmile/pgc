import Newsletter from "@/components/NewsletterCTA/NewsletterCTA";
import Image from "next/image";
import ErrorState from "./ErrorState"; // New client component
import styles from "./blogPage.module.css";

export const dynamic = "force-dynamic";

type BlogPost = {
  id: string;
  title?: string;
  slug: string;
  excerpt?: string;
  date?: string;
  coverImage?: string | null;
  tags?: string[];
  author?: string;
  readTime?: string;
  featured?: boolean;
};

async function getPosts(): Promise<BlogPost[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/blog`, {
    cache: "no-store",
  });
  if (!res.ok) {
    console.error("Failed to fetch posts:", res.status);
    throw new Error(`Failed to fetch posts: ${res.status}`);
  }
  return res.json();
}

// Helper to calculate reading time from excerpt
function calculateReadingTime(content: string | undefined): number {
  if (!content) return 2;
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

// Format date nicely
function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return "Date not set";
  }
}

export default async function BlogPage() {
  let posts: BlogPost[] = [];
  let error: unknown = null;
  
  try {
    posts = await getPosts();
    console.log(`Fetched ${posts.length} posts`);
  } catch (err) {
    console.error("Error fetching posts:", err);
    error = err;
  }

  // Separate featured and regular posts
  const featuredPosts = posts.filter((post) => post.featured === true);
  const regularPosts = posts.filter((post) => post.featured !== true);

  if (error) {
    return (
      <main className={styles.container}>
        <ErrorState /> {/* Client component with working retry button */}
      </main>
    );
  }

  return (
    <main className={styles.container}>
      {/* Hero Header */}
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>Insights & Perspectives</h1>
        <p className={styles.heroSubtitle}>
          Discover thought-provoking articles, tutorials, and insights on technology, 
          design, personal growth, and creative expression.
        </p>
        <div className={styles.heroStats}>
          <span className={styles.stat}>
            <strong>{posts.length}</strong> Articles
          </span>
          <span className={styles.stat}>
            <strong>{featuredPosts.length}</strong> Featured
          </span>
          <span className={styles.stat}>
            <strong>{regularPosts.length}</strong> Regular
          </span>
        </div>
      </header>

      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <section className={styles.featuredSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Featured Articles
            </h2>
            <p className={styles.sectionDescription}>
              Handpicked articles worth your attention
            </p>
          </div>
          
          <div className={styles.featuredGrid}>
            {featuredPosts.map((post) => (
              <FeaturedPostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* All Posts Section */}
      <section className={styles.allPostsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            All Articles
          </h2>
          <div className={styles.filterControls}>
            <button className={`${styles.filterButton} ${styles.active}`}>All</button>
            <button className={styles.filterButton}>Latest</button>
            <button className={styles.filterButton}>Popular</button>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📝</div>
            <h3>No Articles Yet</h3>
            <p>We&apos;re working on creating amazing content. Check back soon!</p>
          </div>
        ) : regularPosts.length === 0 && featuredPosts.length > 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎯</div>
            <h3>All Articles Are Featured</h3>
            <p>Every article is currently marked as featured. Check out the featured section above!</p>
          </div>
        ) : (
          <div className={styles.postsGrid}>
            {regularPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* Newsletter CTA */}
      <Newsletter />
    </main> 
  );
}

// Featured Post Card Component
function FeaturedPostCard({ post }: { post: BlogPost }) {
  const readingTime = post.readTime || `${calculateReadingTime(post.excerpt)} min read`;
  
  return (
    <article className={styles.featuredCard}>
      {post.coverImage && (
        <div className={styles.featuredImageContainer}>
          <Image
            src={post.coverImage}
            alt={post.title || "Featured article cover"}
            className={styles.featuredImage}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            priority={false}
          />
          <div className={styles.featuredBadge}>
            <span className={styles.badgeIcon}>⭐</span>
            Featured
          </div>
        </div>
      )}
      
      <div className={styles.featuredContent}>
        <div className={styles.featuredMeta}>
          <div className={styles.metaLeft}>
            <time className={styles.date} dateTime={post.date ?? ''}>
              {post.date ? formatDate(post.date) : 'Date not set'}
            </time>
            <span className={styles.readTime}>
              <span className={styles.clockIcon}>⏱️</span>
              {readingTime}
            </span>
          </div>
          {post.author && (
            <div className={styles.author}>
              <span className={styles.authorIcon}>👤</span>
              {post.author}
            </div>
          )}
        </div>
        
        <h3 className={styles.featuredTitle}>
          <a href={`/blog/${post.slug}`} className={styles.featuredTitleLink}>
            {post.title || "Untitled"}
          </a>
        </h3>
        
        <p className={styles.featuredExcerpt}>
          {post.excerpt || "No description available"}
        </p>
        
        {post.tags && post.tags.length > 0 && (
          <div className={styles.featuredTags}>
            {post.tags.slice(0, 4).map((tag: string) => (
              <span key={tag} className={styles.featuredTag}>
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        <div className={styles.featuredFooter}>
          <a href={`/blog/${post.slug}`} className={styles.readMoreButton}>
            Read Article
            <span className={styles.arrowIcon}>→</span>
          </a>
        </div>
      </div>
    </article>
  );
}

// Regular Post Card Component
function PostCard({ post }: { post: BlogPost }) {
  const readingTime = post.readTime || `${calculateReadingTime(post.excerpt)} min read`;
  
  return (
    <article className={styles.postCard}>
      {post.coverImage && (
        <div className={styles.postImageContainer}>
          <Image
            src={post.coverImage}
            alt={post.title || "Post cover"}
            className={styles.postImage}
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            priority={false}
          />
          {post.featured && (
            <div className={styles.postBadge}>
              <span className={styles.badgeIcon}>⭐</span>
              Featured
            </div>
          )}
        </div>
      )}
      
      <div className={styles.postContent}>
        <div className={styles.postMeta}>
          <time className={styles.date} dateTime={post.date ?? ''}>
            {post.date ? formatDate(post.date) : 'Date not set'}
          </time>
          <span className={styles.divider}>•</span>
          <span className={styles.readTime}>
            {readingTime}
          </span>
          {post.author && (
            <>
              <span className={styles.divider}>•</span>
              <span className={styles.author}>
                {post.author}
              </span>
            </>
          )}
        </div>
        
        <h3 className={styles.postTitle}>
          <a href={`/blog/${post.slug}`}>
            {post.title || "Untitled"}
          </a>
        </h3>
        
        <p className={styles.postExcerpt}>
          {post.excerpt || "No description available"}
        </p>
        
        {post.tags && post.tags.length > 0 && (
          <div className={styles.postTags}>
            {post.tags.slice(0, 3).map((tag: string) => (
              <span key={tag} className={styles.postTag}>
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        <a href={`/blog/${post.slug}`} className={styles.postReadMore}>
          Continue Reading
          <span className={styles.arrowIcon}>→</span>
        </a>
      </div>
    </article>
  );
}

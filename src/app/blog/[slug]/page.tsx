import Image from 'next/image';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import { BlogPost } from '../../../types/blog';
import styles from './blogPost.module.css';

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'src/content/blog')
  const fileNames = fs.readdirSync(postsDirectory)
  
  return fileNames.map(fileName => ({
    slug: fileName.replace(/\.md$/, '')
  }))
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  
  if (!post) {
    return <div>Post not found</div>
  }

  return (
    <div className={styles.blogPostContainer}>
      <article className={styles.blogArticle}>
        <h1 className={styles.blogPostTitle}>{post.title}</h1>
        <div className={styles.blogPostMeta}>
          <span className={styles.blogPostDate}>{post.date}</span>
          {post.author && (
            <span className={styles.blogPostAuthor}>By {post.author}</span>
          )}
        </div>
        {post.image && (
          <Image 
            src={post.image} 
            alt={post.title}
            width={400}
            height={400} 
            className={styles.blogPostImage}
          />
        )}
        <div className={styles.blogPostContent}>
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  )
}

function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(process.cwd(), 'src/content/blog', `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    
    return {
      slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      content,
      ...data
    } as BlogPost
  } catch {
    return null
  }
}
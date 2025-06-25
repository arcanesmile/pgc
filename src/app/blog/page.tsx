import Image from 'next/image'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import { BlogPost } from '../../types/blog'
import styles from './blogPage.module.css'

export default function BlogPage() {
  const postsDirectory = path.join(process.cwd(), 'src/content/blog')
  const fileNames = fs.readdirSync(postsDirectory)
  
  const posts: BlogPost[] = fileNames.map(fileName => {
    const slug = fileName.replace(/\.md$/, '')
    const fullPath = path.join(postsDirectory, fileName)
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
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className={styles.blogContainer}>
      <div className={styles.content}>
                  <h1 className={styles.heading}>Pgc Blog</h1>
                  <p className={styles.links}>
                      <Link href="/" className={styles.link}
                      >Home</Link>/Blog
                  </p>
                </div>
      <div className={styles.blogGrid}>
        {posts.map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.blogCard}>
            {post.image && (
              <Image
                src={post.image} 
                alt={post.title} 
                width={400}
                height={400} 
                className={styles.blogImage}
              />
            )}
            <div className={styles.blogCardContent}>
              <h2 className={styles.blogCardTitle}>{post.title}</h2>
              <p className={styles.blogCardExcerpt}>{post.excerpt}</p>
              <div className={styles.blogCardFooter}>
                <span className={styles.blogCardDate}>{post.date}</span>
                {post.tags && (
                  <span className={styles.blogCardTag}>{post.tags[0]}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
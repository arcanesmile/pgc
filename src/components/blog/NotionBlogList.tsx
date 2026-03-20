"use client";

import Link from "next/link";

type BlogListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
};

export default function NotionBlogList({ posts }: { posts: BlogListItem[] }) {
  return (
    <div>
      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
          <Link href={`/blog/${post.slug}`}>Read more</Link>
        </article>
      ))}
    </div>
  );
}

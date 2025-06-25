// Blog post metadata and content structure
export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  image?: string
  author?: string
  tags?: string[]
  featured?: boolean
}

// Props for blog components
export interface BlogCardProps {
  post: BlogPost
}

export interface BlogContentProps {
  post: BlogPost
}
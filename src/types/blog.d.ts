export type PostStatus = 'published' | 'draft' | 'archived';

export interface NotionBlogPost {
  id: string;
  properties: {
    Title: {
      title: Array<{ plain_text: string }>;
    };
    Slug: {
      rich_text: Array<{ plain_text: string }>;
    };
    Date: {
      date: { start: string; end: string | null };
    };
    Status: {
      select: { name: PostStatus };
    };
    Tags: {
      multi_select: Array<{ name: string }>;
    };
    Excerpt: {
      rich_text: Array<{ plain_text: string }>;
    };
    'Cover Image': {
      files: Array<{
        name: string;
        type: 'external' | 'file';
        external?: { url: string };
        file?: { url: string; expiry_time: string };
      }>;
    };
    Featured: { checkbox: boolean };
    Author: { rich_text: Array<{ plain_text: string }> };
    'Read Time': { rich_text: Array<{ plain_text: string }> };
  };
  content?: string; // This comes from Notion page blocks
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  tags: string[];
  author: string;
  readTime?: string;
  featured: boolean;
  status: PostStatus;
}
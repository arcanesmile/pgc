// app/api/blog/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { notion } from '@/lib/notion';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const apiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_DATABASE_ID;
    
    if (!apiKey || !databaseId) {
      return NextResponse.json(
        { error: 'Missing Notion configuration' },
        { status: 500 }
      );
    }
    
    // First, query the database to find the page with matching slug
    const databaseQuery = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          and: [
            { property: 'Published', checkbox: { equals: true } },
            { property: 'Slug', rich_text: { equals: params.slug } }
          ]
        }
      }),
    });
    
    if (!databaseQuery.ok) {
      throw new Error(`Notion API error: ${databaseQuery.status}`);
    }
    
    const queryData = await databaseQuery.json();
    
    if (!queryData.results.length) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    const page = queryData.results[0];
    
    // Fetch the page blocks for rich content
    const blocksResponse = await fetch(`https://api.notion.com/v1/blocks/${page.id}/children`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
      },
    });
    
    const blocksData = await blocksResponse.json();
    
    // Parse page properties
    const props = page.properties;
    
    const getText = (property: any) => {
      return property?.rich_text?.[0]?.plain_text || 
             property?.title?.[0]?.plain_text || 
             '';
    };
    
    const getContentFromBlocks = (blocks: any[]) => {
      // Convert Notion blocks to markdown
      let markdown = '';
      
      blocks.forEach((block) => {
        switch (block.type) {
          case 'paragraph':
            markdown += block.paragraph.rich_text.map((text: any) => text.plain_text).join('') + '\n\n';
            break;
          case 'heading_1':
            markdown += '# ' + block.heading_1.rich_text.map((text: any) => text.plain_text).join('') + '\n\n';
            break;
          case 'heading_2':
            markdown += '## ' + block.heading_2.rich_text.map((text: any) => text.plain_text).join('') + '\n\n';
            break;
          case 'heading_3':
            markdown += '### ' + block.heading_3.rich_text.map((text: any) => text.plain_text).join('') + '\n\n';
            break;
          case 'bulleted_list_item':
            markdown += '- ' + block.bulleted_list_item.rich_text.map((text: any) => text.plain_text).join('') + '\n';
            break;
          case 'numbered_list_item':
            markdown += '1. ' + block.numbered_list_item.rich_text.map((text: any) => text.plain_text).join('') + '\n';
            break;
          case 'code':
            markdown += '```' + block.code.language + '\n' + 
                       block.code.rich_text.map((text: any) => text.plain_text).join('') + 
                       '\n```\n\n';
            break;
          case 'image':
            const imageUrl = block.image.type === 'external' 
              ? block.image.external.url 
              : block.image.file.url;
            markdown += `![Image](${imageUrl})\n\n`;
            break;
        }
      });
      
      return markdown;
    };
    
    const post = {
      id: page.id,
      title: getText(props.Title),
      slug: getText(props.Slug) || page.id,
      excerpt: getText(props.Excerpt),
      content: getContentFromBlocks(blocksData.results), // Use actual page content
      date: props.Date?.date?.start || page.created_time,
      coverImage: props['Cover Image']?.files?.[0]?.file?.url || 
                 props['Cover Image']?.files?.[0]?.external?.url || '',
      tags: props.Tags?.multi_select?.map((tag: any) => tag.name) || [],
    };
    
    return NextResponse.json(post);
    
  } catch (error: any) {
    console.error('Blog Post API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch post' },
      { status: 500 }
    );
  }
}
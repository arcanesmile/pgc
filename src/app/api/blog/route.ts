// app/api/blog/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_DATABASE_ID;
    
    if (!apiKey || !databaseId) {
      console.error('Missing Notion configuration');
      return NextResponse.json(
        { error: 'Missing Notion configuration', posts: [] },
        { status: 500 }
      );
    }
    
    // Fetch from Notion API
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({
        filter: {
          property: 'Published',
          checkbox: { equals: true }
        },
        sorts: [
          { property: 'Date', direction: 'descending' }
        ]
      }),
    });
    
    const responseText = await response.text();
    console.log('Raw Notion API Response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Notion API response:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON response from Notion', posts: [] },
        { status: 500 }
      );
    }
    
    if (!response.ok) {
      console.error('Notion API error details:', data);
      return NextResponse.json(
        { 
          error: `Notion API error: ${response.status}`,
          message: data.message || 'Unknown error',
          posts: [] 
        },
        { status: response.status }
      );
    }
    
    // Ensure data.results exists and is an array
    if (!data.results || !Array.isArray(data.results)) {
      console.error('Invalid data structure from Notion:', data);
      return NextResponse.json(
        { error: 'Invalid data structure from Notion', posts: [] },
        { status: 500 }
      );
    }
    
    // Transform the data
    const posts = data.results.map((page: any) => {
      const props = page.properties || {};
      
      // Helper function to extract text
      const getText = (property: any) => {
        if (!property) return '';
        return property?.rich_text?.[0]?.plain_text || 
               property?.title?.[0]?.plain_text || 
               '';
      };
      
      // Get excerpt or first 150 characters of content
      let excerpt = getText(props.Excerpt);
      if (!excerpt && props.Content?.rich_text?.[0]?.plain_text) {
        excerpt = props.Content.rich_text[0].plain_text.substring(0, 150) + '...';
      }
      
      return {
        id: page.id || '',
        title: getText(props.Title) || 'Untitled',
        slug: getText(props.Slug) || page.id || '',
        excerpt: excerpt || '',
        date: props.Date?.date?.start || page.created_time || new Date().toISOString(),
        coverImage: props['Cover Image']?.files?.[0]?.file?.url || 
                   props['Cover Image']?.files?.[0]?.external?.url || '',
        tags: props.Tags?.multi_select?.map((tag: any) => tag?.name || '').filter(Boolean) || [],
      };
    }).filter((post: { title: string; }) => post.title !== 'Untitled'); // Filter out invalid posts
    
    console.log(`Processed ${posts.length} posts`);
    
    return NextResponse.json(posts);
    
  } catch (error: any) {
    console.error('Blog API Error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch posts',
        posts: [] 
      },
      { status: 500 }
    );
  }
}
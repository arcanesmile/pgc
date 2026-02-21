import { NextResponse } from 'next/server';

const NOTION_API_KEY = process.env.NOTION_API_KEY!;
const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

const NOTION_HEADERS = {
  Authorization: `Bearer ${NOTION_API_KEY}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
};

export async function GET(
  _: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const queryRes = await fetch(
      `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
      {
        method: 'POST',
        headers: NOTION_HEADERS,
        body: JSON.stringify({
          filter: {
            property: 'Slug',
            rich_text: { equals: slug },
          },
        }),
      }
    );

    if (!queryRes.ok) {
      return NextResponse.json({ error: 'Query failed' }, { status: 500 });
    }

    const { results } = await queryRes.json();
    if (!results.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const page = results[0];
    const props = page.properties;

    // Helper to get plain text from title or rich_text
    const getText = (prop: any) =>
      prop?.title?.[0]?.plain_text ||
      prop?.rich_text?.[0]?.plain_text ||
      '';

    // Fetch blocks with error handling
    let blocks = [];
    try {
      const blocksRes = await fetch(
        `https://api.notion.com/v1/blocks/${page.id}/children?page_size=100`,
        { headers: NOTION_HEADERS }
      );
      const blocksData = await blocksRes.json();
      blocks = blocksData.results || [];
    } catch (err) {
      console.error('Failed to fetch blocks:', err);
    }

 const coverFile = page.properties["Cover Image"]?.files?.[0];

const coverImage =
  coverFile?.external?.url ||
  coverFile?.file?.url ||
  null;

return NextResponse.json({
  id: page.id,
  title: getText(props.Title),
  excerpt: getText(props.Excerpt),
  date: props.Date?.date?.start || null,
  tags: props.Tags?.multi_select?.map((t: any) => t.name) || [],
  author: props.Author?.rich_text?.[0]?.plain_text || null,
  readTime: props['Read Time']?.rich_text?.[0]?.plain_text || null,
  status: props['Status AI']?.select?.name || null,
  featured: props.Featured?.checkbox || false,
  coverImage,
  blocks,
});

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

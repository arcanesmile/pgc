import { NextResponse } from 'next/server';

type RichTextProperty = {
  title?: Array<{ plain_text?: string }>;
  rich_text?: Array<{ plain_text?: string }>;
};

type MultiSelectProperty = { multi_select?: Array<{ name: string }> };
type FileProperty = {
  files?: Array<{
    external?: { url?: string };
    file?: { url?: string };
  }>;
};

type NotionPage = {
  id: string;
  properties: {
    Title?: RichTextProperty;
    Excerpt?: RichTextProperty;
    Date?: { date?: { start?: string } };
    Tags?: MultiSelectProperty;
    Author?: { rich_text?: Array<{ plain_text?: string }> };
    'Read Time'?: { rich_text?: Array<{ plain_text?: string }> };
    'Status AI'?: { select?: { name?: string } };
    Featured?: { checkbox?: boolean };
    'Cover Image'?: FileProperty;
  };
};

const NOTION_API_KEY = process.env.NOTION_API_KEY!;
const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

const NOTION_HEADERS = {
  Authorization: `Bearer ${NOTION_API_KEY}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
};

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

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

    const { results } = (await queryRes.json()) as { results: NotionPage[] };
    if (!results.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const page = results[0];
    const props = page.properties;

    const getText = (prop?: RichTextProperty) =>
      prop?.title?.[0]?.plain_text ||
      prop?.rich_text?.[0]?.plain_text ||
      '';

    // Fetch blocks with error handling
    let blocks: unknown[] = [];
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

    const coverFile = page.properties['Cover Image']?.files?.[0];

    const coverImage =
      coverFile?.external?.url ||
      coverFile?.file?.url ||
      null;

    return NextResponse.json({
      id: page.id,
      title: getText(props.Title),
      excerpt: getText(props.Excerpt),
      date: props.Date?.date?.start || null,
      tags: props.Tags?.multi_select?.map((t) => t.name) || [],
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

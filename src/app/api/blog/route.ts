import { NextResponse } from "next/server";

const NOTION_API_KEY = process.env.NOTION_API_KEY!;
const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

export async function GET() {
  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filter: {
            property: "Status",
            select: { equals: "Published" },
          },
          sorts: [{ property: "Date", direction: "descending" }],
        }),
      }
    );

    if (!response.ok) {
      console.error(await response.text());
      return NextResponse.json([], { status: 500 });
    }

    const data = await response.json();

    const posts = data.results.map((page: any) => {
      const getText = (prop: any) =>
        prop?.title?.[0]?.plain_text ||
        prop?.rich_text?.[0]?.plain_text ||
        "";

      const excerpt = getText(page.properties.Excerpt);

      const wordCount = Math.ceil(excerpt.length / 5);
      const readingTime = Math.max(1, Math.ceil(wordCount / 200));

      const cover = page.properties["Cover Image"]?.files?.[0];

      return {
        id: page.id,
        title: getText(page.properties.Title) || "Untitled",
        slug: getText(page.properties.Slug) || page.id,
        excerpt,
        date: page.properties.Date?.date?.start || page.created_time,
        coverImage: cover?.external?.url || cover?.file?.url || null,
        tags:
          page.properties.Tags?.multi_select?.map((t: any) => t.name) || [],
        author: getText(page.properties.Author) || "Unknown",
        readTime: `${readingTime} min read`,
        featured: page.properties.Featured?.checkbox || false,
      };
    });

    return NextResponse.json(posts);
  } catch (err) {
    console.error(err);
    return NextResponse.json([], { status: 500 });
  }
}

import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function GET() {
  try {
    if (!process.env.NOTION_DATABASE_ID) {
      throw new Error('NOTION_DATABASE_ID not configured');
    }

    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      page_size: 10,
    });

    const projects = response.results.map((page) => {
      const pageData = page as {
        id: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        properties: Record<string, any>;
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const properties = pageData.properties as any;

      return {
        id: pageData.id,
        name: properties.Name?.title?.[0]?.plain_text || 'Untitled',
        description: properties.Description?.rich_text?.[0]?.plain_text || '',
        progress: properties.Progress?.number || 0,
        status: properties.Status?.select?.name?.toLowerCase().replace(' ', '-') || 'active',
        dueDate: properties['Due Date']?.date?.start || null,
        details: properties.Details?.rich_text?.[0]?.plain_text || '',
      };
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
# Fountain Labs OS

A retro-style team dashboard and project management system built with Next.js.

## Features

- **Projects Window**: Integrated with Notion database for project management
- **Team Window**: Team collaboration interface
- **Playlist Window**: Spotify integration for team music
- Retro 90s-style UI with animated backgrounds

## Notion Integration Setup

The Projects window connects to a Notion database to display and manage team projects.

### Required Environment Variables

Copy `.env.example` to `.env.local` and fill in your Notion credentials:

```bash
cp .env.example .env.local
```

Set the following variables:
- `NOTION_TOKEN`: Your Notion integration token
- `NOTION_DATABASE_ID`: The ID of your Notion database

### Notion Database Schema

Your Notion database should have the following properties:

| Property Name | Property Type | Description |
|---------------|---------------|-------------|
| Name | Title | Project name |
| Description | Rich Text | Project description |
| Progress | Number | Progress percentage (0-100) |
| Status | Select | Project status (Active, Completed, On Hold) |
| Due Date | Date | Project due date |
| Details | Rich Text | Additional project details |

### Getting Your Notion Token

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Name your integration (e.g., "Fountain Labs")
4. Select the workspace containing your projects database
5. Copy the "Internal Integration Token"

### Getting Your Database ID

1. Open your Notion database in a browser
2. Copy the URL - it looks like: `https://notion.so/username/DATABASE_ID?v=VIEW_ID`
3. The `DATABASE_ID` is the 32-character string between the last `/` and `?`

### Connecting the Integration

1. In your Notion database, click the "..." menu
2. Select "Add connections"
3. Find and select your integration

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

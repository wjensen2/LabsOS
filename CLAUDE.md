# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fountain Labs OS is a retro 90s-style team dashboard built with Next.js 15, React 19, TypeScript, and Tailwind CSS. It simulates a vintage operating system interface with draggable/resizable windows, desktop icons, and a taskbar. The application provides dual interfaces: a desktop experience with window management and a mobile-optimized app launcher interface.

## Development Commands

**Development:**
- `npm run dev` - Start Next.js dev server with Turbopack
- `npm run dev:https` - Start HTTPS dev server using custom server (server.js with localhost.crt/localhost.key)

**Build & Deploy:**
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

### Responsive Design Strategy

The application uses a **device-based routing architecture** controlled by the `useIsMobile` hook (src/hooks/useIsMobile.ts):

- **Desktop (>768px)**: Renders full windowing system from src/app/page.tsx with draggable Window components, desktop icons, and taskbar
- **Mobile (≤768px)**: Renders MobileDesktop component with app launcher interface and full-screen app views

Both experiences are rendered from the same page component but use completely different UI trees based on device detection.

### Component Structure

**Desktop Components:**
- `Window` (src/components/Window.tsx): Draggable/resizable window container with title bar controls. Handles mouse-based drag/resize with viewport boundary constraints
- `DesktopIcon`: Clickable desktop shortcuts that toggle windows
- `Taskbar`: Bottom taskbar with app launchers and background toggle
- App windows: ProjectsWindow, TeamWindow, BrowserWindow, DocumentViewer, SurveyWindow, PromptBuilderWindow, PresentationWindow, RunnerGame
- `SpotifyPlayer`: Native Spotify integration (desktop only)

**Mobile Components** (src/components/mobile/):
- `MobileDesktop`: Main mobile container with status bar
- `MobileAppLauncher`: Grid of app icons for launching
- `MobileAppView`: Full-screen app container wrapper
- `apps/`: Mobile-optimized versions of each app (MobileProjects, MobileTeam, MobileMusic, etc.)

**Shared Components:**
- `PasswordModal`: Authentication gate shown on initial load
- `BackgroundBoxes`: Interactive animated background (toggleable on desktop)

### State Management

Window visibility is managed through a single `activeWindows` state object in src/app/page.tsx with boolean flags for each window/app. Mobile apps use `currentApp` state to track the single active full-screen app.

### API Routes

**Notion Integration** (src/app/api/projects/route.ts):
- `GET /api/projects` - Fetches projects from Notion database
- Requires `NOTION_TOKEN` and `NOTION_DATABASE_ID` environment variables
- Expected Notion database properties: Name (title), Description (rich_text), Progress (number), Status (select), Due Date (date), Details (rich_text)

**Spotify Integration** (src/app/api/auth/callback/spotify/route.ts):
- OAuth callback handler for Spotify authentication
- Requires `NEXT_PUBLIC_SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, and `NEXT_PUBLIC_SPOTIFY_REDIRECT_URI`

### Styling

- Uses Tailwind CSS 4 with custom retro-themed styles in src/app/globals.css
- "Press Start 2P" pixel font loaded from Google Fonts
- Custom CSS classes for window frames, title bars, and pixel-perfect borders
- Framer Motion for window animations and transitions

## Key Implementation Details

**Window Drag/Resize Implementation:**
- Drag initiated from title bar mousedown, tracks offset and updates position on mousemove
- Resize handle in bottom-right corner, expands/contracts from initial size
- Both use global event listeners that clean up on mouseup
- Viewport boundary constraints prevent windows from being dragged off-screen

**Mobile Detection:**
- Checks both viewport width (≤768px) and user agent strings
- Listens to resize and orientationchange events
- Returns boolean used to conditionally render desktop vs mobile UI trees

**HTTPS Development Server:**
- Custom Node.js HTTPS server (server.js) wraps Next.js request handler
- Uses localhost.crt and localhost.key for local SSL
- Required for certain Spotify OAuth flows and testing secure contexts

## Environment Configuration

Copy `.env.example` to `.env.local` and configure:

**Notion** (for Projects window):
- `NOTION_TOKEN` - Integration token from https://www.notion.so/my-integrations
- `NOTION_DATABASE_ID` - 32-character ID from database URL

**Spotify** (for Music/Playlist features):
- `NEXT_PUBLIC_SPOTIFY_CLIENT_ID` - Client ID from Spotify Developer Dashboard
- `SPOTIFY_CLIENT_SECRET` - Client secret from Spotify Developer Dashboard
- `NEXT_PUBLIC_SPOTIFY_REDIRECT_URI` - OAuth callback URL (default: http://127.0.0.1:3000/api/auth/callback/spotify)

## TypeScript Configuration

- Path alias `@/*` maps to `./src/*`
- Target: ES2017 with ESNext modules
- Strict mode enabled
- Next.js plugin for type generation

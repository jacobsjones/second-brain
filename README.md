# Second Brain

A desktop-optimized Obsidian-like note-taking application built for Jacob.

## Features

- **Three-Pane Layout**: Sidebar, note list, and editor - just like Obsidian desktop
- **Graph View**: Full-screen force-directed graph visualization using D3.js
- **Markdown Editor**: Live preview with syntax highlighting
- **Wiki-Links**: Create connections between notes with `[[Note Name]]` syntax
- **Auto-Tagging**: Automatic extraction and display of `#tags`
- **Sections**: Organize notes into Ideas, Trading, Projects, Journal, and Articles
- **Search**: Real-time search across all notes
- **Dark Theme**: Obsidian-inspired dark UI with purple accents

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Express + TypeScript
- **Graph**: D3.js for force-directed graph visualization
- **Markdown**: react-markdown with remark-gfm

## Quick Start

### 1. Start the Backend

```bash
cd backend
npm run dev
```

Backend runs on http://localhost:3001

### 2. Start the Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on http://localhost:5173

## Project Structure

```
second-brain/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Express server entry
│   │   ├── routes/
│   │   │   ├── notes.ts      # Notes API endpoints
│   │   │   └── graph.ts      # Graph data endpoint
│   │   ├── services/
│   │   │   └── fileService.ts # File operations
│   │   └── types/
│   │       └── index.ts      # TypeScript types
│   └── data/notes/           # Markdown note storage
│       ├── Ideas/
│       ├── Trading/
│       ├── Projects/
│       ├── Journal/
│       └── Articles/
├── frontend/
│   └── src/
│       ├── App.tsx           # Main application
│       ├── components/
│       │   ├── Sidebar.tsx   # Navigation sidebar
│       │   ├── NoteList.tsx  # Note list view
│       │   ├── NoteEditor.tsx # Markdown editor
│       │   ├── GraphView.tsx # D3.js graph
│       │   └── NewNoteModal.tsx
│       ├── api/
│       │   └── index.ts      # API client
│       └── types/
│           └── index.ts      # TypeScript types
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | List all notes (with optional `?section=` filter) |
| GET | `/api/notes/:id` | Get single note |
| POST | `/api/notes` | Create new note |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |
| GET | `/api/notes/search?q=` | Search notes |
| GET | `/api/graph` | Get graph data (nodes & links) |

## Keyboard Shortcuts

- Click **Graph View** in sidebar to see note connections
- Drag graph nodes to rearrange
- Click nodes in graph to open notes
- Use `[[Note Name]]` syntax to create wiki-links
- Add `#tags` anywhere in note content

## Data Storage

Notes are stored as plain Markdown files in `backend/data/notes/` organized by section. This makes it easy to:
- Sync with other devices
- Edit with any text editor
- Version control with git
- Export or migrate data
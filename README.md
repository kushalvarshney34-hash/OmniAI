# OmniAgent OS

Visual AI Agent Builder & Operating System — a world-class SaaS platform for building, deploying, and monitoring AI agents.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS** + Shadcn UI
- **React Flow** (@xyflow/react) — workflow canvas
- **Framer Motion** — animations
- **Zustand** — state management
- **TanStack Query** — data fetching
- **Recharts** — analytics charts
- **Prisma ORM** + SQLite/PostgreSQL
- **Server Actions**

## Getting Started

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

- **Visual Workflow Builder** — drag-and-drop node editor with 22+ node types
- **Time Travel Undo/Redo** — command-pattern history with timeline
- **Execution Simulator** — run workflows with live token streaming
- **Analytics Dashboard** — charts, heatmaps, metrics
- **Cost Monitoring** — provider breakdown, budget alerts
- **Team Collaboration** — roles, comments, activity feed
- **Marketplace** — pre-built agent templates
- **Settings & Billing** — profile, API keys, integrations

## Project Structure

```
src/
├── app/(dashboard)/     # App routes
├── components/
│   ├── ui/              # Design system (Shadcn)
│   ├── layout/          # Sidebar, nav, command palette
│   ├── workflow/        # Canvas, nodes, validation
│   ├── simulator/       # Execution engine UI
│   ├── analytics/       # Charts
│   └── marketplace/     # Template cards
├── features/workflow/   # Node registry, validation, history
├── stores/              # Zustand stores
├── server/actions/      # Server Actions
├── lib/                 # Utils, constants, mock data
└── types/               # TypeScript types
```

## Environment

Copy `.env.example` to `.env` and configure:

```
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

For PostgreSQL, update `prisma/schema.prisma` provider and `DATABASE_URL`.

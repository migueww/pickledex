<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# General Agent Instructions

## Tech Stack
- **Framework**: Next.js 16+ (App Router)
- **Library**: React 19
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 (using native `@theme` variables)
- **Testing**: Vitest

## Execution Commands
- **Start Development (Docker)**: `docker compose up -d --build`
- **Start Development (Local)**: `npm run dev`
- **Run Tests (Interactive/Watch)**: `npm test`
- **Run Tests (CI/Run once)**: `npm run test:run`

## Guidelines for Agents
- **Testing**: Whenever modifying components or logic, ensure tests are updated or run (`npm test`) to prevent regressions.
- **Styling**: Stick to the Tailwind CSS v4 conventions utilized in the project. Do not mix with CSS modules or styled-components unless specifically asked.
- **Docker**: The application is configured to run smoothly via Docker. When creating or updating files, verify that `Dockerfile` and `docker-compose.yml` don't require adjustments, or update them if needed.
- **Communication**: When using tools, favor native AI coding tools over generic shell commands (e.g., use `view_file` instead of `cat`, `replace_file_content` instead of `sed`).
- **Dependencies**: Refrain from installing new dependencies unless strictly necessary for the task at hand.
- **Architecture**: Separate business logic and state management from UI components using Custom Hooks (`src/hooks`). Keep pure helper functions outside of React component scopes to optimize rendering.

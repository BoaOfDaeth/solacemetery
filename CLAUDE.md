# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Solacemetery is a help articles website and statistics dashboard for **Solace MUD** — a text-based online RPG set in the Dragonlance fantasy world. It consists of two independent Next.js services:

- **`web/`** — Main stats dashboard (MySQL-backed, public stats with 30-minute delay to prevent exploit abuse)
- **`items/`** — Item database "solabase" (MongoDB-backed, Discord OAuth, runs on port 2888)

## Development Commands

Both services use the same pattern. Run from within `web/` or `items/`:

```bash
npm run dev          # Start dev server (turbopack)
npm run build        # Production build
npm run lint         # ESLint
npm run format       # Prettier write
npm run format:check # Prettier check
```

`items/` dev server runs on port 2888. `web/` has an additional script:
```bash
npm run check-help-urls  # Validate help article URLs (tsx scripts/check-help-urls.ts)
```

## Architecture

### `web/` — Stats Dashboard

- **Stack**: Next.js 16, TypeScript, Tailwind CSS 4, MySQL (`mysql2`), Redis
- **Data layer**: `src/lib/db.ts` (MySQL), `src/lib/redis.ts`
- **Game data**: `src/lib/classes.ts`, `src/lib/races.ts`, `src/lib/enums.ts` define core MUD game entities
- **Routes**: `/character`, `/class`, `/classes`, `/race`, `/races`, `/mob`, `/mvp`, `/pvp`, `/help`, `/search`
- **Submodule**: `web/solace-helpdev` — contains help article content (separate GitHub repo, requires deploy key in CI)

### `items/` — Item Database (solabase)

- **Stack**: Next.js 16, TypeScript, Tailwind CSS 4, MongoDB (`mongoose`), Redis, Discord OAuth
- **Data models** (`src/models/`):
  - `Item` — immutable raw text submissions (source of truth, never deleted)
  - `ParsedItem` — structured display entities derived from Items (deletable/rebuildable)
  - `User` — Discord-authenticated users with a `score` field
  - `PostingLog`, `ParsedItemVisibilityLog` — audit trails
- **Key invariant**: Items are the source of truth. ParsedItems are rebuilt from Items via `/api/items/reparse`. One ParsedItem per unique item name (by HRU slug); multiple Items can link to the same ParsedItem.
- **Scoring**: Only authenticated form posts earn scores; only the first poster of a new ParsedItem gets credit. API posts never award scores.
- **Auth**: Discord OAuth via `src/lib/auth.ts` / `src/lib/session.ts`

### Infrastructure

- **Docker Compose**: `docker/docker-compose.yml` — MongoDB, Redis, `web` (host network), `items` (host network, port 2888)
- **Images**: Built via GitHub Actions (`build-web`, `build-items` workflows — manually triggered), pushed to `ghcr.io/boaofdaeth/*`
- **nginx**: `nginx/solacemetery.conf`, `nginx/solabase.conf` — reverse proxy config
- **MySQL**: `mysql/` — custom config and init SQL (used by `web/` only)

## Deployment

```bash
make deploy   # Pulls latest images and recreates web + items containers
```

Requires `docker/.env` with: `DATABASE_URL`, `MONGO_INITDB_ROOT_USERNAME`, `MONGO_INITDB_ROOT_PASSWORD`, `REDIS_PORT`, `MONGODB_PORT`, `WEB_PORT`, `ITEMS_PORT`, `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `DISCORD_REDIRECT_URI`.

## Conventions

- Don't create or modify documentation unless asked
- When asked to plan something, propose the plan first and ask permission before implementing
- Don't write unused utility functions or tests unless explicitly asked

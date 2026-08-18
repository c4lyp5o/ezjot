# EZJOT

In the name of God, the merciful, the gracious

## What is it

EZJOT is a lightweight, web-based note-taking application. Access it online at [ezjot.calypsocloud.one](https://ezjot.calypsocloud.one/).

## Features

- Fast and minimal note-taking
- Accessible from any browser
- Simple, distraction-free interface
- Save text up to **1000 characters**, retrieve with a key
- Optional password protection
- **Burn after reading** — text deletes itself after one read
- **Autopurge** — stale pastes are removed nightly by cron

## Tech Stack

- **Backend:** Bun + [Elysia](https://elysiajs.com), SQLite, OpenAPI at `/api/v1`
- **Frontend:** React (Vite), Tailwind CSS v4
- **Other:** Docker (non-root), daily purge cron, CSP + security headers

## Getting Started

Requires [Bun](https://bun.sh/) ≥ 1.2.

```bash
bun install             # backend + frontend dependencies
bun dev                 # runs API (port 5000) + Vite dev frontend together
bun run build:client    # production frontend build into public/
bun start               # serve API + built frontend on port 5000
bun test                # backend test suite
```

## Running as a Docker Container

The Dockerfile builds the frontend, runs the API as a non-root user, and
auto-creates the database.

```bash
docker build . -t ezjot
docker run -p <desired host port>:5000 -v ezjot-db:/app/db ezjot:latest
```

The weekly purge cron runs inside the container.

## Limitations

- Maximum character limit: **1000** characters per text.
- No user accounts or permanent storage. Texts are temporary.

## License

MIT License.

---

Created with Bun, React, and love.

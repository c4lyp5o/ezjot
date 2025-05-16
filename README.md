# EZJOT

In the name of God, the merciful, the gracious

## What is it

EZJOT is a lightweight, web-based note-taking application. Access it online at [ezjot.calypsocloud.one](https://ezjot.calypsocloud.one/).

## Features

- Fast and minimal note-taking
- Accessible from any browser
- Simple, distraction-free interface

## Getting Started

To run EZJOT locally, you need the [Bun](https://bun.sh/) runtime.

1. **Install dependencies:**

```bash
bun run install-deps
```

4. **Run the server:**

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Running as a Docker Container

A Dockerfile is included. The database is created automatically in the container.

```bash
docker build . -t ezjot
docker run -p <desired host port>:5000 --name ezjot ezjot:latest
```

## Features

1. **Text Save** - Save text up to 1000 characters. Get a key for each upload.
2. **Text Get** - Get text using the key. Optional password protection.
3. **Burn After Reading** - Option to delete a text after it is read once.
4. **Autopurge** - Files are automatically deleted every day at 2:00 am.

## Limitations

- Maximum character limit: **1000** characters per text.
- No user accounts or permanent storage. Texts are temporary.

## Tech Stack

- **Backend:** Bun, Express-style routing, SQLite, Multer for file uploads
- **Frontend:** React (Vite), Tailwind CSS
- **Other:** Docker support, daily purge script

## License

MIT License.

---

Created with Bun, React, and love.

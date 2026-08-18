import path from "node:path";
import { mkdirSync } from "node:fs";
import { Database } from "bun:sqlite";
import { DB_DIR } from "./config";
import { generalLogger as logger } from "./logger";

mkdirSync(DB_DIR, { recursive: true });

const dbPath = path.join(DB_DIR, "ezjot.sqlite");

const db = new Database(dbPath, { create: true });

db.run("PRAGMA journal_mode = WAL;");
db.run("PRAGMA busy_timeout = 5000;");

db.run(`
CREATE TABLE IF NOT EXISTS pastes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  text TEXT NOT NULL,
  password_hash TEXT,
  burn_after_reading INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)
`);

logger.info(`[db] Database ready at ${dbPath}`);

export default db;

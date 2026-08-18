import path from "node:path";
import { fileURLToPath } from "node:url";

// import.meta.dir is Bun-only; derive it portably so vitest can import this too.
const HERE = path.dirname(fileURLToPath(import.meta.url));

export const PORT = process.env.PORT !== undefined ? Number(process.env.PORT) : 5000;
export const DB_DIR = path.join(HERE, "../db");
export const DB_PATH = process.env.DB_PATH || path.join(DB_DIR, "ezjot.sqlite");
export const LOG_DIR = path.join(HERE, "../logs");
export const PUBLIC_DIR = path.join(HERE, "../public");

// Keys are lowercase hex strings; 6 bytes = 48 bits of entropy (~281 trillion
// combinations). Long enough that brute-forcing is infeasible even without the
// rate limiter, short enough to share by hand.
export const KEY_LENGTH = 6;

// Server-side caps so the API can't be abused by clients that skip the UI limit.
export const MAX_TEXT_LENGTH = 100_000;
export const MAX_PASSWORD_LENGTH = 128;
export const MAX_KEY_LENGTH = 64;

export const RATE_LIMIT = { limit: 50, windowMs: 60_000 };

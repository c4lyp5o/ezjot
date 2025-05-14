import { Database } from 'bun:sqlite';
import logger from '@/utils/logger';

let dbInstance;

/**
 * Initializes the SQLite database.
 * Ensures tables are created if they do not exist.
 * @returns {Database} The database instance.
 */
const initializeDatabase = async () => {
  if (!dbInstance) {
    const dbPath = process.env.DB_PATH || './database/ezjot.sqlite';
    dbInstance = new Database(dbPath, { create: true });

    try {
      dbInstance.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS uploads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  text TEXT NOT NULL,
  password TEXT,
  burnAfterReading BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);
    } catch (error) {
      console.error('Error creating tables:', error.message);
      process.exit(1);
    }
  }

  logger.info(
    `[db] Database initialized at ${process.env.DB_PATH || './database/ezjot.sqlite'}`
  );
  return dbInstance;
};

export default initializeDatabase;

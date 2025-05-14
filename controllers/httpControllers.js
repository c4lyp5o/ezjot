import crypto from 'node:crypto';
import initializeDatabase from '@/database/sqlite';
import { hasCache, setCache, deleteCache, clearCache } from '@/database/cache.js';
import logger from '@/utils/logger';

const ezjotDb = await initializeDatabase();

const healthCheck = (_req, res) => {
  res.status(200).json({ message: 'ok' });
};

const saveText = async (req, res) => {
  const { text, password = '', burnAfterReading = false } = req.body || {};

  if (!text) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  let key;
  do {
    key = crypto.randomBytes(3).toString('hex');
    if (hasCache(key)) {
      logger.warn(
        `[cache] Key ${key} already exists in cache. Generating a new key.`
      );
    }
  } while (hasCache(key));
  setCache(key, true);
  logger.info(`[cache] Key ${key} added to cache.`);

  ezjotDb
    .prepare(
      'INSERT INTO uploads (key, text, password, burnAfterReading) VALUES (?, ?, ?, ?)'
    )
    .run(key, text, password, burnAfterReading);

  res.status(201).json(key);
};

const getText = async (req, res) => {
  const { key, password } = req.body || {};

  if (!key) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const result = ezjotDb
    .prepare('SELECT * FROM uploads WHERE key = ?')
    .get(key);

  if (!result) {
    return res.status(404).json({ message: 'Not Found' });
  }

  if (result.password && result.password !== password) {
    return res.status(403).json({ message: 'Incorrect password' });
  }

  if (result.burnAfterReading) {
    ezjotDb.prepare('DELETE FROM uploads WHERE key = ?').run(key);
    deleteCache(key);
    logger.info(`[cache] Key ${key} deleted from cache.`);
  }

  res.status(200).json(result.text);
};

const purgeEverything = (_req, res) => {
  ezjotDb
    .prepare('DELETE FROM uploads')
    .run();
  logger.info('[db] All keys deleted from database.');
  clearCache();
  logger.info('[cache] All keys deleted from cache.');
  res.status(200).json({ message: 'ok' });
}

export { healthCheck, saveText, getText, purgeEverything };

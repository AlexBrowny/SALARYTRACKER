import app from '../server/src/app.js';
import { initDb } from '../server/src/db/connection.js';

let isInitialized = false;
let initPromise = null;

async function ensureDb() {
  if (isInitialized) return;
  if (!initPromise) {
    initPromise = initDb()
      .then(() => {
        isInitialized = true;
      })
      .catch((err) => {
        initPromise = null;
        console.error('❌ Ошибка инициализации базы данных в Vercel Serverless Function:', err);
        throw err;
      });
  }
  await initPromise;
}

export default async function handler(req, res) {
  try {
    await ensureDb();
    return app(req, res);
  } catch (error) {
    console.error('❌ Ошибка выполнения Serverless Function:', error);
    return res.status(500).json({
      error: {
        code: 'DB_CONNECTION_ERROR',
        message:
          'Не удалось подключиться к базе данных Turso. Проверьте переменные окружения TURSO_DATABASE_URL и TURSO_AUTH_TOKEN в панели Vercel.',
        details: error.message,
      },
    });
  }
}

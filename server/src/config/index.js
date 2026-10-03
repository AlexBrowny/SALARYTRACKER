import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Загружаем переменные окружения из .env файла
dotenv.config();

// Получаем директорию текущего модуля
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Порт сервера
export const PORT = process.env.PORT || 3001;

// Настройки Turso / LibSQL
export const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL || process.env.LIBSQL_URL || '';
export const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN || process.env.LIBSQL_AUTH_TOKEN || '';

// Путь к локальному файлу базы данных SQLite (используется как резервный при отсутствии Turso)
export const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../salary_tracker.db');

// Секретный ключ для JWT-токенов
export const SECRET_KEY = process.env.JWT_SECRET || 'salary-tracker-secret-key-2026-change-in-production';

// Настройки CORS
export const CORS_OPTIONS = {
  origin: (origin, callback) => {
    // Разрешаем запросы без Origin (например, SSR, Postman, curl, серверные вызовы)
    if (!origin) return callback(null, true);

    if (process.env.CLIENT_URL) {
      const allowed = process.env.CLIENT_URL.split(',').map((s) => s.trim());
      if (allowed.includes('*') || allowed.includes(origin)) {
        return callback(null, true);
      }
    }

    // По умолчанию разрешаем localhost и любые Vercel домены
    if (
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.endsWith('.vercel.app')
    ) {
      return callback(null, true);
    }

    return callback(null, true);
  },
  credentials: true,
};
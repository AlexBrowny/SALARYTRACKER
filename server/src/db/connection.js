import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { createClient } from '@libsql/client';
import { DB_PATH, TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } from '../config/index.js';

let db = null;
let initPromise = null;

/**
 * Адаптер для LibSQL (@libsql/client), реализующий совместимый с sqlite интерфейс:
 * get(sql, params), all(sql, params), run(sql, params), exec(sql), close()
 */
class LibSqlAdapter {
  constructor(client) {
    this.client = client;
  }

  async get(sql, params = []) {
    const res = await this.client.execute({ sql, args: params });
    if (!res.rows || res.rows.length === 0) return undefined;
    return { ...res.rows[0] };
  }

  async all(sql, params = []) {
    const res = await this.client.execute({ sql, args: params });
    return res.rows.map((row) => ({ ...row }));
  }

  async run(sql, params = []) {
    const res = await this.client.execute({ sql, args: params });
    return {
      changes: res.rowsAffected,
      lastID: res.lastInsertRowid !== undefined ? Number(res.lastInsertRowid) : undefined,
    };
  }

  async exec(sql) {
    if (typeof this.client.executeMultiple === 'function') {
      return await this.client.executeMultiple(sql);
    }
    return await this.client.execute(sql);
  }

  async close() {
    if (typeof this.client.close === 'function') {
      await this.client.close();
    }
  }
}

/**
 * Инициализация подключения к базе данных и создание таблиц.
 * Поддерживает как Turso LibSQL (облако), так и локальный SQLite.
 */
export async function initDb() {
  if (db) return db;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      if (TURSO_DATABASE_URL) {
        console.log(`🌐 Подключение к Turso LibSQL: ${TURSO_DATABASE_URL}`);
        const client = createClient({
          url: TURSO_DATABASE_URL,
          authToken: TURSO_AUTH_TOKEN,
          intMode: 'number',
        });
        db = new LibSqlAdapter(client);
      } else {
        console.log(`📁 Подключение к локальной базе SQLite: ${DB_PATH}`);
        db = await open({
          filename: DB_PATH,
          driver: sqlite3.Database,
        });
      }

      // Включаем поддержку внешних ключей (если поддерживается СУБД)
      try {
        await db.exec('PRAGMA foreign_keys = ON;');
      } catch (err) {
        // Игнорируем ошибку pragma в HTTP режиме Turso
      }

      // Создаём таблицу пользователей
      await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          password_hash TEXT NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )
      `);

      // Создаём таблицу доходов (с user_id для привязки к пользователю)
      await db.exec(`
        CREATE TABLE IF NOT EXISTS incomes (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          amount REAL NOT NULL,
          date TEXT NOT NULL,
          category TEXT NOT NULL,
          comment TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
      `);

      // Создаём таблицу расходов (с user_id для привязки к пользователю)
      await db.exec(`
        CREATE TABLE IF NOT EXISTS expenses (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          amount REAL NOT NULL,
          date TEXT NOT NULL,
          category TEXT NOT NULL,
          comment TEXT,
          is_recurring INTEGER DEFAULT 0,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
      `);

      console.log('✅ База данных успешно инициализирована (таблицы users, incomes, expenses)');
      return db;
    } catch (error) {
      db = null;
      initPromise = null;
      console.error('❌ Ошибка инициализации базы данных:', error);
      throw error;
    }
  })();

  return initPromise;
}

/**
 * Получить экземпляр базы данных
 * @returns {Object} Экземпляр базы данных (sqlite или LibSqlAdapter)
 */
export function getDb() {
  if (!db) {
    throw new Error('База данных ещё не инициализирована. Вызовите initDb() перед использованием.');
  }
  return db;
}
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загружаем .env
dotenv.config();

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../salary_tracker.db');
const rawUrl = process.env.TURSO_DATABASE_URL || process.env.LIBSQL_URL || '';
const TURSO_DATABASE_URL = rawUrl.replace(/^libsql:\/\//, 'https://');
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN || process.env.LIBSQL_AUTH_TOKEN;

async function migrate() {
  console.log('🚀 Запуск скрипта миграции данных в Turso...');

  if (!TURSO_DATABASE_URL) {
    console.error('❌ Ошибка: Не указана переменная окружения TURSO_DATABASE_URL (или LIBSQL_URL).');
    console.error('👉 Укажите её в server/.env или перед командой:');
    console.error('   $env:TURSO_DATABASE_URL="libsql://your-db.turso.io"');
    console.error('   $env:TURSO_AUTH_TOKEN="your-token"');
    console.error('   npm run migrate:turso');
    process.exit(1);
  }

  console.log(`📁 Чтение данных из локального файла SQLite: ${DB_PATH}`);
  let localDb;
  try {
    localDb = await open({
      filename: DB_PATH,
      driver: sqlite3.Database,
    });
  } catch (err) {
    console.error('❌ Не удалось открыть локальную базу SQLite:', err.message);
    process.exit(1);
  }

  console.log(`🌐 Подключение к Turso LibSQL: ${TURSO_DATABASE_URL}`);
  const tursoClient = createClient({
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
    intMode: 'number',
  });

  try {
    // 1. Создаём таблицы в Turso, если их ещё нет
    console.log('📋 Проверка и создание схемы таблиц в Turso...');

    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    await tursoClient.execute(`
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

    await tursoClient.execute(`
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

    // 2. Перенос пользователей (users)
    const users = await localDb.all('SELECT * FROM users');
    console.log(`👤 Найдено пользователей в локальной БД: ${users.length}`);

    for (const u of users) {
      await tursoClient.execute({
        sql: `INSERT OR REPLACE INTO users (id, email, name, password_hash, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [u.id, u.email, u.name, u.password_hash, u.created_at, u.updated_at],
      });
    }

    // 3. Перенос доходов (incomes)
    const incomes = await localDb.all('SELECT * FROM incomes');
    console.log(`📈 Найдено записей доходов в локальной БД: ${incomes.length}`);

    for (const inc of incomes) {
      await tursoClient.execute({
        sql: `INSERT OR REPLACE INTO incomes (id, user_id, amount, date, category, comment, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          inc.id,
          inc.user_id,
          inc.amount,
          inc.date,
          inc.category,
          inc.comment,
          inc.created_at,
          inc.updated_at,
        ],
      });
    }

    // 4. Перенос расходов (expenses)
    const expenses = await localDb.all('SELECT * FROM expenses');
    console.log(`📉 Найдено записей расходов в локальной БД: ${expenses.length}`);

    for (const exp of expenses) {
      await tursoClient.execute({
        sql: `INSERT OR REPLACE INTO expenses (id, user_id, amount, date, category, comment, is_recurring, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          exp.id,
          exp.user_id,
          exp.amount,
          exp.date,
          exp.category,
          exp.comment,
          exp.is_recurring ?? 0,
          exp.created_at,
          exp.updated_at,
        ],
      });
    }

    console.log('\n=============================================');
    console.log('🎉 Все данные успешно мигрированы в Turso!');
    console.log(`   - Пользователей: ${users.length}`);
    console.log(`   - Доходов: ${incomes.length}`);
    console.log(`   - Расходов: ${expenses.length}`);
    console.log('=============================================\n');
  } catch (error) {
    console.error('❌ Ошибка во время миграции в Turso:', error);
    process.exit(1);
  } finally {
    await localDb.close();
    tursoClient.close();
  }
}

migrate();

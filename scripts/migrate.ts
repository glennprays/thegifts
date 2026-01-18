import { Pool } from 'pg';
import { readdir, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env file (only in development)
// In production/Kubernetes, env vars come from secrets
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const MIGRATIONS_DIR = join(__dirname, '..', 'migrations');

interface Migration {
  name: string;
  path: string;
}

async function ensureMigrationsTable(pool: Pool): Promise<void> {
  const query = `
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
}

async function getAppliedMigrations(pool: Pool): Promise<Set<string>> {
  const result = await pool.query('SELECT name FROM _migrations ORDER BY id');
  return new Set(result.rows.map((row) => row.name));
}

async function getPendingMigrations(pool: Pool): Promise<Migration[]> {
  const files = await readdir(MIGRATIONS_DIR);
  const upMigrations = files
    .filter((f) => f.endsWith('_up.sql'))
    .sort(); // Alphabetical order ensures numbered migrations run in sequence

  const applied = await getAppliedMigrations(pool);
  const pending: Migration[] = [];

  for (const file of upMigrations) {
    const name = file.replace('_up.sql', '');
    if (!applied.has(name)) {
      pending.push({
        name,
        path: join(MIGRATIONS_DIR, file)
      });
    }
  }

  return pending;
}

async function applyMigration(pool: Pool, migration: Migration): Promise<void> {
  const sql = await readFile(migration.path, 'utf-8');

  // Execute migration and record it in a transaction
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Run the migration SQL
    await client.query(sql);

    // Record the migration
    await client.query(
      'INSERT INTO _migrations (name) VALUES ($1)',
      [migration.name]
    );

    await client.query('COMMIT');
    console.log(`Applied migration: ${migration.name}`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function runMigrations(): Promise<void> {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    console.log('Running database migrations...\n');

    // Ensure migrations tracking table exists
    await ensureMigrationsTable(pool);

    // Get pending migrations
    const pending = await getPendingMigrations(pool);

    if (pending.length === 0) {
      console.log('No pending migrations. Database is up to date.\n');
      return;
    }

    console.log(`Found ${pending.length} pending migration(s):\n`);
    pending.forEach((m) => console.log(`   - ${m.name}`));
    console.log('');

    // Apply each migration
    for (const migration of pending) {
      await applyMigration(pool, migration);
    }

    console.log(`\nSuccessfully applied ${pending.length} migration(s).\n`);
  } catch (error) {
    console.error('\nMigration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migrations
runMigrations();

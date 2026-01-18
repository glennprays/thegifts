import { Pool } from 'pg';
import { readFile } from 'fs/promises';
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

async function getLastMigration(pool: Pool): Promise<{ name: string } | null> {
  const result = await pool.query(
    'SELECT name FROM _migrations ORDER BY id DESC LIMIT 1'
  );
  return result.rows[0] || null;
}

async function rollbackMigration(pool: Pool, migrationName: string): Promise<void> {
  const downFile = join(MIGRATIONS_DIR, `${migrationName}_down.sql`);
  const sql = await readFile(downFile, 'utf-8');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Run the rollback SQL
    await client.query(sql);

    // Remove the migration record
    await client.query('DELETE FROM _migrations WHERE name = $1', [migrationName]);

    await client.query('COMMIT');
    console.log(`✅ Rolled back migration: ${migrationName}`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function runRollback(): Promise<void> {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    console.log('🔄 Rolling back last migration...\n');

    const lastMigration = await getLastMigration(pool);

    if (!lastMigration) {
      console.log('⚠️  No migrations to roll back.\n');
      return;
    }

    console.log(`📋 Rolling back: ${lastMigration.name}\n`);

    await rollbackMigration(pool, lastMigration.name);

    console.log('\n✨ Rollback completed successfully.\n');
  } catch (error) {
    console.error('\n❌ Rollback failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run rollback
runRollback();

import { Pool } from 'pg';
import { readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const MIGRATIONS_DIR = join(__dirname, '..', 'migrations');

async function getMigrationStatus(): Promise<void> {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    // Check if migrations table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = '_migrations'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('⚠️  Migrations table does not exist yet. Run migrations first.\n');
      return;
    }

    // Get applied migrations
    const appliedResult = await pool.query(
      'SELECT name, applied_at FROM _migrations ORDER BY id'
    );
    const appliedMigrations = new Map(
      appliedResult.rows.map((row) => [row.name, row.applied_at])
    );

    // Get all migration files
    const files = await readdir(MIGRATIONS_DIR);
    const allMigrations = files
      .filter((f) => f.endsWith('_up.sql'))
      .map((f) => f.replace('_up.sql', ''))
      .sort();

    console.log('📊 Database Migration Status\n');
    console.log('═'.repeat(60));
    console.log('');

    if (allMigrations.length === 0) {
      console.log('⚠️  No migration files found.\n');
      return;
    }

    let pendingCount = 0;
    let appliedCount = 0;

    for (const migration of allMigrations) {
      const applied = appliedMigrations.get(migration);
      if (applied) {
        console.log(`✅ ${migration}`);
        console.log(`   Applied: ${new Date(applied).toLocaleString()}\n`);
        appliedCount++;
      } else {
        console.log(`⏳ ${migration}`);
        console.log(`   Status: Pending\n`);
        pendingCount++;
      }
    }

    console.log('═'.repeat(60));
    console.log(`Total: ${allMigrations.length} migrations`);
    console.log(`Applied: ${appliedCount}`);
    console.log(`Pending: ${pendingCount}\n`);
  } catch (error) {
    console.error('❌ Error checking migration status:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run status check
getMigrationStatus();

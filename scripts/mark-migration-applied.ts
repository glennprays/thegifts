import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function markMigrationApplied(migrationName: string): Promise<void> {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    // Ensure migrations table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert the migration record
    await pool.query(
      'INSERT INTO _migrations (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
      [migrationName]
    );

    console.log(`✅ Marked migration as applied: ${migrationName}`);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Get migration name from command line argument
const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Usage: tsx scripts/mark-migration-applied.ts <migration_name>');
  process.exit(1);
}

markMigrationApplied(migrationName);

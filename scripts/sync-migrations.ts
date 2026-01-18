import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file (only in development)
// In production/Kubernetes, env vars come from secrets
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

interface MigrationCheck {
  name: string;
  check: (pool: Pool) => Promise<boolean>;
}

const migrationChecks: MigrationCheck[] = [
  {
    name: '001_init_req_table',
    check: async (pool: Pool) => {
      const result = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_name = 'assessment_result'
        );
      `);
      return result.rows[0].exists;
    }
  },
  {
    name: '002_add_short_id',
    check: async (pool: Pool) => {
      const result = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns
          WHERE table_name = 'assessment_result'
          AND column_name = 'short_id'
        );
      `);
      return result.rows[0].exists;
    }
  }
];

async function syncMigrations(): Promise<void> {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    console.log('Syncing migration tracking table with database state...\n');

    // Ensure migrations table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Check each migration
    for (const migration of migrationChecks) {
      const exists = await migration.check(pool);

      if (exists) {
        // Mark migration as applied
        const result = await pool.query(
          'INSERT INTO _migrations (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING name',
          [migration.name]
        );

        if (result.rowCount && result.rowCount > 0) {
          console.log(`Marked as applied: ${migration.name}`);
        } else {
          console.log(`⏭️  Already tracked: ${migration.name}`);
        }
      } else {
        console.log(`⏳ Not applied yet: ${migration.name}`);
      }
    }

    console.log('\n✨ Migration sync completed!\n');
  } catch (error) {
    console.error('\nSync failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run sync
syncMigrations();

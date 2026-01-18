import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import dotenv from 'dotenv';

// Load environment variables from .env file (only in development)
// In production/Kubernetes, env vars come from secrets
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

async function backfillShortIds(): Promise<void> {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    console.log('🔄 Backfilling short_ids for existing records...\n');

    // Get all records without short_id
    const result = await pool.query(
      'SELECT id FROM assessment_result WHERE short_id IS NULL'
    );

    const recordsToUpdate = result.rows;

    if (recordsToUpdate.length === 0) {
      console.log('✨ All records already have short_ids. Nothing to backfill.\n');
      return;
    }

    console.log(`📋 Found ${recordsToUpdate.length} record(s) to backfill.\n`);

    let updated = 0;
    let failed = 0;

    for (const record of recordsToUpdate) {
      try {
        const shortId = nanoid(10);

        await pool.query(
          'UPDATE assessment_result SET short_id = $1 WHERE id = $2',
          [shortId, record.id]
        );

        console.log(`✅ Updated record ${record.id} with short_id: ${shortId}`);
        updated++;
      } catch (error) {
        console.error(`❌ Failed to update record ${record.id}:`, error);
        failed++;
      }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`✨ Backfill completed!`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Failed: ${failed}`);
    console.log(`${'='.repeat(60)}\n`);
  } catch (error) {
    console.error('\n❌ Backfill failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run backfill
backfillShortIds();

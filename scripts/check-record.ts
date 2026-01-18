import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function checkRecord() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    const shortId = process.argv[2] || '_Gmweslu91';

    console.log(`Checking for record with short_id: ${shortId}\n`);

    const result = await pool.query(
      'SELECT id, short_id, name FROM assessment_result WHERE short_id = $1',
      [shortId]
    );

    if (result.rows.length === 0) {
      console.log('No record found with that short_id');

      // Check if it exists as UUID
      const uuidResult = await pool.query(
        'SELECT id, short_id, name FROM assessment_result WHERE id = $1',
        [shortId]
      );

      if (uuidResult.rows.length > 0) {
        console.log('Found as UUID instead:');
        console.log(uuidResult.rows[0]);
      }
    } else {
      console.log('Record found:');
      console.log(result.rows[0]);
    }

    // Show all recent records
    console.log('\nRecent records:');
    const recent = await pool.query(
      'SELECT id, short_id, name, "createdAt" FROM assessment_result ORDER BY "createdAt" DESC LIMIT 5'
    );
    console.table(recent.rows);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkRecord();

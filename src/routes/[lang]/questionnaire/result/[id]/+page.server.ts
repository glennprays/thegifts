import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import db from '$lib/server/db';
import type { CategoryScore } from '$lib/schemas/assesment';

/**
 * Detect if the ID is a UUID or a short_id
 */
function isUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

export const load: PageServerLoad = async ({ params }) => {
  const { id } = params;

  // Determine which column to query based on ID format
  const query = isUUID(id)
    ? 'SELECT name, result, short_id FROM assessment_result WHERE id = $1 LIMIT 1'
    : 'SELECT name, result, short_id FROM assessment_result WHERE short_id = $1 LIMIT 1';

  const { rows } = await db.query(query, [id]);

  if (!rows.length) {
    error(404, 'Not found');
  }

  const row = rows[0];
  const result: CategoryScore[] = row.result;
  return {
    name: row.name,
    result,
    short_id: row.short_id
  };
};

import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
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
    ? 'SELECT name, result, short_id FROM assessment_result WHERE id = ?1 LIMIT 1'
    : 'SELECT name, result, short_id FROM assessment_result WHERE short_id = ?1 LIMIT 1';

  const row = await db().prepare(query).bind(id).first<{
    name: string;
    result: string;
    short_id: string | null;
  }>();

  if (!row) {
    error(404, 'Not found');
  }

  const result: CategoryScore[] =
    typeof row.result === 'string' ? JSON.parse(row.result) : row.result;

  return {
    name: row.name,
    result,
    short_id: row.short_id
  };
};

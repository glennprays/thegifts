import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import db from '$lib/server/db';

export const load: PageServerLoad = async ({ params }) => {
  const { id } = params;

  const { rows } = await db.query(
    'SELECT name, result FROM assessment_result WHERE id = $1',
    [id]
  );

  if (!rows.length) {
    error(404, 'Not found');
  }

  const row = rows[0];
  const result: CategoryScore[] = row.result;
  return {
    name: row.name,
    result
  };
};

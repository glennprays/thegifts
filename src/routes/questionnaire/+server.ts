import { CalculateCategoryScores } from '$lib/utils/category';
import { json } from '@sveltejs/kit';
import db from '$lib/server/db';

// @ts-ignore
export async function POST({ request }) {
  const raw = await request.json();
  if (!raw || typeof raw !== 'object') {
    return json({ error: 'Invalid payload' }, { status: 400 });
  }
  if (!raw.name || typeof raw.name !== 'string') {
    return json({ error: 'Name is required' }, { status: 400 });
  }

  if (!raw.answers || typeof raw.answers !== 'object') {
    return json({ error: 'Answers are required' }, { status: 400 });
  }

  const name = raw.name;

  const data: AnswerMap = Object.fromEntries(
    Object.entries(raw.answers).map(([key, value]) => [Number(key), Number(value)])
  );

  const results = CalculateCategoryScores(data);


  try {
    const query = `
      INSERT INTO assessment_result (name, answer, result)
      VALUES ($1, $2, $3)
      RETURNING id
    `;
    const values = [name, JSON.stringify(data), JSON.stringify(results)];
    const { rows } = await db.query(query, values);
    return json({ success: true, id: rows[0].id });
  } catch (err) {
    console.error('DB save error', err);
    return json({ error: 'Failed to save' }, { status: 500 });
  }
}

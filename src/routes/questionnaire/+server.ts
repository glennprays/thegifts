import { CalculateCategoryScores } from '$lib/utils/category';
import { json } from '@sveltejs/kit';
import db from '$lib/server/db';
import { nanoid } from 'nanoid';

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
    const shortId = nanoid(10);
    const query = `
      INSERT INTO assessment_result (name, answer, result, short_id)
      VALUES ($1, $2, $3, $4)
      RETURNING short_id
    `;
    const values = [name, JSON.stringify(data), JSON.stringify(results), shortId];
    const { rows } = await db.query(query, values);
    return json({ success: true, id: rows[0].short_id });
  } catch (err) {
    console.error('DB save error', err);
    return json({ error: 'Failed to save' }, { status: 500 });
  }
}

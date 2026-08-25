import { CalculateCategoryScores } from '$lib/utils/category';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { nanoid } from 'nanoid';
import type { AnswerMap } from '$lib/schemas/assesment';
import questionMap from '$lib/data/category-question.json';

const VALID_QUESTION_IDS = new Set(
  Object.values(questionMap).flat()
);

export const POST: RequestHandler = async ({ request }) => {
  const raw = await request.json();
  if (!raw || typeof raw !== 'object') {
    return json({ error: 'Invalid payload' }, { status: 400 });
  }
  if (!raw.name || typeof raw.name !== 'string') {
    return json({ error: 'Name is required' }, { status: 400 });
  }

  const name = raw.name.trim();
  if (name.length === 0 || name.length > 100) {
    return json({ error: 'Name must be 1-100 characters' }, { status: 400 });
  }

  if (!raw.answers || typeof raw.answers !== 'object') {
    return json({ error: 'Answers are required' }, { status: 400 });
  }

  const entries = Object.entries(raw.answers);
  if (entries.length !== VALID_QUESTION_IDS.size) {
    return json({ error: 'All questions must be answered' }, { status: 400 });
  }

  for (const [key, value] of entries) {
    const qId = Number(key);
    const answer = Number(value);
    if (!VALID_QUESTION_IDS.has(qId) || !Number.isInteger(answer) || answer < 1 || answer > 5) {
      return json({ error: 'Invalid answer data' }, { status: 400 });
    }
  }

  const data: AnswerMap = Object.fromEntries(
    entries.map(([key, value]) => [Number(key), Number(value)])
  );

  const results = CalculateCategoryScores(data);

  try {
    const shortId = nanoid(10);
    const query = `
      INSERT INTO assessment_result (name, answer, result, short_id)
      VALUES (?1, ?2, ?3, ?4)
      RETURNING short_id
    `;
    const row = await db()
      .prepare(query)
      .bind(name, JSON.stringify(data), JSON.stringify(results), shortId)
      .first<{ short_id: string }>();
    return json({ success: true, id: row!.short_id });
  } catch (err) {
    console.error('DB save error', err);
    return json({ error: 'Failed to save' }, { status: 500 });
  }
};

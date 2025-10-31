import prisma from '$lib/server/prisma';
import { CalculateCategoryScores } from '$lib/utils/category';
import { json } from '@sveltejs/kit';
import type { Prisma } from '../../../prisma/src/generated/prisma/client';

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
    const safeAnswers = JSON.parse(JSON.stringify(data));
    const safeResults = JSON.parse(JSON.stringify(results));
    const saved = await prisma.assessmentResult.create({
      data: {
        name,
        answer: safeAnswers,
        result: safeResults
      }
    })
    return json({ success: true, id: saved.id, createdAt: saved.createdAt });
  } catch (err) {
    console.error('DB save error', err);
    return json({ error: 'Failed to save' }, { status: 500 });
  }
}

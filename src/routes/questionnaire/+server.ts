import { CalculateCategoryScores } from '$lib/utils/category';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  const raw = await request.json();
  const data: AnswerMap = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [Number(key), Number(value)])
  );
  const result = CalculateCategoryScores(data);
  return json({
    message: 'Data processed successfully',
    result: result
  });
}

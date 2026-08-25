import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/server/db';
import { generateStoriesImage } from '$lib/server/image-generator';
import { getCategoryExplanation } from '$lib/utils/category-explanation';
import type { CategoryScore } from '$lib/schemas/assesment';

function isUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

const imageCache = new Map<string, Buffer>();
const MAX_CACHE_SIZE = 50;

export const GET: RequestHandler = async ({ params }) => {
  const { id } = params;

  const cacheKey = id;
  const cached = imageCache.get(cacheKey);
  if (cached) {
    return new Response(new Uint8Array(cached), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400'
      }
    });
  }

  const query = isUUID(id)
    ? 'SELECT name, result, short_id FROM assessment_result WHERE id = $1 LIMIT 1'
    : 'SELECT name, result, short_id FROM assessment_result WHERE short_id = $1 LIMIT 1';

  const { rows } = await db.query(query, [id]);

  if (!rows.length) {
    error(404, 'Not found');
  }

  const row = rows[0];
  const result: CategoryScore[] = row.result;

  const topGifts = result.slice(0, 3).map((item, index) => {
    const explanation = getCategoryExplanation(item.category, 'en');
    return {
      name: explanation?.name || item.category,
      score: item.score,
      category: item.category,
      description: index === 0
        ? explanation?.description
        : undefined
    };
  });

  const topGiftExplanation = getCategoryExplanation(result[0]?.category, 'en');
  const topGiftPracticals = (topGiftExplanation?.practical_applications || []).slice(0, 4);

  try {
    const imageBuffer = await generateStoriesImage({
      name: row.name,
      topGifts,
      topGiftPracticals
    });

    if (imageCache.size >= MAX_CACHE_SIZE) {
      const firstKey = imageCache.keys().next().value;
      if (firstKey) imageCache.delete(firstKey);
    }
    imageCache.set(cacheKey, imageBuffer);

    return new Response(new Uint8Array(imageBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400'
      }
    });
  } catch (err) {
    console.error('Failed to generate image:', err);
    error(500, 'Failed to generate image');
  }
};

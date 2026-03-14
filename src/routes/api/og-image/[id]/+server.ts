import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/server/db';
import { generateStoriesImage } from '$lib/server/image-generator';
import { getCategoryExplanation } from '$lib/utils/category-explanation';

/**
 * Detect if the ID is a UUID or a short_id
 */
function isUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

interface CategoryScore {
  category: string;
  score: number;
}

export const GET: RequestHandler = async ({ params, request }) => {
  const { id } = params;

  // Determine which column to query based on ID format
  const query = isUUID(id)
    ? 'SELECT name, result, short_id FROM assessment_result WHERE id = $1'
    : 'SELECT name, result, short_id FROM assessment_result WHERE short_id = $1';

  const { rows } = await db.query(query, [id]);

  if (!rows.length) {
    error(404, 'Not found');
  }

  const row = rows[0];
  const result: CategoryScore[] = row.result;

  // Detect locale from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') || '';
  const locale: 'en' | 'id' = acceptLanguage.toLowerCase().includes('id') ? 'id' : 'en';

  // Get top 3 gifts
  const topGifts = result.slice(0, 3).map((item) => {
    const explanation = getCategoryExplanation(item.category, locale);
    return {
      name: explanation?.name || item.category,
      score: item.score
    };
  });

  // Get practical applications for the top gift
  const topGiftExplanation = getCategoryExplanation(result[0]?.category, locale);
  const topGiftPracticals = topGiftExplanation?.practical_applications || [];

  try {
    const imageBuffer = await generateStoriesImage({
      name: row.name,
      topGifts,
      topGiftPracticals,
      locale
    });

    return new Response(new Uint8Array(imageBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
      }
    });
  } catch (err) {
    console.error('Failed to generate image:', err);
    error(500, 'Failed to generate image');
  }
};

import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getCategoryExplanation, categoryExists } from '$lib/utils/category-explanation';

export const load: PageServerLoad = async ({ params }) => {
  const { category, lang } = params;

  // Validate category
  if (!categoryExists(category)) {
    error(404, 'Category not found');
  }

  // Load category data
  const categoryData = getCategoryExplanation(category, lang as 'en' | 'id');

  if (!categoryData) {
    error(404, 'Category not found');
  }

  return {
    category: categoryData
  };
};

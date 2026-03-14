import type { CategoryExplanation, CategoryKey } from '$lib/schemas/category';
import categoryExplanationsData from '$lib/data/category-explanation.json';

// Type assertion for imported JSON
const categoryExplanations = categoryExplanationsData as CategoryExplanation[];

/**
 * Get explanation for a specific category in the given locale
 * @param key Category key (e.g., "administration", "faith")
 * @param locale Language code ("en" or "id")
 * @returns Category explanation object with localized content, or null if not found
 */
export function getCategoryExplanation(
  key: string,
  locale: 'en' | 'id'
): {
  key: string;
  name: string;
  description: string;
  characteristics: string[];
  biblical_references: { verse: string; text: string }[];
  practical_applications: string[];
} | null {
  const category = categoryExplanations.find((c) => c.key === key);

  if (!category) {
    return null;
  }

  return {
    key: category.key,
    name: locale === 'en' ? category.name_en : category.name_id,
    description: locale === 'en' ? category.description_en : category.description_id,
    characteristics: locale === 'en' ? category.characteristics_en : category.characteristics_id,
    biblical_references: category.biblical_references.map(ref => ({
      verse: locale === 'en' ? ref.verse_en : ref.verse_id,
      text: locale === 'en' ? ref.text_en : ref.text_id
    })),
    practical_applications:
      locale === 'en' ? category.practical_applications_en : category.practical_applications_id
  };
}

/**
 * Get all category explanations in the given locale
 * @param locale Language code ("en" or "id")
 * @returns Array of all category explanations with localized content
 */
export function getAllCategoryExplanations(locale: 'en' | 'id') {
  return categoryExplanations.map((category) => ({
    key: category.key,
    name: locale === 'en' ? category.name_en : category.name_id,
    description: locale === 'en' ? category.description_en : category.description_id,
    characteristics: locale === 'en' ? category.characteristics_en : category.characteristics_id,
    biblical_references: category.biblical_references.map(ref => ({
      verse: locale === 'en' ? ref.verse_en : ref.verse_id,
      text: locale === 'en' ? ref.text_en : ref.text_id
    })),
    practical_applications:
      locale === 'en' ? category.practical_applications_en : category.practical_applications_id
  }));
}

/**
 * Check if a category key is valid
 * @param key Category key to validate
 * @returns True if the category exists
 */
export function categoryExists(key: string): boolean {
  return categoryExplanations.some((c) => c.key === key);
}

/**
 * Get all valid category keys
 * @returns Array of all category keys
 */
export function getAllCategoryKeys(): CategoryKey[] {
  return categoryExplanations.map((c) => c.key) as CategoryKey[];
}

/**
 * Biblical reference with bilingual support
 */
export interface BiblicalReference {
  verse_en: string; // e.g., "1 Corinthians 12:28"
  verse_id: string; // e.g., "1 Korintus 12:28"
  text_en: string; // e.g., "And God has appointed these in the church..."
  text_id: string; // e.g., "Dan Allah mengangkat orang-orang tertentu..."
}

/**
 * Localized biblical reference for display
 */
export interface LocalizedBiblicalReference {
  verse: string; // Localized verse reference
  text: string; // Localized verse text
}

/**
 * Complete category explanation with bilingual support
 */
export interface CategoryExplanation {
  key: string; // e.g., "administration", "discernment"
  name_en: string;
  name_id: string;
  description_en: string;
  description_id: string;
  characteristics_en: string[];
  characteristics_id: string[];
  biblical_references: BiblicalReference[];
  practical_applications_en: string[];
  practical_applications_id: string[];
}

/**
 * Valid category keys from category-question.json
 */
export type CategoryKey =
  | 'administration'
  | 'discernment'
  | 'evangelist'
  | 'exhortation'
  | 'faith'
  | 'giving'
  | 'healing'
  | 'helps'
  | 'hospitality'
  | 'intercession'
  | 'knowledge'
  | 'leadership'
  | 'mercy'
  | 'missionary'
  | 'pastor'
  | 'service'
  | 'teacher'
  | 'wisdom';

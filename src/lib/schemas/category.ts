/**
 * Biblical reference with verse citation and text
 */
export interface BiblicalReference {
  verse: string; // e.g., "Romans 12:6-8"
  text: string; // e.g., "Having gifts that differ..."
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

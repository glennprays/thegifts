export interface AnswerMap {
  [id: number]: number;
}
export interface RatingOption {
  text_en: string;
  text_id: string;
  rating: number;
  color: string;
  bg: string;
  checked: string;
}

export type AssesmentResult = { category: string; score: number }[];

export interface CategoryScore {
  category: string;
  score: number;
}

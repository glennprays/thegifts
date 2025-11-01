interface AnswerMap {
  [id: number]: number;
}
interface RatingOption {
  text_en: string;
  text_id: string;
  rating: number;
  color: string;
  bg: string;
  checked: string;
}

type AssesmentResult = { category: string; score: number }[];

interface CategoryScore {
  category: string;
  score: number;
}

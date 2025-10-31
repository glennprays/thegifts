import questionMap from '$lib/data/category-question.json';

/**
 * Calculate total scores for each category
 * @param answers - key-value object of questionId: value
 * @returns Sorted array of categories by descending score
 */
export function CalculateCategoryScores(answers: AnswerMap): AssesmentResult {
  const results: { [key: string]: number } = {};

  for (const [category, ids] of Object.entries(questionMap)) {
    const total = (ids as number[]).reduce((sum, id) => {
      let value = answers[id] ?? 1;
      value = Math.max(1, Math.min(5, value));
      return sum + value;
    }, 0);

    results[category] = total;
  }

  return Object.entries(results)
    .map(([category, score]) => ({ category, score }))
    .sort((a, b) => b.score - a.score);
}

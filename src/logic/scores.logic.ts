export const blackjackScore = 21.5;
export const bustScore = 22;

export const getEffectiveScore = (score: number) => {
  return score > blackjackScore ? bustScore : score;
};

export const getHighestScore = (scores: number[], cardsNumber?: number) => {
  return isBlackjack(scores, cardsNumber) ? blackjackScore : scores[scores.length - 1];
};

export const getScores = (values1: number[], values2: number[]) => {
  const allScores = getUniqueScores(values1, values2);
  const validScores = allScores.filter((x) => x <= 21);
  const scores = validScores.length > 0 ? validScores : allScores;
  return scores;
};

export const getUniqueScores = (values1: number[], values2: number[]) => {
  const allValues = values1.reduce<number[]>(
    (reduced, value1) => [...reduced, ...values2.map((value2) => value1 + value2)],
    [],
  );
  return [...new Set(allValues)].sort((a, b) => a - b);
};

export const isBlackjack = (scores: number[], cardsNumber?: number) => {
  return cardsNumber === 2 && scores.includes(21);
};

export const blackjackScore = 21.5;
export const bustScore = 22;

export const getEffectiveScore = (scores: number[]) => {
  return scores[scores.length - 1];
};

export const getScores = (
  values1: number[],
  values2: number[],
  cardsNumber: number | undefined,
) => {
  const allScores = getUniqueScores(values1, values2);
  const validScores = allScores.filter((x) => x < bustScore);
  return validScores.length > 0
    ? cardsNumber && isBlackjack(validScores, cardsNumber)
      ? [blackjackScore]
      : validScores
    : [bustScore];
};

const getUniqueScores = (values1: number[], values2: number[]) => {
  const allValues = values1.reduce<number[]>(
    (reduced, value1) => [...reduced, ...values2.map((value2) => value1 + value2)],
    [],
  );
  return [...new Set(allValues)].sort((a, b) => a - b);
};

const isBlackjack = (scores: number[], cardsNumber: number) => {
  return cardsNumber === 2 && scores.includes(21);
};

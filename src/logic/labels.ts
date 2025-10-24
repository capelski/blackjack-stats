import { blackjackScore, getHighestScore } from './scores';

export const blackjackLabel = 'BJ';
export const bustLabel = '22+';
export const softScoresSeparator = '/';

export const getScoresLabel = (scores: number[], cardsNumber?: number) => {
  const score = getHighestScore(scores, cardsNumber);
  return score > blackjackScore
    ? bustLabel
    : score === blackjackScore
    ? blackjackLabel
    : scores.join(softScoresSeparator);
};

export const sortByScoreLabels = (a: string, b: string) => {
  const aParts = a.split(softScoresSeparator);
  const bParts = b.split(softScoresSeparator);
  const aValue = parseInt(aParts[aParts.length - 1]);
  const bValue = parseInt(bParts[bParts.length - 1]);
  return aValue - bValue;
};

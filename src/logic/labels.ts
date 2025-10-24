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

export const getSortedApplicableLabels = (keys: string[]) => {
  return keys
    .filter((key) => key !== bustLabel && key !== blackjackLabel && !String(key).includes('21'))
    .sort((a, b) => {
      const aIsSoft = a.includes(softScoresSeparator);
      const bIsSoft = b.includes(softScoresSeparator);
      const aParts = a.split(softScoresSeparator);
      const bParts = b.split(softScoresSeparator);
      const aValue = parseInt(aParts[aParts.length - 1]);
      const bValue = parseInt(bParts[bParts.length - 1]);
      return aIsSoft && !bIsSoft ? -1 : !aIsSoft && bIsSoft ? 1 : aValue - bValue;
    });
};

export const sortByScoreLabels = (a: string, b: string) => {
  const aParts = a.split(softScoresSeparator);
  const bParts = b.split(softScoresSeparator);
  const aValue = parseInt(aParts[aParts.length - 1]);
  const bValue = parseInt(bParts[bParts.length - 1]);
  return aValue - bValue;
};

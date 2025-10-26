import { Action } from '../enums/action.enum';
import { blackjackScore, getHighestScore } from './scores';

export const blackjackLabel = 'BJ';
export const bustLabel = '22+';
export const softScoresSeparator = '/';

export const initialPairLabels = [
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  blackjackLabel,
  `2${softScoresSeparator}12`,
  `3${softScoresSeparator}13`,
  `4${softScoresSeparator}14`,
  `5${softScoresSeparator}15`,
  `6${softScoresSeparator}16`,
  `7${softScoresSeparator}17`,
  `8${softScoresSeparator}18`,
  `9${softScoresSeparator}19`,
  `10${softScoresSeparator}20`,
];

export const actionableLabels = initialPairLabels.filter((label) => label !== blackjackLabel);

export const getAbbreviatedAction = (action: Action) => {
  return action === Action.hit ? 'H' : 'S';
};

export const getScoresLabel = (scores: number[], cardsNumber?: number) => {
  const score = getHighestScore(scores, cardsNumber);
  return score > blackjackScore
    ? bustLabel
    : score === blackjackScore
    ? blackjackLabel
    : scores.join(softScoresSeparator);
};

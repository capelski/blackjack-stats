import { Action } from '../enums/action.enum';
import { blackjackScore, getEffectiveScore } from './scores.logic';

export const blackjackLabel = 'BJ';
export const bustLabel = '22+';
export const softScoresSeparator = '/';

export const getInitialPairLabels = () => {
  return [
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
};

export const getActionableLabels = () => {
  return getInitialPairLabels().filter((label) => label !== blackjackLabel);
};

const abbreviatedActions: { [action in Action]: string } = {
  double: 'D',
  hit: 'H',
  stand: 'S',
};

export const getAbbreviatedAction = (action: Action) => {
  return abbreviatedActions[action];
};

export const getScoresLabel = (scores: number[]) => {
  const score = getEffectiveScore(scores);
  return score > blackjackScore
    ? bustLabel
    : score === blackjackScore
    ? blackjackLabel
    : scores.join(softScoresSeparator);
};

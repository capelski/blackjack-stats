import { Action } from '../enums/action.enum';
import { LabelOptions } from '../types/label.type';
import { blackjackScore, getEffectiveScore } from './scores.logic';

export const blackjackLabel = 'BJ';
export const bustLabel = '22+';
export const softScoresSeparator = '/';

export const getInitialPairLabels = (splitting?: boolean) => {
  const commonHardScores = [
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
  ];

  const commonSoftScores = [
    `3${softScoresSeparator}13`,
    `4${softScoresSeparator}14`,
    `5${softScoresSeparator}15`,
    `6${softScoresSeparator}16`,
    `7${softScoresSeparator}17`,
    `8${softScoresSeparator}18`,
    `9${softScoresSeparator}19`,
    `10${softScoresSeparator}20`,
  ];

  return splitting
    ? [
        ...commonHardScores,
        ...commonSoftScores,
        'A,A',
        '2,2',
        '3,3',
        '4,4',
        '5,5',
        '6,6',
        '7,7',
        '8,8',
        '9,9',
        '10,10',
        'J,J',
        'Q,Q',
        'K,K',
      ]
    : [4, ...commonHardScores, `2${softScoresSeparator}12`, ...commonSoftScores];
};

export const getActionableLabels = (splitting?: boolean) => {
  return getInitialPairLabels(splitting).filter((label) => label !== blackjackLabel);
};

const abbreviatedActions: { [action in Action]: string } = {
  [Action.double]: 'D',
  [Action.hit]: 'H',
  [Action.split]: 'P',
  [Action.stand]: 'S',
};

export const getAbbreviatedAction = (action: Action) => {
  return abbreviatedActions[action];
};

export const getScoresLabel = (scores: number[], options: LabelOptions = {}) => {
  const score = getEffectiveScore(scores);
  return score > blackjackScore
    ? bustLabel
    : score === blackjackScore
    ? blackjackLabel
    : options.splitCard
    ? `${options.splitCard},${options.splitCard}`
    : scores.join(softScoresSeparator);
};

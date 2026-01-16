import { Action } from '../enums/action.enum';
import { LabelOptions } from '../types/label.type';
import { getPlayerHands } from './hands.logic';
import { blackjackScore, getEffectiveScore } from './scores.logic';

export const blackjackLabel = 'BJ';
export const bustLabel = '22+';
export const softScoresSeparator = '/';
export const splitScoresSeparator = ',';

export type InitialPairsOptions = {
  excludeFinalHands?: boolean;
  /** When set to true the labels will include non-initial, visible and non-bust hands */
  includeNonInitialHands?: boolean;
  splitting?: boolean;
};

export const getInitialPairLabels = (options: InitialPairsOptions = {}) => {
  return getPlayerHands(options.splitting)
    .filter(hand => {
      return (
        !hand.isVirtualHand &&
        !(hand.isFinal && options.excludeFinalHands) &&
        (hand.initialProbability || options.includeNonInitialHands)
      );
    })
    .sort((a, b) => a.sortIndex - b.sortIndex)
    .map(hand => hand.label);
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
    ? `${options.splitCard}${splitScoresSeparator}${options.splitCard}`
    : scores.join(softScoresSeparator);
};

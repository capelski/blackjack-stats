import { Action, AppliedAction, Continue, End } from '../enums/action.enum';
import { LabelOptions } from '../types/label.type';
import { blackjackScore, getEffectiveScore } from './scores.logic';

export const blackjackLabel = 'BJ';
export const bustLabel = '22+';
export const softScoresSeparator = '/';
export const splitScoresSeparator = ',';

const abbreviatedActions: { [action in AppliedAction]: string } = {
  [Action.double]: 'D',
  [Action.hit]: 'H',
  [Action.split]: 'P',
  [Action.stand]: 'S',
  // Unused, but included for completeness
  [Continue]: 'C',
  [End]: 'E',
};

export const getAbbreviatedAction = (action: AppliedAction) => {
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

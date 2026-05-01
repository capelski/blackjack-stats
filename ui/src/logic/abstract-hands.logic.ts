import {
  blackjackLabel,
  bustLabel,
  softScoresSeparator,
  splitScoresSeparator,
} from '../models/labels.model';
import { blackjackScore, bustScore } from '../models/scores.model';
import { AbstractHand, AbstractHandSeed } from '../types/hand.type';
import { Rules } from '../types/rules.type';
import { canDouble } from './rules.logic';
import { getEffectiveScore } from './scores.logic';

/** The returned abstract hands are sorted so dependencies to other abstract hands are always resolved.
 * Example: Computing the expected results for '12' requires the expected results for '16' */
export const getAbstractHands = (rules: Rules): AbstractHand[] => {
  const handSeeds: AbstractHandSeed[] = [
    { label: bustLabel, scores: [bustScore], isNonActionable: true },
    { label: blackjackLabel, scores: [blackjackScore], isNonActionable: true },
    { label: '21', scores: [21], isNonActionable: true },
    { label: '11/21', scores: [11, 21], isNonActionable: true },
    { label: '20', scores: [20] },
    { label: '19', scores: [19] },
    { label: '18', scores: [18] },
    { label: '17', scores: [17] },
    { label: '16', scores: [16] },
    { label: '15', scores: [15] },
    { label: '14', scores: [14] },
    { label: '13', scores: [13] },
    { label: '12', scores: [12] },
    { label: '11', scores: [11] },
    { label: '10', scores: [10] },
    { label: `10${softScoresSeparator}20`, scores: [10, 20] },
    { label: '9', scores: [9] },
    { label: `9${softScoresSeparator}19`, scores: [9, 19] },
    { label: '8', scores: [8] },
    { label: `8${softScoresSeparator}18`, scores: [8, 18] },
    { label: '7', scores: [7] },
    { label: `7${softScoresSeparator}17`, scores: [7, 17] },
    { label: '6', scores: [6] },
    { label: `6${softScoresSeparator}16`, scores: [6, 16] },
    { label: '5', scores: [5] },
    { label: `5${softScoresSeparator}15`, scores: [5, 15] },
    { label: '4', scores: [4], isNonActionable: rules.splitting },
    { label: `4${softScoresSeparator}14`, scores: [4, 14] },
    { label: `3${softScoresSeparator}13`, scores: [3, 13] },
    {
      isNonActionable: rules.splitting,
      label: `2${softScoresSeparator}12`,
      scores: [2, 12],
    },
    ...(rules.splitting
      ? [
          { label: '3', scores: [3], isNonActionable: true },
          { label: '2', scores: [2], isNonActionable: true },
          { label: 'A', scores: [1, 11], isNonActionable: true },
          { label: `A${splitScoresSeparator}A`, scores: [2, 12], splitLabel: 'A' },
          { label: `2${splitScoresSeparator}2`, scores: [4], splitLabel: '2' },
          { label: `3${splitScoresSeparator}3`, scores: [6], splitLabel: '3' },
          { label: `4${splitScoresSeparator}4`, scores: [8], splitLabel: '4' },
          { label: `5${splitScoresSeparator}5`, scores: [10], splitLabel: '5' },
          { label: `6${splitScoresSeparator}6`, scores: [12], splitLabel: '6' },
          { label: `7${splitScoresSeparator}7`, scores: [14], splitLabel: '7' },
          { label: `8${splitScoresSeparator}8`, scores: [16], splitLabel: '8' },
          { label: `9${splitScoresSeparator}9`, scores: [18], splitLabel: '9' },
          { label: `10${splitScoresSeparator}10`, scores: [20], splitLabel: '10' },
          { label: `J${splitScoresSeparator}J`, scores: [20], splitLabel: '10' },
          { label: `Q${splitScoresSeparator}Q`, scores: [20], splitLabel: '10' },
          { label: `K${splitScoresSeparator}K`, scores: [20], splitLabel: '10' },
        ]
      : []),
  ];

  return handSeeds.map<AbstractHand>(seed => {
    return {
      canDouble: !seed.isNonActionable && canDouble(seed.scores, 2, rules.doubling),
      canSplit: !!rules.splitting && !!seed.splitLabel,
      effectiveScore: getEffectiveScore(seed.scores),
      isActionable: !seed.isNonActionable,
      label: seed.label,
      scores: seed.scores,
    };
  });
};

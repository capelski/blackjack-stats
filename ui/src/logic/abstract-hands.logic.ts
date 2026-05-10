import { cards } from '../models/cards.model';
import { blackjackScore, bustScore } from '../models/scores.model';
import { AbstractHand, AbstractHandSeed } from '../types/hand.type';
import { Rules } from '../types/rules.type';
import { getBetMultiplier } from './bet-multiplier.logic';
import { getLabelFromCards, getLabelFromScores } from './labels.logic';
import { canAction, canDouble, canSplit } from './rules.logic';
import { getEffectiveScore } from './scores.logic';

const postSplit = {
  isHidden: true,
  isPostSplit: true,
};

const postSplitAces = {
  ...postSplit,
  isPostSplitAces: true,
};

/** The returned abstract hands are sorted so dependencies to other abstract hands are always resolved.
 * Example: Computing the expected results for '12' requires the expected results for '16' */
export const getAbstractHands = (rules: Rules): AbstractHand[] => {
  const handSeeds: AbstractHandSeed[] = [
    /** Regular hands */
    { label: '22+', scores: [bustScore] },
    { label: 'BJ', scores: [blackjackScore] },
    { label: '21', scores: [21] },
    { label: '11/21', scores: [11, 21] },
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
    { label: '10/20', scores: [10, 20] },
    { label: '9', scores: [9] },
    { label: '9/19', scores: [9, 19] },
    { label: '8', scores: [8] },
    { label: '8/18', scores: [8, 18] },
    { label: '7', scores: [7] },
    { label: '7/17', scores: [7, 17] },
    { label: '6', scores: [6] },
    { label: '6/16', scores: [6, 16] },
    { label: '5', scores: [5] },
    { label: '5/15', scores: [5, 15] },
    { label: '4', scores: [4], isHidden: rules.splitting },
    { label: '4/14', scores: [4, 14] },
    { label: '3/13', scores: [3, 13] },
    { label: '2/12', scores: [2, 12], isHidden: rules.splitting },
    ...(rules.splitting
      ? [
          /** Post-split hands */
          { label: '22+ (S)', scores: [bustScore], ...postSplit },
          { label: 'BJ (S)', scores: [blackjackScore], ...postSplit },
          { label: '21 (S)', scores: [21], ...postSplit },
          { label: '11/21 (S)', scores: [11, 21], ...postSplit },
          { label: '20 (S)', scores: [20], ...postSplit },
          { label: '19 (S)', scores: [19], ...postSplit },
          { label: '18 (S)', scores: [18], ...postSplit },
          { label: '17 (S)', scores: [17], ...postSplit },
          { label: '16 (S)', scores: [16], ...postSplit },
          { label: '15 (S)', scores: [15], ...postSplit },
          { label: '14 (S)', scores: [14], ...postSplit },
          { label: '13 (S)', scores: [13], ...postSplit },
          { label: '12 (S)', scores: [12], ...postSplit },
          { label: '11 (S)', scores: [11], ...postSplit },
          { label: '10 (S)', scores: [10], ...postSplit },
          { label: '10/20 (S)', scores: [10, 20], ...postSplit },
          { label: '9 (S)', scores: [9], ...postSplit },
          { label: '9/19 (S)', scores: [9, 19], ...postSplit },
          { label: '8 (S)', scores: [8], ...postSplit },
          { label: '8/18 (S)', scores: [8, 18], ...postSplit },
          { label: '7 (S)', scores: [7], ...postSplit },
          { label: '7/17 (S)', scores: [7, 17], ...postSplit },
          { label: '6 (S)', scores: [6], ...postSplit },
          { label: '6/16 (S)', scores: [6, 16], ...postSplit },
          { label: '5 (S)', scores: [5], ...postSplit },
          { label: '5/15 (S)', scores: [5, 15], ...postSplit },
          { label: '4 (S)', scores: [4], ...postSplit },
          { label: '4/14 (S)', scores: [4, 14], ...postSplit },
          { label: '3/13 (S)', scores: [3, 13], ...postSplit },
          { label: '2/12 (S)', scores: [2, 12], ...postSplit },
          ...(rules.hitSplitAces
            ? [{ label: '1/11 (S)', scores: [1, 11], ...postSplit }]
            : [
                /** Post-split aces hands */
                { label: '22+ (S,A)', scores: [bustScore], ...postSplitAces },
                { label: 'BJ (S,A)', scores: [blackjackScore], ...postSplitAces },
                { label: '21 (S,A)', scores: [21], ...postSplitAces },
                { label: '11/21 (S,A)', scores: [11, 21], ...postSplitAces },
                { label: '20 (S,A)', scores: [20], ...postSplitAces },
                { label: '19 (S,A)', scores: [19], ...postSplitAces },
                { label: '18 (S,A)', scores: [18], ...postSplitAces },
                { label: '17 (S,A)', scores: [17], ...postSplitAces },
                { label: '16 (S,A)', scores: [16], ...postSplitAces },
                { label: '15 (S,A)', scores: [15], ...postSplitAces },
                { label: '14 (S,A)', scores: [14], ...postSplitAces },
                { label: '13 (S,A)', scores: [13], ...postSplitAces },
                { label: '12 (S,A)', scores: [12], ...postSplitAces },
                { label: '11 (S,A)', scores: [11], ...postSplitAces },
                { label: '10 (S,A)', scores: [10], ...postSplitAces },
                { label: '10/20 (S,A)', scores: [10, 20], ...postSplitAces },
                { label: '9 (S,A)', scores: [9], ...postSplitAces },
                { label: '9/19 (S,A)', scores: [9, 19], ...postSplitAces },
                { label: '8 (S,A)', scores: [8], ...postSplitAces },
                { label: '8/18 (S,A)', scores: [8, 18], ...postSplitAces },
                { label: '7 (S,A)', scores: [7], ...postSplitAces },
                { label: '7/17 (S,A)', scores: [7, 17], ...postSplitAces },
                { label: '6 (S,A)', scores: [6], ...postSplitAces },
                { label: '6/16 (S,A)', scores: [6, 16], ...postSplitAces },
                { label: '5 (S,A)', scores: [5], ...postSplitAces },
                { label: '5/15 (S,A)', scores: [5, 15], ...postSplitAces },
                { label: '4 (S,A)', scores: [4], ...postSplitAces },
                { label: '4/14 (S,A)', scores: [4, 14], ...postSplitAces },
                { label: '3/13 (S,A)', scores: [3, 13], ...postSplitAces },
                { label: '2/12 (S,A)', scores: [2, 12], ...postSplitAces },
                { label: '1/11 (S,A)', scores: [1, 11], ...postSplitAces },
              ]),
          /** Single card post-split hands */
          { label: '3 (S)', scores: [3], ...postSplit },
          { label: '2 (S)', scores: [2], ...postSplit },
          /** Split hands */
          {
            label: 'A,A',
            scores: [2, 12],
            postSplitLabel: rules.hitSplitAces ? '1/11 (S)' : '1/11 (S,A)',
          },
          { label: '2,2', scores: [4], postSplitLabel: '2 (S)' },
          { label: '3,3', scores: [6], postSplitLabel: '3 (S)' },
          { label: '4,4', scores: [8], postSplitLabel: '4 (S)' },
          { label: '5,5', scores: [10], postSplitLabel: '5 (S)' },
          { label: '6,6', scores: [12], postSplitLabel: '6 (S)' },
          { label: '7,7', scores: [14], postSplitLabel: '7 (S)' },
          { label: '8,8', scores: [16], postSplitLabel: '8 (S)' },
          { label: '9,9', scores: [18], postSplitLabel: '9 (S)' },
          { label: '10,10', scores: [20], postSplitLabel: '10 (S)' },
        ]
      : []),
  ];

  return handSeeds.map<AbstractHand>(seed => {
    const isPostSplit = !!seed.isPostSplit;
    const isPostSplitAces = !!seed.isPostSplitAces;
    const effectiveScore = getEffectiveScore(seed.scores);
    const splitCardSymbol = seed.postSplitLabel && seed.label.split(',')[0];

    /** Check the label logic is consistent with the labels declared above.
     * The label could be driven for each abstract hand seed, but I find it
     * easier to reason with an explicit list of labels */
    validateLabel(rules, seed);

    const isActionable = canAction(rules, {
      isPostDouble: false,
      isPostSplit,
      isPostSplitAces,
      label: seed.label,
      score: effectiveScore,
    });

    return {
      betMultiplier: getBetMultiplier(isPostSplit ? 2 : 1, {
        isBlackjack: effectiveScore === blackjackScore,
      }),
      canDouble: canDouble(rules, { cardsNumber: 2, isPostSplit }),
      canSplit:
        !!splitCardSymbol &&
        canSplit(rules, { cardSymbols: [splitCardSymbol, splitCardSymbol], isPostSplit }),
      effectiveScore,
      isActionable,
      isHidden: seed.isHidden,
      isPostSplit,
      isPostSplitAces,
      label: seed.label,
      postSplitLabel: seed.postSplitLabel,
      scores: seed.scores,
    };
  });
};

const validateLabel = (rules: Rules, seed: AbstractHandSeed) => {
  const isPostSplit = !!seed.isPostSplit;
  const isPostSplitAces = !!seed.isPostSplitAces;

  let label = getLabelFromScores(rules, {
    scores: seed.scores,
    isPostSplit,
    isPostSplitAces,
  });

  const splitCardSymbol = seed.postSplitLabel && seed.label.split(',')[0];
  if (splitCardSymbol) {
    const card = cards.find(c => c.symbol === splitCardSymbol)!;
    label = getLabelFromCards(rules, {
      cards: [card, card],
      isPostSplit,
      isPostSplitAces,
    });
  }

  if (label !== seed.label) {
    throw new Error(
      `Incorrect label "${seed.label}" for hand with scores ${seed.scores}, post-split "${isPostSplit}" and post-split aces "${isPostSplitAces}". Expected "${label}"`,
    );
  }
};

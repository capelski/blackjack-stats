import { Action } from '../models/action.model';
import { aceSymbol } from '../models/cards.model';
import {
  HandCategory,
  initialPair,
  oneSplitPair,
  oneSplitPairAfterAces,
  postDoubleHand,
  splittablePair,
  threeOrMoreCards,
  threeSplitsPair,
  twoSplitsPair,
} from '../models/hand-category.model';
import { bust, end, HandStatus } from '../models/hand-status.model';
import { blackjackLabel } from '../models/labels.model';
import { blackjackScore, bustScore } from '../models/scores.model';
import {
  maxSplitsByOption,
  splittingOnce,
  splittingThreeTimes,
  splittingTwice,
} from '../models/splitting.model';
import { AbstractHand, AbstractHandPartial, AbstractHandRoot } from '../types/abstract-hand.type';
import { Rules } from '../types/rules.type';
import { getSplitCount, isPostAcesSplit } from './hand-category.logic';
import { getDiscriminatedLabel, getHandLabel } from './labels.logic';
import { canAction, canDouble, canSplit, canSurrender } from './rules.logic';
import { getEffectiveScore } from './scores.logic';

const coreHands: AbstractHandRoot[] = [
  { example: 'J,J', label: '20', scores: [20] },
  { example: 'J,9', label: '19', scores: [19] },
  { example: 'J,8', label: '18', scores: [18] },
  { example: 'J,7', label: '17', scores: [17] },
  { example: 'J,6', label: '16', scores: [16] },
  { example: 'J,5', label: '15', scores: [15] },
  { example: 'J,4', label: '14', scores: [14] },
  { example: 'J,3', label: '13', scores: [13] },
  { example: '2,J', label: '12', scores: [12] },
  { example: '2,9', label: '11', scores: [11] },
  { example: '2,8', label: '10', scores: [10] },
  { example: '2,7', label: '9', scores: [9] },
  { example: '2,6', label: '8', scores: [8] },
  { example: '2,5', label: '7', scores: [7] },
  { example: '2,4', label: '6', scores: [6] },
  { example: '2,3', label: '5', scores: [5] },
  { example: '2,2', label: '4', scores: [4] },
  { example: 'A,9', label: '10/20', scores: [10, 20] },
  { example: 'A,8', label: '9/19', scores: [9, 19] },
  { example: 'A,7', label: '8/18', scores: [8, 18] },
  { example: 'A,6', label: '7/17', scores: [7, 17] },
  { example: 'A,5', label: '6/16', scores: [6, 16] },
  { example: 'A,4', label: '5/15', scores: [5, 15] },
  { example: 'A,3', label: '4/14', scores: [4, 14] },
  { example: 'A,2', label: '3/13', scores: [3, 13] },
];

/** Hands resulting of splitting a pair the given number of times, excluding re-splittable pairs.
 * They can transform into:
 * - "3+ cards", when hitting
 * - "Post double hand", when doubling
 * - "Two/Three split pair", when splitting
 */
const getPostSplitHands = (
  rules: Rules,
  defaultCategory: HandCategory,
  splitCount: number,
): AbstractHandPartial[] => {
  const postAcesOneSplitAceTen: AbstractHandRoot = rules.blackjackAfterSplit
    ? {
        example: 'A,S,J',
        label: 'BJ',
        scores: [blackjackScore],
        category: oneSplitPairAfterAces,
      }
    : {
        example: 'A,S,J',
        label: '11/21',
        scores: [11, 21],
        category: oneSplitPairAfterAces,
      };

  const postAcesOneSplitHands: AbstractHandRoot[] = [
    postAcesOneSplitAceTen,
    {
      example: 'A,S,9',
      label: '10/20',
      scores: [10, 20],
      category: oneSplitPairAfterAces,
    },
    { example: 'A,S,8', label: '9/19', scores: [9, 19], category: oneSplitPairAfterAces },
    { example: 'A,S,7', label: '8/18', scores: [8, 18], category: oneSplitPairAfterAces },
    { example: 'A,S,6', label: '7/17', scores: [7, 17], category: oneSplitPairAfterAces },
    { example: 'A,S,5', label: '6/16', scores: [6, 16], category: oneSplitPairAfterAces },
    { example: 'A,S,4', label: '5/15', scores: [5, 15], category: oneSplitPairAfterAces },
    { example: 'A,S,3', label: '4/14', scores: [4, 14], category: oneSplitPairAfterAces },
    { example: 'A,S,2', label: '3/13', scores: [3, 13], category: oneSplitPairAfterAces },
    { example: 'A,S,A', label: '2/12', scores: [2, 12], category: oneSplitPairAfterAces },
  ];

  const postSplitHandsRoot: AbstractHandRoot[] = [
    ...[
      rules.blackjackAfterSplit
        ? { label: blackjackLabel, scores: [blackjackScore] }
        : { label: '11/21', scores: [11, 21] },
    ],
    ...coreHands,
    ...(splitCount === 1
      ? postAcesOneSplitHands
      : [{ example: 'A,A', label: '2/12', scores: [2, 12] }]),
  ];

  return postSplitHandsRoot.map<AbstractHandPartial>((x) => {
    const category = x.category ?? defaultCategory;

    return {
      category,
      isHidden: true,
      label: getDiscriminatedLabel(x.label, category),
      scores: x.scores,
    };
  });
};

/** Pairs that can be split. They can transform into:
 * - "One/Two/Three split pair", when splitting
 * - "Post double hand", when doubling
 * - "3+ cards", when hitting
 */
const getSplittablePairs = (
  rules: Rules,
  defaultCategory: HandCategory,
  splitCount: number,
  isHidden = true,
): AbstractHandPartial[] => {
  return [
    { scores: [2, 12], splitCard: aceSymbol },
    { scores: [4], splitCard: '2' },
    { scores: [6], splitCard: '3' },
    { scores: [8], splitCard: '4' },
    { scores: [10], splitCard: '5' },
    { scores: [12], splitCard: '6' },
    { scores: [14], splitCard: '7' },
    { scores: [16], splitCard: '8' },
    { scores: [18], splitCard: '9' },
    { scores: [20], splitCard: '10' },
    { scores: [20], splitCard: 'J', isHidden: true },
    { scores: [20], splitCard: 'Q', isHidden: true },
    { scores: [20], splitCard: 'K', isHidden: true },
  ]
    .map((x) => ({ ...x, isSplittable: canSplit(rules, [x.splitCard, x.splitCard], splitCount) }))
    .map<AbstractHandPartial>((x) => {
      const category = isPostAcesSplit(x.splitCard === aceSymbol, splitCount)
        ? oneSplitPairAfterAces
        : defaultCategory;

      return {
        category,
        isHidden: isHidden || x.isHidden || !x.isSplittable,
        label: getHandLabel(x.scores, category, x.splitCard),
        scores: x.scores,
        splitCard: x.splitCard,
      };
    });
};

/** The returned abstract hands are sorted so dependencies to other abstract hands are resolved first.
 * Example: Computing the expected results for "12" requires the expected results for "16 (3+)" */
export const getAbstractHands = (rules: Rules): AbstractHand[] => {
  /** "3+ cards" can only transform into "3+ cards", when hitting */
  const threeOrMoreCardsHands: AbstractHandPartial[] = [
    { example: '6,7,9', label: '22+ (3+)', scores: [bustScore] },
    { example: '6,7,8', label: '21 (3+)', scores: [21] },
    { example: '6,7,7', label: '20 (3+)', scores: [20] },
    { example: '6,7,6', label: '19 (3+)', scores: [19] },
    { example: '6,7,5', label: '18 (3+)', scores: [18] },
    { example: '6,7,4', label: '17 (3+)', scores: [17] },
    { example: '6,7,3', label: '16 (3+)', scores: [16] },
    { example: '2,3,J', label: '15 (3+)', scores: [15] },
    { example: '2,3,9', label: '14 (3+)', scores: [14] },
    { example: '2,3,8', label: '13 (3+)', scores: [13] },
    { example: '2,3,7', label: '12 (3+)', scores: [12] },
    { example: '2,3,6', label: '11 (3+)', scores: [11] },
    { example: 'A,A,9', label: '11/21 (3+)', scores: [11, 21] },
    { example: '2,3,5', label: '10 (3+)', scores: [10] },
    { example: 'A,A,8', label: '10/20 (3+)', scores: [10, 20] },
    { example: '2,3,4', label: '9 (3+)', scores: [9] },
    { example: 'A,A,7', label: '9/19 (3+)', scores: [9, 19] },
    { example: '2,3,3', label: '8 (3+)', scores: [8] },
    { example: 'A,A,6', label: '8/18 (3+)', scores: [8, 18] },
    { example: '2,3,2', label: '7 (3+)', scores: [7] },
    { example: 'A,A,5', label: '7/17 (3+)', scores: [7, 17] },
    { example: '2,2,2', label: '6 (3+)', scores: [6] },
    { example: 'A,A,4', label: '6/16 (3+)', scores: [6, 16] },
    { example: 'A,A,3', label: '5/15 (3+)', scores: [5, 15] },
    { example: 'A,A,2', label: '4/14 (3+)', scores: [4, 14] },
    { example: 'A,A,A', label: '3/13 (3+)', scores: [3, 13] },
  ].map<AbstractHandPartial>((x) => {
    return {
      ...x,
      category: threeOrMoreCards,
      isHidden: true,
    };
  });

  /** "Post double hands" are non actionable */
  const postDoubleHands: AbstractHandPartial[] = [
    { example: '9,3,D,J', label: '22+ (D)', scores: [bustScore] },
    { example: '9,3,D,9', label: '21 (D)', scores: [21] },
    { example: '9,3,D,8', label: '20 (D)', scores: [20] },
    { example: '9,3,D,7', label: '19 (D)', scores: [19] },
    { example: '9,3,D,6', label: '18 (D)', scores: [18] },
    { example: '9,3,D,5', label: '17 (D)', scores: [17] },
    { example: '9,3,D,4', label: '16 (D)', scores: [16] },
    { example: '9,3,D,3', label: '15 (D)', scores: [15] },
    { example: '9,3,D,2', label: '14 (D)', scores: [14] },
    { example: '8,3,D,2', label: '13 (D)', scores: [13] },
    { example: '7,3,D,2', label: '12 (D)', scores: [12] },
    { example: '6,3,D,2', label: '11 (D)', scores: [11] },
    { example: 'A,A,D,9', label: '11/21 (D)', scores: [11, 21] },
    { example: '5,3,D,2', label: '10 (D)', scores: [10] },
    { example: 'A,A,D,8', label: '10/20 (D)', scores: [10, 20] },
    { example: '4,3,D,2', label: '9 (D)', scores: [9] },
    { example: 'A,A,D,7', label: '9/19 (D)', scores: [9, 19] },
    { example: '3,3,D,2', label: '8 (D)', scores: [8] },
    { example: 'A,A,D,6', label: '8/18 (D)', scores: [8, 18] },
    { example: '2,3,D,2', label: '7 (D)', scores: [7] },
    { example: 'A,A,D,5', label: '7/17 (D)', scores: [7, 17] },
    { example: '2,2,D,2', label: '6 (D)', scores: [6] },
    { example: 'A,A,D,4', label: '6/16 (D)', scores: [6, 16] },
    { example: 'A,A,D,3', label: '5/15 (D)', scores: [5, 15] },
    { example: 'A,A,D,2', label: '4/14 (D)', scores: [4, 14] },
    { example: 'A,A,D,A', label: '3/13 (D)', scores: [3, 13] },
  ].map<AbstractHandPartial>((x) => {
    return {
      ...x,
      category: postDoubleHand,
      isHidden: true,
    };
  });

  /** "Initial pair" can transform into:
   * - "3+ cards", when hitting
   * - "Post double hands", when doubling */
  const initialPairs: AbstractHandPartial[] = [
    { example: 'J,A', label: 'BJ', scores: [blackjackScore] },
    ...coreHands,
    { example: 'A,A', label: '2/12', scores: [2, 12] },
  ].map<AbstractHandPartial>((x) => {
    return {
      ...x,
      category: initialPair,
    };
  });

  const postSplitHands = [
    ...getPostSplitHands(rules, threeSplitsPair, maxSplitsByOption[splittingThreeTimes]), // J,S,J,S,J,S,3 => 13 (S3)
    ...getPostSplitHands(rules, twoSplitsPair, maxSplitsByOption[splittingTwice]), // J,S,J,S,3 => 13 (S2)
    ...getPostSplitHands(rules, oneSplitPair, maxSplitsByOption[splittingOnce]), // J,S,3 => 13 (S1)
  ];

  const splittablePairs = [
    ...getSplittablePairs(rules, twoSplitsPair, maxSplitsByOption[splittingTwice]), // A,A (S2) - 8,8 (S2)
    ...getSplittablePairs(rules, oneSplitPair, maxSplitsByOption[splittingOnce]), // A,A (S1A) - 8,8 (S1)
    ...getSplittablePairs(rules, splittablePair, 0, false), // A,A - 8,8
  ];

  const abstractHands = [
    ...threeOrMoreCardsHands,
    ...postDoubleHands,
    ...initialPairs,
    ...postSplitHands,
    ...splittablePairs,
  ].map<AbstractHand>((x) => {
    const effectiveScore = getEffectiveScore(x.scores);

    return {
      ...x,
      canDouble: canDouble(rules, x),
      canSplit:
        !!x.splitCard && canSplit(rules, [x.splitCard, x.splitCard], getSplitCount(x.category)),
      canSurrender: canSurrender(rules, x),
      effectiveScore,
      isActionable: canAction(rules, { category: x.category, effectiveScore }),
      labelAsInitial: x.label.split(' ')[0],
    };
  });

  // Validate that all example cards produce the right score and label
  for (const hand of abstractHands) {
    const label = getHandLabel(hand.scores, hand.category, hand.splitCard);

    if (label !== hand.label) {
      throw new Error(
        `Incorrect label "${hand.label}" for hand with scores ${hand.scores}, category "${hand.category}" and split card "${hand.splitCard}". Expected "${label}"`,
      );
    }
  }

  return abstractHands;
};

export const getActionableHands = <T extends Pick<AbstractHand, 'isActionable' | 'isHidden'>>(
  resolvedHands: T[],
): T[] => {
  return resolvedHands.filter((hand) => hand.isActionable && !hand.isHidden);
};

export const getHandStatus = (
  action: Action,
  isActionable: boolean,
  effectiveScore: number,
): HandStatus => {
  return isActionable ? action : effectiveScore === bustScore ? bust : end;
};

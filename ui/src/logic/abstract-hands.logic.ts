import { Action } from '../models/action.model';
import { cardsMap } from '../models/cards.model';
import {
  initialPair,
  postASplitPair,
  postDoubleHand,
  postSplitPair,
  splittablePair,
  threeOrMoreCards,
} from '../models/hand-category.model';
import { bust, end, HandStatus } from '../models/hand-status.model';
import { blackjackScore, bustScore, playerScoreLimit } from '../models/scores.model';
import { AbstractHand } from '../types/abstract-hand.type';
import { Rules } from '../types/rules.type';
import { getHandLabel } from './labels.logic';
import { canDouble } from './rules.logic';
import { getEffectiveScore } from './scores.logic';

/** The returned abstract hands are sorted so dependencies to other abstract hands are resolved first.
 * Example: Computing the expected results for "12" requires the expected results for "16 (3+)" */
export const getAbstractHands = (rules: Rules): AbstractHand[] => {
  /** "3+ cards" can only transform into "3+ cards", when hitting */
  const threeOrMoreCardsHands: AbstractHand[] = [
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
  ].map<AbstractHand>(x => {
    const effectiveScore = getEffectiveScore(x.scores);

    return {
      ...x,
      canDouble: false,
      canSplit: false,
      canSurrender: false,
      category: threeOrMoreCards,
      effectiveScore,
      isActionable: effectiveScore < playerScoreLimit,
      isHidden: true,
      labelAsInitial: x.label.split(' ')[0],
    };
  });

  /** "Post double hands" are non actionable */
  const postDoubleHands: AbstractHand[] = [
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
  ].map<AbstractHand>(x => {
    const effectiveScore = getEffectiveScore(x.scores);

    return {
      ...x,
      canDouble: false,
      canSplit: false,
      canSurrender: false,
      category: postDoubleHand,
      effectiveScore,
      isActionable: false,
      isHidden: true,
      labelAsInitial: x.label.split(' ')[0],
    };
  });

  /** "Initial pair" can only transform into "3+ cards", when hitting or doubling */
  const initialPairs: AbstractHand[] = [
    { example: 'J,A', label: 'BJ', scores: [blackjackScore] },
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
    { example: 'A,A', label: '2/12', scores: [2, 12] },
  ].map<AbstractHand>(x => {
    const category = initialPair;
    const effectiveScore = getEffectiveScore(x.scores);

    return {
      ...x,
      canDouble: canDouble(rules, { category, scores: x.scores }),
      canSplit: false,
      canSurrender: !!rules.surrendering,
      category,
      effectiveScore,
      isActionable: effectiveScore < playerScoreLimit,
      labelAsInitial: x.label,
    };
  });

  /** "Post split pair" can only transform into "3+ cards", when hitting or doubling */
  const postSplitPairs: AbstractHand[] = [
    ...[
      rules.blackjackAfterSplit
        ? { example: 'J,S,A', label: 'BJ (S)', scores: [blackjackScore] }
        : { example: 'J,S,A', label: '11/21 (S)', scores: [11, 21] },
    ],
    { example: 'J,S,J', label: '20 (S)', scores: [20] },
    { example: 'J,S,9', label: '19 (S)', scores: [19] },
    { example: 'J,S,8', label: '18 (S)', scores: [18] },
    { example: 'J,S,7', label: '17 (S)', scores: [17] },
    { example: 'J,S,6', label: '16 (S)', scores: [16] },
    { example: 'J,S,5', label: '15 (S)', scores: [15] },
    { example: 'J,S,4', label: '14 (S)', scores: [14] },
    { example: 'J,S,3', label: '13 (S)', scores: [13] },
    { example: '2,S,J', label: '12 (S)', scores: [12] },
    { example: '2,S,9', label: '11 (S)', scores: [11] },
    { example: '2,S,8', label: '10 (S)', scores: [10] },
    { example: '2,S,7', label: '9 (S)', scores: [9] },
    { example: '2,S,6', label: '8 (S)', scores: [8] },
    { example: '2,S,5', label: '7 (S)', scores: [7] },
    { example: '2,S,4', label: '6 (S)', scores: [6] },
    { example: '2,S,3', label: '5 (S)', scores: [5] },
    { example: '2,S,2', label: '4 (S)', scores: [4] },
    { example: '9,S,A', label: '10/20 (S)', scores: [10, 20] },
    { example: '8,S,A', label: '9/19 (S)', scores: [9, 19] },
    { example: '7,S,A', label: '8/18 (S)', scores: [8, 18] },
    { example: '6,S,A', label: '7/17 (S)', scores: [7, 17] },
    { example: '5,S,A', label: '6/16 (S)', scores: [6, 16] },
    { example: '4,S,A', label: '5/15 (S)', scores: [5, 15] },
    { example: '3,S,A', label: '4/14 (S)', scores: [4, 14] },
    { example: '2,S,A', label: '3/13 (S)', scores: [3, 13] },
  ].map<AbstractHand>(x => {
    const category = postSplitPair;
    const effectiveScore = getEffectiveScore(x.scores);

    return {
      ...x,
      canDouble: canDouble(rules, { category, scores: x.scores }),
      canSplit: false,
      canSurrender: false,
      category,
      effectiveScore,
      isActionable: effectiveScore < playerScoreLimit,
      isHidden: true,
      labelAsInitial: x.label.split(' ')[0],
    };
  });

  /** "Post A-split pair" can only transform into "3+ cards", when hitting or doubling */
  const postASplitPairs: AbstractHand[] = [
    ...[
      rules.blackjackAfterSplit
        ? { example: 'A,S,J', label: 'BJ (A)', scores: [blackjackScore] }
        : { example: 'A,S,J', label: '11/21 (A)', scores: [11, 21] },
    ],
    { example: 'A,S,9', label: '10/20 (A)', scores: [10, 20] },
    { example: 'A,S,8', label: '9/19 (A)', scores: [9, 19] },
    { example: 'A,S,7', label: '8/18 (A)', scores: [8, 18] },
    { example: 'A,S,6', label: '7/17 (A)', scores: [7, 17] },
    { example: 'A,S,5', label: '6/16 (A)', scores: [6, 16] },
    { example: 'A,S,4', label: '5/15 (A)', scores: [5, 15] },
    { example: 'A,S,3', label: '4/14 (A)', scores: [4, 14] },
    { example: 'A,S,2', label: '3/13 (A)', scores: [3, 13] },
    { example: 'A,S,A', label: '2/12 (A)', scores: [2, 12] },
  ].map<AbstractHand>(x => {
    const category = postASplitPair;
    const effectiveScore = getEffectiveScore(x.scores);

    return {
      ...x,
      canDouble: !!rules.hitSplitAces && canDouble(rules, { category, scores: x.scores }),
      canSplit: false,
      canSurrender: false,
      category,
      effectiveScore,
      isActionable: !!rules.hitSplitAces,
      isHidden: true,
      labelAsInitial: x.label.split(' ')[0],
    };
  });

  /** "Split pair" can transform into:
   * - "Post split card", when splitting
   * - "3+ cards", when hitting or doubling
   **/
  const splittablePairs: AbstractHand[] = [
    { example: 'A,A', label: 'A,A', scores: [2, 12], splitCard: cardsMap['A'] },
    { example: '2,2', label: '2,2', scores: [4], splitCard: cardsMap['2'] },
    { example: '3,3', label: '3,3', scores: [6], splitCard: cardsMap['3'] },
    { example: '4,4', label: '4,4', scores: [8], splitCard: cardsMap['4'] },
    { example: '5,5', label: '5,5', scores: [10], splitCard: cardsMap['5'] },
    { example: '6,6', label: '6,6', scores: [12], splitCard: cardsMap['6'] },
    { example: '7,7', label: '7,7', scores: [14], splitCard: cardsMap['7'] },
    { example: '8,8', label: '8,8', scores: [16], splitCard: cardsMap['8'] },
    { example: '9,9', label: '9,9', scores: [18], splitCard: cardsMap['9'] },
    { example: '10,10', label: '10,10', scores: [20], splitCard: cardsMap['10'] },
    { example: 'J,J', label: 'J,J', scores: [20], isHidden: true, splitCard: cardsMap['J'] },
    { example: 'Q,Q', label: 'Q,Q', scores: [20], isHidden: true, splitCard: cardsMap['Q'] },
    { example: 'K,K', label: 'K,K', scores: [20], isHidden: true, splitCard: cardsMap['K'] },
  ].map<AbstractHand>(x => {
    const canSplit = !!rules.splitting;
    const category = splittablePair;
    const effectiveScore = getEffectiveScore(x.scores);

    return {
      ...x,
      canDouble: canDouble(rules, { category, scores: x.scores }),
      canSplit,
      canSurrender: !!rules.surrendering,
      category,
      effectiveScore,
      isActionable: true,
      isHidden: x.isHidden || !canSplit,
      labelAsInitial: x.label,
    };
  });

  const abstractHands = [
    ...threeOrMoreCardsHands,
    ...postDoubleHands,
    ...initialPairs,
    ...postSplitPairs,
    ...postASplitPairs,
    ...splittablePairs,
  ];

  // Validate that all example cards produce the right score and label
  for (const hand of abstractHands) {
    const label = getHandLabel(hand.scores, hand.category, hand.splitCard?.symbol);

    if (label !== hand.label) {
      throw new Error(
        `Incorrect label "${hand.label}" for hand with scores ${hand.scores}, category "${hand.category}" and split card "${hand.splitCard?.symbol}". Expected "${label}"`,
      );
    }
  }

  return abstractHands;
};

export const getActionableHands = <T extends Pick<AbstractHand, 'isActionable' | 'isHidden'>>(
  resolvedHands: T[],
): T[] => {
  return resolvedHands.filter(hand => hand.isActionable && !hand.isHidden);
};

export const getHandStatus = (
  action: Action,
  isActionable: boolean,
  effectiveScore: number,
): HandStatus => {
  return isActionable ? action : effectiveScore === bustScore ? bust : end;
};

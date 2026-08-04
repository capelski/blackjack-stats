import {
  initialPair,
  postASplitPair,
  postDoubleHand,
  postSplitPair,
  splittablePair,
  threeOrMoreCards,
} from '../models/hand-category.model';
import { Card } from './card.type';
import { HandBase } from './hand-base.type';

/** Properties of a hand that are relevant to determine the evolution of the hand.
 * These properties are shared by different combinations of cards that lead to the same results.
 * For example: the abstract hand '12' can be composed of '10+2', '9+3', '8+4', etc.*/
export type AbstractHand = HandBase & {
  canDouble: boolean;
  canSplit: boolean;
  canSurrender: boolean;
  example: string;
  isActionable: boolean;
  isHidden?: boolean;
} & (
    | {
        category:
          | typeof threeOrMoreCards
          | typeof postDoubleHand
          | typeof initialPair
          | typeof postSplitPair
          | typeof postASplitPair;
        splitCard?: undefined;
      }
    | {
        category: typeof splittablePair;
        splitCard: Card;
      }
  );

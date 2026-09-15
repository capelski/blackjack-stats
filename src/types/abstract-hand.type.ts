import { HandBase } from './hand-base.type';

export type AbstractHandPartial = Pick<HandBase, 'category' | 'label' | 'scores'> & {
  example?: string;
  isHidden?: boolean;
  /** Symbol of the two cards forming the hand, when the hand is a pair that can be split.
   * Splittable pairs are identified by their card symbol, instead of their scores, because the
   * card they are split into determines the hands they can transform into */
  splitCard?: string;
};

/** Properties of a hand that are relevant to determine the evolution of the hand.
 * These properties are shared by different combinations of cards that lead to the same results.
 * For example: the abstract hand '12' can be composed of '10+2', '9+3', '8+4', etc.*/
export type AbstractHand = AbstractHandPartial &
  HandBase & {
    canDouble: boolean;
    canSplit: boolean;
    canSurrender: boolean;
    isActionable: boolean;
  };

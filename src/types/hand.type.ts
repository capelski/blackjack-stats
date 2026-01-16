import { Card } from './card.type';

export type HandWithCards = {
  cards: Card[];
  scores: number[];
};

export type DealerHand = {
  effectiveScore: number;
  label: string;
};

export type PlayerHandSeed = Pick<DealerHand, 'label'> & {
  canBeInitialHand: boolean;
  /** Indicates whether the hand is only used for internal calculations and should not be displayed */
  isVirtualHand?: boolean;
  scores: number[];
  sortIndex: number;
  splitLabel?: string;
};

export type PlayerHand = PlayerHandSeed &
  DealerHand & {
    isFinal: boolean;
  };

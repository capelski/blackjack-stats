import { Card } from './card.type';

export type HandWithCards = {
  cards: Card[];
  scores: number[];
};

export type PlayerHandSeed = {
  /** Indicates whether the hand is only used for internal calculations and should not be displayed */
  isVirtualHand?: boolean;
  label: string;
  scores: number[];
  sortIndex: number;
  splitLabel?: string;
};

export type PlayerHand = PlayerHandSeed & {
  effectiveScore: number;
  initialProbability: number;
  isFinal: boolean;
};

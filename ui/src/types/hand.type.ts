import { HandStatus } from '../models/hand-status.model';
import { Card } from './card.type';

export type Hand = {
  canDouble: boolean;
  canSplit: boolean;
  cards: Card[];
  effectiveScore: number;
  label: string;
  probability: number;
  scores: number[];
  /** Contains the cards plus split symbols when applicable */
  symbols: string[];
};

export type HandExtended = Hand & {
  action: HandStatus;
  betMultiplier: number;
  isFinal: boolean;
  isPostDouble: boolean;
  isPostSplit: boolean;
};

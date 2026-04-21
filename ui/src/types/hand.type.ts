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
};

export type HandExtended = Hand & {
  action: HandStatus;
  betMultiplier: number;
  isFinal: boolean;
  isPostDouble: boolean;
  isPostSplit: boolean;
};

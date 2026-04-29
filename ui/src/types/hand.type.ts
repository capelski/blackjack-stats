import { HandStatus } from '../models/hand-status.model';
import { Card } from './card.type';

export type HandBase = {
  canDouble: boolean;
  canSplit: boolean;
  effectiveScore: number;
  label: string;
  scores: number[];
};

export type Hand = HandBase & {
  cards: Card[];
  isPostDouble: boolean;
  isPostSplit: boolean;
  probability: number;
};

export type HandWithAction = Hand & {
  action: HandStatus;
  betMultiplier: number;
  isFinal: boolean;
};

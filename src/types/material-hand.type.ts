import { HandStatus } from '../models/hand-status.model';
import { Card } from './card.type';
import { HandBase } from './hand-base.type';
import { HandModifiers } from './hand-modifiers.type';

/** Hand with actual cards that represents a specific instance of an abstract hand */
export type MaterialHand = HandBase & {
  action: HandStatus;
  cards: Card[];
  isFinal: boolean;
  modifiers: HandModifiers;
  probability: number;
};

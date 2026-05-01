import { cards } from '../models/cards.model';
import { HandResolutionMap } from '../types/hand-resolution.type';
import { MaterialHand } from '../types/hand.type';
import { cardToMaterialHand, getNextMaterialHand } from './hand.logic';

/** Reversing the cards for the depth first search to list cards in A-K order */
const reversedCards = [...cards].reverse();

export const getMaterialHands = (handActions: HandResolutionMap): MaterialHand[] => {
  const allHands: MaterialHand[] = [];
  const pendingHands: MaterialHand[] = cards.map(cardToMaterialHand);

  while (pendingHands.length > 0) {
    const hand = pendingHands.shift()!;

    if (hand.cards.length > 1) {
      allHands.push(hand);

      if (hand.isFinal) {
        continue;
      }
    }

    for (const card of reversedCards) {
      const nextHand = getNextMaterialHand(handActions, hand, card, {});
      pendingHands.unshift(nextHand);
    }
  }

  return allHands;
};

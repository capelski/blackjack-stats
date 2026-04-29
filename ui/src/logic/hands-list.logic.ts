import { cards } from '../models/cards.model';
import { HandResolver } from '../types/hand-resolver.type';
import { HandWithAction } from '../types/hand.type';
import { cardToHandWithAction, getNextHandWithAction } from './hand.logic';

/** Reversing the cards for the depth first search to list cards in A-K order */
const reversedCards = [...cards].reverse();

export const getHandsList = (handResolver: HandResolver): HandWithAction[] => {
  const allHands: HandWithAction[] = [];
  const pendingHands: HandWithAction[] = cards.map(cardToHandWithAction);

  while (pendingHands.length > 0) {
    const hand = pendingHands.shift()!;

    if (hand.cards.length > 1) {
      allHands.push(hand);

      if (hand.isFinal) {
        continue;
      }
    }

    for (const card of reversedCards) {
      const nextHand = getNextHandWithAction(handResolver, hand, card, {});
      pendingHands.unshift(nextHand);
    }
  }

  return allHands;
};

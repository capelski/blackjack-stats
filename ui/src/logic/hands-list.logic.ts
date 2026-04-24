import { cards } from '../models/cards.model';
import { HandResolver } from '../types/hand-resolver.type';
import { HandExtended } from '../types/hand.type';
import { createNextCardsCombination, createOneCardCombination } from './hand.logic';

/** Reversing the cards for the depth first search to list cards in A-K order */
const reversedCards = [...cards].reverse();

export const getHandsList = (handResolver: HandResolver): HandExtended[] => {
  const allHands: HandExtended[] = [];
  const pendingHands: HandExtended[] = cards.map(card => createOneCardCombination(card));

  while (pendingHands.length > 0) {
    const hand = pendingHands.shift()!;

    if (hand.cards.length > 1) {
      allHands.push(hand);

      if (hand.isFinal) {
        continue;
      }
    }

    for (const card of reversedCards) {
      const nextHand = createNextCardsCombination(handResolver, hand, card, {});
      pendingHands.unshift(nextHand);
    }
  }

  return allHands;
};

import { cards } from '../models/cards.model';
import { HandResolver } from '../types/hand-resolver.type';
import { HandExtended } from '../types/hand.type';
import { createNextCardsCombination, createOneCardCombination } from './hand.logic';

/** Reversing the cards for the depth first search to list cards in A-K order */
const reversedCards = [...cards].reverse();

export const getCombinationsList = (handResolver: HandResolver): HandExtended[] => {
  const allCombinations: HandExtended[] = [];
  const pendingCombinations: HandExtended[] = cards.map(card => createOneCardCombination(card));

  while (pendingCombinations.length > 0) {
    const hand = pendingCombinations.shift()!;

    if (hand.cards.length > 1) {
      allCombinations.push(hand);

      if (hand.isFinal) {
        continue;
      }
    }

    for (const card of reversedCards) {
      const nextHand = createNextCardsCombination(handResolver, hand, card, {});
      pendingCombinations.unshift(nextHand);
    }
  }

  return allCombinations;
};

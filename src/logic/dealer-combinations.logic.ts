import { CardsCombination } from '../types/cards-combination.type';
import { HandWithCards } from '../types/hand.type';
import { cards, cardValuesDictionary } from './cards.logic';
import { getScoresLabel } from './labels.logic';
import { getEffectiveScore, getScores } from './scores.logic';

export const getDealerCombinations = () => {
  const handsStack = cards.map<HandWithCards>(card => {
    return {
      cards: [card],
      scores: cardValuesDictionary[card],
    };
  });

  const allCombinations: CardsCombination[] = [];

  const reversedCards = [...cards].reverse();

  while (handsStack.length > 0) {
    const hand = handsStack.shift()!;

    const effectiveScore = getEffectiveScore(hand.scores);
    allCombinations.push({
      cards: hand.cards,
      effectiveScore,
      label: getScoresLabel(hand.scores),
    });

    if (effectiveScore < 17) {
      reversedCards.map(card => {
        const nextCards = [...hand.cards, card];
        const nextScores = getScores(hand.scores, cardValuesDictionary[card], nextCards.length);

        const nextHand: HandWithCards = {
          cards: nextCards,
          scores: nextScores,
        };

        handsStack.unshift(nextHand);
      });
    }
  }

  return allCombinations;
};

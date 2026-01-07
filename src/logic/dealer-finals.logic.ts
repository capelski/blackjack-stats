import { FinalScores } from '../types/final-scores.type';
import { HandWithCards } from '../types/hand.type';
import { cards, cardsNumber, cardValuesDictionary, getCardsCombinations } from './cards.logic';
import { getEffectiveScore, getScores } from './scores.logic';

export const getDealerFinals = () => {
  const handsQueue = cards.map<HandWithCards>(card => {
    return {
      cards: [card],
      scores: cardValuesDictionary[card],
    };
  });

  const dealerFinals: FinalScores = {};

  while (handsQueue.length > 0) {
    const hand = handsQueue.shift()!;

    cards.map(card => {
      const nextCards = [...hand.cards, card];
      const nextCombination = getCardsCombinations(nextCards);
      const nextScores = getScores(hand.scores, cardValuesDictionary[card], nextCards.length);
      const nextEffectiveScore = getEffectiveScore(nextScores);

      const nextHand: HandWithCards = {
        cards: nextCards,
        scores: nextScores,
      };

      if (nextEffectiveScore < 17) {
        handsQueue.push(nextHand);
      } else {
        if (!dealerFinals[nextEffectiveScore]) {
          dealerFinals[nextEffectiveScore] = {
            combinations: [],
            probability: 0,
          };
        }

        dealerFinals[nextEffectiveScore].combinations.push(nextCombination);

        dealerFinals[nextEffectiveScore].probability +=
          1 / Math.pow(cardsNumber, nextHand.cards.length);
      }
    });
  }

  return dealerFinals;
};

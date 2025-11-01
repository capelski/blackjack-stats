import { Finals } from '../types/finals.type';
import { HandWithCards } from '../types/hand.type';
import { cards, cardsNumber, cardValuesDictionary, getCardsCombinations } from './cards.logic';
import { getEffectiveScore, getScores } from './scores.logic';

export const getDealerFinals = () => {
  const handsQueue = cards.map<HandWithCards>((card) => {
    return {
      cards: [card],
      scores: cardValuesDictionary[card],
    };
  });
  const handCombinations = cards.reduce<Record<string, boolean>>((reduced, card) => {
    return { ...reduced, [card]: true };
  }, {});

  const dealerFinals: Finals = {
    combinations: {},
    probabilities: {},
  };

  while (handsQueue.length > 0) {
    const hand = handsQueue.shift()!;

    cards.map((card) => {
      const nextCards = [...hand.cards, card];
      const nextCombination = getCardsCombinations(nextCards);
      const nextScores = getScores(hand.scores, cardValuesDictionary[card], nextCards.length);
      const nextEffectiveScore = getEffectiveScore(nextScores);

      const nextHand: HandWithCards = {
        cards: nextCards,
        scores: nextScores,
      };

      if (nextEffectiveScore < 17) {
        if (!handCombinations[nextCombination]) {
          handCombinations[nextCombination] = true;
          handsQueue.push(nextHand);
        }
      } else {
        if (!dealerFinals.combinations[nextEffectiveScore]) {
          dealerFinals.combinations[nextEffectiveScore] = [];
        }
        dealerFinals.combinations[nextEffectiveScore].push(nextCombination);

        if (!dealerFinals.probabilities[nextEffectiveScore]) {
          dealerFinals.probabilities[nextEffectiveScore] = 0;
        }
        dealerFinals.probabilities[nextEffectiveScore] +=
          1 / Math.pow(cardsNumber, nextHand.cards.length);
      }
    });
  }

  return dealerFinals;
};

import { Finals } from '../types/finals.type';
import { cards, cardsNumber, cardValuesDictionary, getCardsCombinations } from './cards.logic';
import { getEffectiveScore, getHighestScore, getScores } from './scores.logic';

export const getDealerFinals = () => {
  const handsQueue = cards.map((card) => {
    return {
      cards: [card],
      values: cardValuesDictionary[card],
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
      const nextHand = {
        cards: nextCards,
        values: getScores(hand.values, cardValuesDictionary[card]),
      };
      const nextScore = getHighestScore(nextHand.values, nextCards.length);

      if (nextScore < 17) {
        if (!handCombinations[nextCombination]) {
          handCombinations[nextCombination] = true;
          handsQueue.push(nextHand);
        }
      } else {
        const effectiveFinalScore = getEffectiveScore(nextScore);
        if (!dealerFinals.combinations[effectiveFinalScore]) {
          dealerFinals.combinations[effectiveFinalScore] = [];
        }
        dealerFinals.combinations[effectiveFinalScore].push(nextCombination);

        if (!dealerFinals.probabilities[effectiveFinalScore]) {
          dealerFinals.probabilities[effectiveFinalScore] = 0;
        }
        dealerFinals.probabilities[effectiveFinalScore] +=
          1 / Math.pow(cardsNumber, nextHand.cards.length);
      }
    });
  }

  return dealerFinals;
};

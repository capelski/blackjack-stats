import { DealerFinals } from '../types/dealer-finals.type';
import { cards, cardsNumber, cardValuesDictionary } from './cards.logic';
import { getEffectiveScore, getHighestScore, getScores } from './scores';

export const getDealerFinals = () => {
  const handsQueue = cards.map((key) => {
    return {
      cards: [key],
      values: cardValuesDictionary[key],
    };
  });
  const handKeys = cards.reduce<Record<string, boolean>>((reduced, key) => {
    return { ...reduced, [key]: true };
  }, {});

  const dealerFinals: DealerFinals = {
    combinations: {},
    probabilities: {},
  };

  while (handsQueue.length > 0) {
    const hand = handsQueue.shift()!;

    cards.map((key) => {
      const nextCards = [...hand.cards, key];
      const nextKey = nextCards.join(',');
      const nextHand = {
        cards: nextCards,
        values: getScores(hand.values, cardValuesDictionary[key]),
      };
      const nextScore = getHighestScore(nextHand.values, nextCards.length);

      if (nextScore < 17) {
        if (!handKeys[nextKey]) {
          handKeys[nextKey] = true;
          handsQueue.push(nextHand);
        }
      } else {
        const effectiveFinalScore = getEffectiveScore(nextScore);
        if (!dealerFinals.combinations[effectiveFinalScore]) {
          dealerFinals.combinations[effectiveFinalScore] = [];
        }
        dealerFinals.combinations[effectiveFinalScore].push(nextKey);

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

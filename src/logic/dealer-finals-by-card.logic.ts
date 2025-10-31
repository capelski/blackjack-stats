import { Finals, FinalsByDealerCard } from '../types/finals.type';
import { cards, cardsNumber, cardValuesDictionary, getCardsCombinations } from './cards.logic';
import { getEffectiveScore, getHighestScore, getScores } from './scores.logic';

export const getDealerFinalsByCard = () => {
  const handsQueueByCard = cards.map((card) => {
    return {
      cards: [card],
      values: cardValuesDictionary[card],
    };
  });

  const handCombinationsByCard = cards.reduce<Record<string, boolean>>((reduced, card) => {
    return { ...reduced, [card]: true };
  }, {});

  const dealerFinalsByCard = cards.reduce<FinalsByDealerCard>((reduced, card) => {
    return {
      ...reduced,
      [card]: <Finals>{
        combinations: {},
        probabilities: {},
      },
    };
  }, {});

  while (handsQueueByCard.length > 0) {
    const hand = handsQueueByCard.shift()!;

    cards.map((card) => {
      const nextCards = [...hand.cards, card];
      const nextCombination = getCardsCombinations(nextCards);
      const nextHand = {
        cards: nextCards,
        values: getScores(hand.values, cardValuesDictionary[card]),
      };
      const nextScore = getHighestScore(nextHand.values, nextCards.length);

      if (nextScore < 17) {
        if (!handCombinationsByCard[nextCombination]) {
          handCombinationsByCard[nextCombination] = true;
          handsQueueByCard.push(nextHand);
        }
      } else {
        const effectiveFinalScore = getEffectiveScore(nextScore);
        const dealerFinals = dealerFinalsByCard[nextCards[0]];

        if (!dealerFinals.combinations[effectiveFinalScore]) {
          dealerFinals.combinations[effectiveFinalScore] = [];
        }
        dealerFinals.combinations[effectiveFinalScore].push(nextCombination);

        if (!dealerFinals.probabilities[effectiveFinalScore]) {
          dealerFinals.probabilities[effectiveFinalScore] = 0;
        }

        const handProbability = 1 / Math.pow(cardsNumber, nextHand.cards.length - 1);
        dealerFinals.probabilities[effectiveFinalScore] += handProbability;
      }
    });
  }

  return dealerFinalsByCard;
};

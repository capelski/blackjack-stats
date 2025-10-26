import { DealerFinals, DealerFinalsByCard } from '../types/dealer-finals.type';
import { cards, cardsNumber, cardValuesDictionary } from './cards.logic';
import { getEffectiveScore, getHighestScore, getScores } from './scores';

export const getDealerFinalsByCard = () => {
  const handsQueueByCard = cards.map((key) => {
    return {
      cards: [key],
      values: cardValuesDictionary[key],
    };
  });

  const handKeysByCard = cards.reduce<Record<string, boolean>>((reduced, key) => {
    return { ...reduced, [key]: true };
  }, {});

  const dealerFinalsByCard = cards.reduce<DealerFinalsByCard>((reduced, key) => {
    return {
      ...reduced,
      [key]: <DealerFinals>{
        combinations: {},
        probabilities: {},
      },
    };
  }, {});

  while (handsQueueByCard.length > 0) {
    const hand = handsQueueByCard.shift()!;

    cards.map((key) => {
      const nextCards = [...hand.cards, key];
      const nextKey = nextCards.join(',');
      const nextHand = {
        cards: nextCards,
        values: getScores(hand.values, cardValuesDictionary[key]),
      };
      const nextScore = getHighestScore(nextHand.values, nextCards.length);

      if (nextScore < 17) {
        if (!handKeysByCard[nextKey]) {
          handKeysByCard[nextKey] = true;
          handsQueueByCard.push(nextHand);
        }
      } else {
        const effectiveFinalScore = getEffectiveScore(nextScore);
        const dealerFinals = dealerFinalsByCard[nextCards[0]];

        if (!dealerFinals.combinations[effectiveFinalScore]) {
          dealerFinals.combinations[effectiveFinalScore] = [];
        }
        dealerFinals.combinations[effectiveFinalScore].push(nextKey);

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

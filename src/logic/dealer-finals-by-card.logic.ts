import { Finals, FinalsByDealerCard } from '../types/finals.type';
import { HandWithCards } from '../types/hand.type';
import { cards, cardsNumber, cardValuesDictionary, getCardsCombinations } from './cards.logic';
import { getEffectiveScore, getScores } from './scores.logic';

export const getDealerFinalsByCard = () => {
  const handsQueueByCard = cards.map<HandWithCards>((card) => {
    return {
      cards: [card],
      scores: cardValuesDictionary[card],
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
      const nextScores = getScores(hand.scores, cardValuesDictionary[card], nextCards.length);
      const nextEffectiveScore = getEffectiveScore(nextScores);

      const nextHand: HandWithCards = {
        cards: nextCards,
        scores: nextScores,
      };

      if (nextEffectiveScore < 17) {
        if (!handCombinationsByCard[nextCombination]) {
          handCombinationsByCard[nextCombination] = true;
          handsQueueByCard.push(nextHand);
        }
      } else {
        const dealerFinals = dealerFinalsByCard[nextCards[0]];

        if (!dealerFinals.combinations[nextEffectiveScore]) {
          dealerFinals.combinations[nextEffectiveScore] = [];
        }
        dealerFinals.combinations[nextEffectiveScore].push(nextCombination);

        if (!dealerFinals.probabilities[nextEffectiveScore]) {
          dealerFinals.probabilities[nextEffectiveScore] = 0;
        }

        const handProbability = 1 / Math.pow(cardsNumber, nextHand.cards.length - 1);
        dealerFinals.probabilities[nextEffectiveScore] += handProbability;
      }
    });
  }

  return dealerFinalsByCard;
};

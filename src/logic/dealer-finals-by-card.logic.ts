import { CardsCombination } from '../types/cards-combination.type';
import { FinalScoresByDealerCard, FinalScoresMap } from '../types/final-scores.type';
import { cards, cardsNumber, cardValuesDictionary, getCardsCombinations } from './cards.logic';
import { getScoresLabel } from './labels.logic';
import { getEffectiveScore, getScores } from './scores.logic';

export const getDealerFinalsByCard = () => {
  const handsQueueByCard = cards.map<CardsCombination>(card => {
    const scores = cardValuesDictionary[card];
    return {
      cards: [card],
      effectiveScore: getEffectiveScore(scores),
      label: getScoresLabel(scores),
      scores,
    };
  });

  const handCombinationsByCard = cards.reduce<Record<string, boolean>>((reduced, card) => {
    return { ...reduced, [card]: true };
  }, {});

  const dealerFinalsByCard = cards.reduce<FinalScoresByDealerCard>((reduced, card) => {
    return {
      ...reduced,
      [card]: <FinalScoresMap>{},
    };
  }, {});

  while (handsQueueByCard.length > 0) {
    const hand = handsQueueByCard.shift()!;

    cards.map(card => {
      const nextCards = [...hand.cards, card];
      const nextCombination = getCardsCombinations(nextCards);
      const nextScores = getScores(hand.scores, cardValuesDictionary[card], nextCards.length);
      const nextEffectiveScore = getEffectiveScore(nextScores);

      const nextHand: CardsCombination = {
        cards: nextCards,
        effectiveScore: nextEffectiveScore,
        label: getScoresLabel(nextScores),
        scores: nextScores,
      };

      if (nextEffectiveScore < 17) {
        if (!handCombinationsByCard[nextCombination]) {
          handCombinationsByCard[nextCombination] = true;
          handsQueueByCard.push(nextHand);
        }
      } else {
        const dealerFinals = dealerFinalsByCard[nextCards[0]];

        if (!dealerFinals[nextEffectiveScore]) {
          dealerFinals[nextEffectiveScore] = {
            combinations: [],
            probability: 0,
          };
        }

        dealerFinals[nextEffectiveScore].combinations.push(nextCombination);

        const handProbability = 1 / Math.pow(cardsNumber, nextHand.cards.length - 1);
        dealerFinals[nextEffectiveScore].probability += handProbability;
      }
    });
  }

  return dealerFinalsByCard;
};

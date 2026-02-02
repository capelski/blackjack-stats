import { CardsCombination } from '../types/cards-combination.type';
import { FinalScoresMap } from '../types/final-scores.type';
import { cards, cardsNumber, cardValuesDictionary, getCardsCombinations } from './cards.logic';
import { getScoresLabel } from './labels.logic';
import { getEffectiveScore, getScores } from './scores.logic';

export const getDealerFinals = () => {
  const handsQueue = cards.map<CardsCombination>(card => {
    const scores = cardValuesDictionary[card];
    return {
      cards: [card],
      effectiveScore: getEffectiveScore(scores),
      label: getScoresLabel(scores),
      scores,
    };
  });

  const dealerFinals: FinalScoresMap = {};

  while (handsQueue.length > 0) {
    const hand = handsQueue.shift()!;

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

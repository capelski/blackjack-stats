import { DealerFinals, DealerFinalsByCard } from '../types/dealer-finals';
import { cards, cardsNumber, cardValues, sortByCard } from './cards';
import { getScoresLabel } from './labels';
import { dealerFinalScores, getEffectiveScore, getHighestScore, getScores } from './scores';

export const getDealerFinals = () => {
  const handsQueue = cards.map((key) => {
    return {
      cards: [key],
      values: cardValues[key],
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
        values: getScores(hand.values, cardValues[key]),
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

export const getDealerFinalsByCard = () => {
  const handsQueueByCard = cards.map((key) => {
    return {
      cards: [key],
      values: cardValues[key],
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
        values: getScores(hand.values, cardValues[key]),
      };
      const nextScore = getHighestScore(nextHand.values, nextCards.length);

      if (nextScore < 17) {
        if (!handKeysByCard[nextKey]) {
          handKeysByCard[nextKey] = true;
          handsQueueByCard.push(nextHand);
        }
      } else {
        const effectiveFinalScore = getEffectiveScore(nextScore);
        const dealerCardFacts = dealerFinalsByCard[nextCards[0]];

        if (!dealerCardFacts.combinations[effectiveFinalScore]) {
          dealerCardFacts.combinations[effectiveFinalScore] = [];
        }
        dealerCardFacts.combinations[effectiveFinalScore].push(nextKey);

        if (!dealerCardFacts.probabilities[effectiveFinalScore]) {
          dealerCardFacts.probabilities[effectiveFinalScore] = 0;
        }

        const handProbability = 1 / Math.pow(cardsNumber, nextHand.cards.length - 1);
        dealerCardFacts.probabilities[effectiveFinalScore] += handProbability;
      }
    });
  }

  return dealerFinalsByCard;
};

export const getDealerScoresHeaders = () => {
  return ['Dealer card', ...dealerFinalScores.map((score) => getScoresLabel([score]))];
};

export const dealerFinalsByCardToCsv = (
  dealerFinalsByCard: DealerFinalsByCard,
  cardFactsFormatter: (dealerFinals: DealerFinals) => (number | string)[],
) => {
  const csv = [getDealerScoresHeaders().join(',')];
  Object.keys(dealerFinalsByCard)
    .sort(sortByCard)
    .forEach((dealerCardKey) => {
      const cardFacts = dealerFinalsByCard[dealerCardKey];
      const data = [dealerCardKey, ...cardFactsFormatter(cardFacts)];
      csv.push(data.join(','));
    });

  return csv.join('\n');
};

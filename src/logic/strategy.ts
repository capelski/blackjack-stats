import { DealerFinals, DealerFinalsByCard } from '../types/dealer-finals';
import { StrategyDealerCard } from '../types/strategy-dealer-card';
import { StrategyPlayerScore } from '../types/strategy-player-score';
import { cardValues, cardsNumber } from './cards';
import { blackjackLabel, bustLabel, getScoresLabel } from './labels';
import { getStandOutcomes } from './outcomes';
import {
  blackjackScore,
  bustScore,
  dealerFinalScores,
  getHighestScore,
  getScores,
  playerActionableScores,
} from './scores';

export const getPlayerScoreStrategy = (dealerFinals: DealerFinals) => {
  const playerScoreStrategy: StrategyPlayerScore = {
    [bustLabel]: {
      stand: getStandOutcomes(dealerFinals.probabilities, bustScore),
      hit: undefined!,
      decision: 'stand',
    },
    [blackjackLabel]: {
      stand: getStandOutcomes(dealerFinals.probabilities, blackjackScore),
      hit: undefined!,
      decision: 'stand',
    },
    21: {
      stand: getStandOutcomes(dealerFinals.probabilities, 21),
      hit: undefined!,
      decision: 'stand',
    },
    '11/21': {
      stand: getStandOutcomes(dealerFinals.probabilities, 21),
      hit: undefined!,
      decision: 'stand',
    },
  };

  playerActionableScores.forEach((playerScores) => {
    const scoresLabel = getScoresLabel(playerScores);

    playerScoreStrategy[scoresLabel] = playerScoreStrategy[scoresLabel] || {};
    const currentFact = (playerScoreStrategy[scoresLabel] = {
      stand: getStandOutcomes(dealerFinals.probabilities, getHighestScore(playerScores)),
      hit: {
        lose: 0,
        push: 0,
        win: 0,
      },
      decision: undefined! as 'hit' | 'stand',
    });

    for (const nextCardValues of Object.values(cardValues)) {
      const nextScores = getScores(playerScores, nextCardValues);
      const nextScoresLabel = getScoresLabel(nextScores);

      const futureFact = playerScoreStrategy[nextScoresLabel];
      const futureDecision = futureFact.decision;
      const futureProbabilities = futureFact[futureDecision];

      currentFact.hit.lose += futureProbabilities.lose / cardsNumber;
      currentFact.hit.push += futureProbabilities.push / cardsNumber;
      currentFact.hit.win += futureProbabilities.win / cardsNumber;
    }

    currentFact.decision = currentFact.stand.lose < currentFact.hit.lose ? 'stand' : 'hit';
  });

  return playerScoreStrategy;
};

export const getDealerCardStrategy = (dealerFinalsByCard: DealerFinalsByCard) => {
  const dealerCardStrategy: StrategyDealerCard = {
    [bustLabel]: {},
    [blackjackLabel]: {},
    21: {},
    '11/21': {},
  };

  Object.keys(dealerFinalsByCard).forEach((dealerCardKey) => {
    const { probabilities: finalProbabilities } = dealerFinalsByCard[dealerCardKey];
    const dealerProbabilities = dealerFinalScores
      .filter((key) => finalProbabilities[key])
      .reduce((reduced, key) => {
        return {
          ...reduced,
          [key]: finalProbabilities[key],
        };
      }, {});

    dealerCardStrategy[bustLabel][dealerCardKey] = {
      stand: getStandOutcomes(dealerProbabilities, bustScore),
      hit: undefined!,
      decision: 'stand',
    };
    dealerCardStrategy[blackjackLabel][dealerCardKey] = {
      stand: getStandOutcomes(dealerProbabilities, blackjackScore),
      hit: undefined!,
      decision: 'stand',
    };
    dealerCardStrategy[21][dealerCardKey] = {
      stand: getStandOutcomes(dealerProbabilities, 21),
      hit: undefined!,
      decision: 'stand',
    };
    dealerCardStrategy['11/21'][dealerCardKey] = {
      stand: getStandOutcomes(dealerProbabilities, 21),
      hit: undefined!,
      decision: 'stand',
    };

    playerActionableScores.forEach((playerScores) => {
      const scoresLabel = getScoresLabel(playerScores);

      dealerCardStrategy[scoresLabel] = dealerCardStrategy[scoresLabel] || {};
      const currentFact = (dealerCardStrategy[scoresLabel][dealerCardKey] = {
        stand: getStandOutcomes(dealerProbabilities, getHighestScore(playerScores)),
        hit: {
          lose: 0,
          push: 0,
          win: 0,
        },
        decision: undefined! as 'hit' | 'stand',
      });

      for (const nextCardValues of Object.values(cardValues)) {
        const nextScores = getScores(playerScores, nextCardValues);
        const nextScoresLabel = getScoresLabel(nextScores);

        const futureFact = dealerCardStrategy[nextScoresLabel][dealerCardKey];
        const futureDecision = futureFact.decision;
        const futureProbabilities = futureFact[futureDecision];

        currentFact.hit.lose += futureProbabilities.lose / cardsNumber;
        currentFact.hit.push += futureProbabilities.push / cardsNumber;
        currentFact.hit.win += futureProbabilities.win / cardsNumber;
      }

      currentFact.decision = currentFact.stand.lose < currentFact.hit.lose ? 'stand' : 'hit';
    });
  });

  return dealerCardStrategy;
};

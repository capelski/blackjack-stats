import { DealerFinals } from '../types/dealer-finals';
import { StrategyDealerCard } from '../types/strategy-dealer-card';
import { cardsNumber, cardValues } from './cards';
import { getScoresLabel } from './labels';
import { bustScore, dealerFinalScores, getScores } from './scores';

export const getLoseProbability = (
  dealerProbabilities: DealerFinals['probabilities'],
  playerScore: number,
) => {
  return playerScore === bustScore
    ? 1
    : dealerFinalScores
        .filter((key) => key !== bustScore && dealerProbabilities[key])
        .reduce((reduced, dealerScore) => {
          return reduced + (dealerScore > playerScore ? dealerProbabilities[dealerScore] : 0);
        }, 0);
};

export const getPushProbability = (
  dealerProbabilities: DealerFinals['probabilities'],
  playerScore: number,
) => {
  return playerScore === bustScore ? 0 : dealerProbabilities[playerScore] || 0;
};

export const getWinProbability = (
  dealerProbabilities: DealerFinals['probabilities'],
  playerScore: number,
) => {
  const bustProbability = dealerProbabilities[bustScore] || 0;
  return playerScore === bustScore
    ? 0
    : dealerFinalScores
        .filter((key) => key !== bustScore && dealerProbabilities[key])
        .reduce((reduced, dealerScore) => {
          return reduced + (dealerScore < playerScore ? dealerProbabilities[dealerScore] : 0);
        }, 0) + bustProbability;
};

export const getHitOutcomes = (
  dealerCardStrategy: StrategyDealerCard,
  dealerCardKey: string,
  playerScores: number[],
) => {
  const outcomes = {
    lose: 0,
    push: 0,
    win: 0,
  };

  for (const nextCardValues of Object.values(cardValues)) {
    const nextScores = getScores(playerScores, nextCardValues);
    const nextScoresLabel = getScoresLabel(nextScores);

    const futureFact = dealerCardStrategy[nextScoresLabel][dealerCardKey];
    const futureDecision = futureFact.decision;
    const futureProbabilities = futureFact[futureDecision];

    outcomes.lose += futureProbabilities.lose / cardsNumber;
    outcomes.push += futureProbabilities.push / cardsNumber;
    outcomes.win += futureProbabilities.win / cardsNumber;
  }
};

export const getStandOutcomes = (
  dealerProbabilities: DealerFinals['probabilities'],
  playerScore: number,
) => {
  return {
    lose: getLoseProbability(dealerProbabilities, playerScore),
    push: getPushProbability(dealerProbabilities, playerScore),
    win: getWinProbability(dealerProbabilities, playerScore),
  };
};

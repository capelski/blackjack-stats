import { DealerFinals } from '../types/dealer-finals';
import { Outcomes } from '../types/outcomes';
import { PlayerDecision } from '../types/player-decision';
import { cardsNumber, cardValues } from './cards';
import { getScoresLabel } from './labels';
import { toPercentage } from './percentages';
import { blackjackScore, bustScore, dealerFinalScores, getScores } from './scores';

export const computeEdge = (win: number, lose: number, playerScore?: number) => {
  const effectiveWin = win * (playerScore === blackjackScore ? 1.5 : 1);
  const edge = effectiveWin - lose;
  return edge;
};

export const createOutcomes = (): Outcomes => {
  return {
    edge: 0,
    lose: 0,
    push: 0,
    win: 0,
  };
};

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
  playerScores: number[],
  getNextScoreDecision: (nextScoresLabel: string) => PlayerDecision,
) => {
  const outcomes = createOutcomes();

  for (const nextCardValues of Object.values(cardValues)) {
    const nextScores = getScores(playerScores, nextCardValues);
    const nextScoresLabel = getScoresLabel(nextScores);

    const futureFact = getNextScoreDecision(nextScoresLabel);
    const futureDecision = futureFact.decision;
    const futureOutcomes = futureFact[futureDecision];

    outcomes.lose += futureOutcomes.lose / cardsNumber;
    outcomes.push += futureOutcomes.push / cardsNumber;
    outcomes.win += futureOutcomes.win / cardsNumber;
  }

  outcomes.edge = computeEdge(outcomes.win, outcomes.lose);

  return outcomes;
};

export const getStandOutcomes = (
  dealerProbabilities: DealerFinals['probabilities'],
  playerScore: number,
): Outcomes => {
  const lose = getLoseProbability(dealerProbabilities, playerScore);
  const push = getPushProbability(dealerProbabilities, playerScore);
  const win = getWinProbability(dealerProbabilities, playerScore);

  return {
    edge: computeEdge(win, lose, playerScore),
    lose,
    push,
    win,
  };
};

export const mergeOutcomes = (outcomesList: Outcomes[]): Outcomes => {
  return outcomesList.reduce<Outcomes>((reduced, outcomes) => {
    return {
      edge: reduced.edge + outcomes.edge,
      lose: reduced.lose + outcomes.lose,
      push: reduced.push + outcomes.push,
      win: reduced.win + outcomes.win,
    };
  }, createOutcomes());
};

export const multiplyOutcomes = (outcomes: Outcomes, factor: number): Outcomes => {
  return {
    edge: outcomes.edge * factor,
    lose: outcomes.lose * factor,
    push: outcomes.push * factor,
    win: outcomes.win * factor,
  };
};

export const outcomesToValues = (outcomes: Outcomes) => {
  return [
    toPercentage(outcomes.edge),
    toPercentage(outcomes.win),
    toPercentage(outcomes.lose),
    toPercentage(outcomes.push),
  ];
};

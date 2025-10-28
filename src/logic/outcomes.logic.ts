import { Finals } from '../types/finals.type';
import { Outcomes } from '../types/outcomes.type';
import { PlayerDecision } from '../types/player-decision.type';
import { cardsNumber, cardValues } from './cards.logic';
import { getScoresLabel } from './labels.logic';
import { toPercentage } from './percentages.logic';
import { blackjackScore, bustScore, dealerFinalScores, getScores } from './scores';

export type ComputeReturnsOptions = {
  isDoubling?: boolean;
  isBlackjack?: boolean;
};

export const computeReturns = (win: number, lose: number, options: ComputeReturnsOptions = {}) => {
  const effectiveWin = win * (options.isBlackjack ? 1.5 : options.isDoubling ? 2 : 1);
  const effectiveLose = lose * (options.isDoubling ? 2 : 1);
  return effectiveWin - effectiveLose;
};

export const createOutcomes = (): Outcomes => {
  return {
    lose: 0,
    push: 0,
    returns: 0,
    win: 0,
  };
};

export const getLoseProbability = (
  dealerProbabilities: Finals['probabilities'],
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
  dealerProbabilities: Finals['probabilities'],
  playerScore: number,
) => {
  return playerScore === bustScore ? 0 : dealerProbabilities[playerScore] || 0;
};

export const getWinProbability = (
  dealerProbabilities: Finals['probabilities'],
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

export const getDoubleOutcomes = (
  playerScores: number[],
  getNextScoreOutcomes: (nextScoresLabel: string) => Outcomes,
) => {
  const outcomes = createOutcomes();

  for (const nextCardValues of cardValues) {
    const nextScores = getScores(playerScores, nextCardValues);
    const nextScoresLabel = getScoresLabel(nextScores);

    const nextOutcomes = getNextScoreOutcomes(nextScoresLabel);

    outcomes.lose += nextOutcomes.lose / cardsNumber;
    outcomes.push += nextOutcomes.push / cardsNumber;
    outcomes.win += nextOutcomes.win / cardsNumber;
  }

  outcomes.returns = computeReturns(outcomes.win, outcomes.lose, { isDoubling: true });

  return outcomes;
};

export const getHitOutcomes = (
  playerScores: number[],
  getNextScoreDecision: (nextScoresLabel: string) => PlayerDecision,
) => {
  const outcomes = createOutcomes();

  for (const nextCardValues of cardValues) {
    const nextScores = getScores(playerScores, nextCardValues);
    const nextScoresLabel = getScoresLabel(nextScores);

    const nextDecision = getNextScoreDecision(nextScoresLabel);
    const nextAction = nextDecision.action;
    const nextOutcomes = nextDecision.outcomes[nextAction];

    outcomes.lose += nextOutcomes.lose / cardsNumber;
    outcomes.push += nextOutcomes.push / cardsNumber;
    outcomes.win += nextOutcomes.win / cardsNumber;
  }

  outcomes.returns = computeReturns(outcomes.win, outcomes.lose);

  return outcomes;
};

export const getStandOutcomes = (
  dealerProbabilities: Finals['probabilities'],
  playerScore: number,
): Outcomes => {
  const lose = getLoseProbability(dealerProbabilities, playerScore);
  const push = getPushProbability(dealerProbabilities, playerScore);
  const win = getWinProbability(dealerProbabilities, playerScore);

  return {
    lose,
    push,
    returns: computeReturns(win, lose, { isBlackjack: playerScore === blackjackScore }),
    win,
  };
};

export const mergeOutcomes = (outcomesList: Outcomes[]): Outcomes => {
  return outcomesList.reduce<Outcomes>((reduced, outcomes) => {
    return {
      lose: reduced.lose + outcomes.lose,
      push: reduced.push + outcomes.push,
      returns: reduced.returns + outcomes.returns,
      win: reduced.win + outcomes.win,
    };
  }, createOutcomes());
};

export const multiplyOutcomes = (outcomes: Outcomes, factor: number): Outcomes => {
  return {
    lose: outcomes.lose * factor,
    push: outcomes.push * factor,
    returns: outcomes.returns * factor,
    win: outcomes.win * factor,
  };
};

export const outcomesToValues = (outcomes: Outcomes) => {
  return [
    toPercentage(outcomes.returns),
    toPercentage(outcomes.win),
    toPercentage(outcomes.lose),
    toPercentage(outcomes.push),
  ];
};

import { Finals } from '../types/finals.type';
import { Outcomes } from '../types/outcomes.type';
import { PlayerDecision } from '../types/player-decision.type';
import { cardsNumber, cardValues } from './cards.logic';
import { dealerFinalHands } from './hands.logic';
import { getScoresLabel } from './labels.logic';
import { toPercentage } from './percentages.logic';
import { mergeFinalProbabilities, multiplyFinalProbabilities } from './player-finals.logic';
import { blackjackScore, bustScore, getScores } from './scores.logic';

export type ComputeReturnsOptions = {
  isDoubleBet?: boolean;
  isBlackjack?: boolean;
};

export const computeReturns = (win: number, lose: number, options: ComputeReturnsOptions = {}) => {
  const effectiveWin = win * (options.isBlackjack ? 1.5 : options.isDoubleBet ? 2 : 1);
  const effectiveLose = lose * (options.isDoubleBet ? 2 : 1);
  return effectiveWin - effectiveLose;
};

export const createOutcomes = (): Outcomes => {
  return {
    finalProbabilities: {},

    lose: 0,
    push: 0,
    win: 0,

    returns: 0,
  };
};

export const getLoseProbability = (
  dealerProbabilities: Finals['probabilities'],
  playerScore: number,
) => {
  return playerScore === bustScore
    ? 1
    : dealerFinalHands
        .filter(
          ({ effectiveScore }) =>
            effectiveScore !== bustScore && dealerProbabilities[effectiveScore],
        )
        .reduce((reduced, { effectiveScore }) => {
          return reduced + (effectiveScore > playerScore ? dealerProbabilities[effectiveScore] : 0);
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
    : dealerFinalHands
        .filter(
          ({ effectiveScore }) =>
            effectiveScore !== bustScore && dealerProbabilities[effectiveScore],
        )
        .reduce((reduced, { effectiveScore }) => {
          return reduced + (effectiveScore < playerScore ? dealerProbabilities[effectiveScore] : 0);
        }, 0) + bustProbability;
};

export const getDoubleOutcomes = (
  playerScores: number[],
  getNextScoreOutcomes: (nextScoresLabel: string) => Outcomes,
) => {
  const outcomes = createOutcomes();

  for (const nextCardValues of cardValues) {
    const nextScores = getScores(playerScores, nextCardValues, undefined);
    const nextScoresLabel = getScoresLabel(nextScores);
    const nextOutcomes = getNextScoreOutcomes(nextScoresLabel);

    const weightedProbabilities = multiplyFinalProbabilities(
      nextOutcomes.finalProbabilities,
      1 / cardsNumber,
    );

    outcomes.finalProbabilities = mergeFinalProbabilities(
      outcomes.finalProbabilities,
      weightedProbabilities,
    );

    outcomes.lose += nextOutcomes.lose / cardsNumber;
    outcomes.push += nextOutcomes.push / cardsNumber;
    outcomes.win += nextOutcomes.win / cardsNumber;
  }

  outcomes.returns = computeReturns(outcomes.win, outcomes.lose, { isDoubleBet: true });

  return outcomes;
};

export const getHitOutcomes = (
  playerScores: number[],
  getNextScoreDecision: (nextScoresLabel: string) => PlayerDecision,
) => {
  const outcomes = createOutcomes();

  for (const nextCardValues of cardValues) {
    const nextScores = getScores(playerScores, nextCardValues, undefined);
    const nextScoresLabel = getScoresLabel(nextScores);
    const nextDecision = getNextScoreDecision(nextScoresLabel);

    const weightedProbabilities = multiplyFinalProbabilities(
      nextDecision.selectedOutcomes.finalProbabilities,
      1 / cardsNumber,
    );

    outcomes.finalProbabilities = mergeFinalProbabilities(
      outcomes.finalProbabilities,
      weightedProbabilities,
    );

    outcomes.lose += nextDecision.selectedOutcomes.lose / cardsNumber;
    outcomes.push += nextDecision.selectedOutcomes.push / cardsNumber;
    outcomes.win += nextDecision.selectedOutcomes.win / cardsNumber;
  }

  outcomes.returns = computeReturns(outcomes.win, outcomes.lose);

  return outcomes;
};

export const getSplitOutcomes = (playerDecision: PlayerDecision) => {
  const outcomes: Outcomes = {
    ...playerDecision.selectedOutcomes,
    returns: computeReturns(
      playerDecision.selectedOutcomes.win,
      playerDecision.selectedOutcomes.lose,
      {
        isDoubleBet: true,
      },
    ),
  };

  return outcomes;
};

export const getStandOutcomes = (
  playerScore: number,
  dealerProbabilities: Finals['probabilities'],
): Outcomes => {
  const lose = getLoseProbability(dealerProbabilities, playerScore);
  const push = getPushProbability(dealerProbabilities, playerScore);
  const win = getWinProbability(dealerProbabilities, playerScore);

  return {
    finalProbabilities: { [getScoresLabel([playerScore])]: 1 },

    lose,
    push,
    win,

    returns: computeReturns(win, lose, { isBlackjack: playerScore === blackjackScore }),
  };
};

export const mergeOutcomes = (outcomesList: Outcomes[]): Outcomes => {
  return outcomesList.reduce<Outcomes>((reduced, outcomes) => {
    return {
      finalProbabilities: mergeFinalProbabilities(
        reduced.finalProbabilities,
        outcomes.finalProbabilities,
      ),

      lose: reduced.lose + outcomes.lose,
      push: reduced.push + outcomes.push,
      win: reduced.win + outcomes.win,

      returns: reduced.returns + outcomes.returns,
    };
  }, createOutcomes());
};

export const multiplyOutcomes = (outcomes: Outcomes, factor: number): Outcomes => {
  return {
    finalProbabilities: multiplyFinalProbabilities(outcomes.finalProbabilities, factor),

    lose: outcomes.lose * factor,
    push: outcomes.push * factor,
    win: outcomes.win * factor,

    returns: outcomes.returns * factor,
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

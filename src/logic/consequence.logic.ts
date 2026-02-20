import { Consequence } from '../types/consequence.type';
import { FinalProbabilities } from '../types/final-probabilities.type';
import { PlayerHand } from '../types/hand.type';
import { Outcomes } from '../types/outcomes.type';
import { PlayerDecision } from '../types/player-decision.type';
import { getBetMultiplier } from './bet-multiplier.logic';
import { cardsNumber, cardValues } from './cards.logic';
import {
  getLoseProbability,
  getPushProbability,
  getWinProbability,
  mergeFinalProbabilities,
  multiplyFinalProbabilities,
} from './final-probabilities.logic';
import { getScoresLabel } from './labels.logic';
import {
  createOutcomes,
  incrementOutcomes,
  mergeOutcomes,
  multiplyOutcomes,
} from './outcomes.logic';
import { computeResults, createResults, mergeResults, multiplyResults } from './results.logic';
import { blackjackScore, getScores } from './scores.logic';

const createConsequence = (initialProbability: number | undefined): Consequence => {
  return {
    finalProbabilities: {},
    initialProbability,
    outcomes: createOutcomes(),
    results: createResults(),
  };
};

export const getDoubleConsequence = (
  playerHand: PlayerHand,
  getNextScoreConsequence: (nextScoresLabel: string) => Consequence,
): Consequence => {
  const consequence = createConsequence(playerHand.initialProbability);

  for (const nextCardValues of cardValues) {
    const nextScores = getScores(playerHand.scores, nextCardValues, undefined);
    const nextScoresLabel = getScoresLabel(nextScores);
    const nextConsequence = getNextScoreConsequence(nextScoresLabel);

    const weightedProbabilities = multiplyFinalProbabilities(
      nextConsequence.finalProbabilities,
      1 / cardsNumber,
    );

    consequence.finalProbabilities = mergeFinalProbabilities(
      consequence.finalProbabilities,
      weightedProbabilities,
    );

    incrementOutcomes(consequence.outcomes, nextConsequence.outcomes, 1 / cardsNumber);
  }

  const betMultiplier = getBetMultiplier({ isDoubleBet: true });
  consequence.results = computeResults(consequence.outcomes, betMultiplier);

  return consequence;
};

export const getHitConsequence = (
  playerHand: PlayerHand,
  getNextScoreDecision: (nextScoresLabel: string) => PlayerDecision,
): Consequence => {
  const consequence = createConsequence(playerHand.initialProbability);

  for (const nextCardValues of cardValues) {
    const nextScores = getScores(playerHand.scores, nextCardValues, undefined);
    const nextScoresLabel = getScoresLabel(nextScores);
    const nextDecision = getNextScoreDecision(nextScoresLabel);

    const weightedProbabilities = multiplyFinalProbabilities(
      nextDecision.selectedConsequence.finalProbabilities,
      1 / cardsNumber,
    );

    consequence.finalProbabilities = mergeFinalProbabilities(
      consequence.finalProbabilities,
      weightedProbabilities,
    );

    incrementOutcomes(
      consequence.outcomes,
      nextDecision.selectedConsequence.outcomes,
      1 / cardsNumber,
    );
  }

  const betMultiplier = getBetMultiplier();
  consequence.results = computeResults(consequence.outcomes, betMultiplier);

  return consequence;
};

export const getSplitConsequence = (
  playerDecision: PlayerDecision,
  initialProbability: number | undefined,
): Consequence => {
  const outcomes = {
    ...playerDecision.selectedConsequence.outcomes,
  };
  const betMultiplier = getBetMultiplier({ isDoubleBet: true });
  const results = computeResults(outcomes, betMultiplier);

  const consequence: Consequence = {
    ...playerDecision.selectedConsequence,
    results,
    initialProbability,
  };

  return consequence;
};

export const getStandConsequence = (
  playerHand: PlayerHand,
  dealerProbabilities: FinalProbabilities,
): Consequence => {
  const lose = getLoseProbability(dealerProbabilities, playerHand.effectiveScore);
  const push = getPushProbability(dealerProbabilities, playerHand.effectiveScore);
  const win = getWinProbability(dealerProbabilities, playerHand.effectiveScore);

  const outcomes: Outcomes = { lose, push, win };
  const betMultiplier = getBetMultiplier({
    isBlackjack: playerHand.effectiveScore === blackjackScore,
  });
  const results = computeResults(outcomes, betMultiplier);

  return {
    finalProbabilities: { [playerHand.effectiveScore]: 1 },
    initialProbability: playerHand.initialProbability,
    outcomes,
    results,
  };
};

export const mergeConsequences = (a: Consequence, b: Consequence) => {
  return {
    finalProbabilities: mergeFinalProbabilities(a.finalProbabilities, b.finalProbabilities),
    initialProbability: (a.initialProbability || 0) + (b.initialProbability || 0),
    outcomes: mergeOutcomes(a.outcomes, b.outcomes),
    results: mergeResults(a.results, b.results),
  };
};

export const multiplyConsequence = (consequence: Consequence, factor: number): Consequence => {
  return {
    finalProbabilities: multiplyFinalProbabilities(consequence.finalProbabilities, factor),
    initialProbability: (consequence.initialProbability || 0) * factor,
    outcomes: multiplyOutcomes(consequence.outcomes, factor),
    results: multiplyResults(consequence.results, factor),
  };
};

import { Consequence } from '../types/consequence.type';
import { FinalProbabilities } from '../types/final-scores.type';
import { Outcomes } from '../types/outcomes.type';
import { PlayerDecision } from '../types/player-decision.type';
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
  computeOutcomes,
  createOutcomes,
  multiplyOutcomes,
  reduceOutcomes,
} from './outcomes.logic';
import { blackjackScore, getScores } from './scores.logic';

const increaseOutcomes = (target: Outcomes, addition: Outcomes, weight: number) => {
  target.lose += addition.lose * weight;
  target.push += addition.push * weight;
  target.win += addition.win * weight;
  // Deliberately not increasing advantage, betMultiplier and betReturns
};

export const createConsequence = (): Consequence => {
  return {
    finalProbabilities: {},
    outcomes: createOutcomes(),
  };
};

export const getDoubleConsequence = (
  playerScores: number[],
  getNextScoreConsequence: (nextScoresLabel: string) => Consequence,
): Consequence => {
  const consequence = createConsequence();

  for (const nextCardValues of cardValues) {
    const nextScores = getScores(playerScores, nextCardValues, undefined);
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

    increaseOutcomes(consequence.outcomes, nextConsequence.outcomes, 1 / cardsNumber);
  }

  computeOutcomes(consequence.outcomes, { isDoubleBet: true });

  return consequence;
};

export const getHitConsequence = (
  playerScores: number[],
  getNextScoreDecision: (nextScoresLabel: string) => PlayerDecision,
): Consequence => {
  const consequence = createConsequence();

  for (const nextCardValues of cardValues) {
    const nextScores = getScores(playerScores, nextCardValues, undefined);
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

    increaseOutcomes(
      consequence.outcomes,
      nextDecision.selectedConsequence.outcomes,
      1 / cardsNumber,
    );
  }

  computeOutcomes(consequence.outcomes);

  return consequence;
};

export const getSplitConsequence = (playerDecision: PlayerDecision): Consequence => {
  const outcomes = {
    ...playerDecision.selectedConsequence.outcomes,
  };
  computeOutcomes(outcomes, { isDoubleBet: true });

  const consequence: Consequence = {
    ...playerDecision.selectedConsequence,
    outcomes,
  };

  return consequence;
};

export const getStandConsequence = (
  playerScore: number,
  dealerProbabilities: FinalProbabilities,
): Consequence => {
  const lose = getLoseProbability(dealerProbabilities, playerScore);
  const push = getPushProbability(dealerProbabilities, playerScore);
  const win = getWinProbability(dealerProbabilities, playerScore);

  const outcomes = createOutcomes();
  outcomes.lose = lose;
  outcomes.push = push;
  outcomes.win = win;
  computeOutcomes(outcomes, { isBlackjack: playerScore === blackjackScore });

  return {
    finalProbabilities: { [playerScore]: 1 },
    outcomes,
  };
};

export const mergeConsequences = (outcomesList: Consequence[]): Consequence => {
  return outcomesList.reduce<Consequence>((reduced, consequence) => {
    return {
      finalProbabilities: mergeFinalProbabilities(
        reduced.finalProbabilities,
        consequence.finalProbabilities,
      ),
      outcomes: reduceOutcomes(reduced.outcomes, consequence.outcomes),
    };
  }, createConsequence());
};

export const multiplyConsequence = (consequence: Consequence, factor: number): Consequence => {
  return {
    finalProbabilities: multiplyFinalProbabilities(consequence.finalProbabilities, factor),
    outcomes: multiplyOutcomes(consequence.outcomes, factor),
  };
};

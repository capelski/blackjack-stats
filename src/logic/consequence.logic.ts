import { Consequence } from '../types/consequence.type';
import { FinalProbabilities } from '../types/final-scores.type';
import { PlayerDecision } from '../types/player-decision.type';
import { cardsNumber, cardValues } from './cards.logic';
import { getScoresLabel } from './labels.logic';
import {
  computeReturns,
  createOutcomes,
  getBetMultiplier,
  getLoseProbability,
  getPushProbability,
  getWinProbability,
  increaseOutcomes,
  multiplyOutcomes,
  reduceOutcomes,
} from './outcomes.logic';
import { mergeFinalProbabilities, multiplyFinalProbabilities } from './player-finals.logic';
import { blackjackScore, getScores } from './scores.logic';

export const createConsequence = (): Consequence => {
  return {
    finalProbabilities: {},
    outcomes: createOutcomes(),
  };
};

export const getDoubleConsequence = (
  playerScores: number[],
  getNextScoreConsequence: (nextScoresLabel: string) => Consequence,
) => {
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

  consequence.outcomes.betMultiplier = getBetMultiplier({ isDoubleBet: true });
  consequence.outcomes.returns = computeReturns(
    consequence.outcomes.win,
    consequence.outcomes.lose,
    consequence.outcomes.betMultiplier,
  );

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

  consequence.outcomes.returns = computeReturns(
    consequence.outcomes.win,
    consequence.outcomes.lose,
    1,
  );

  return consequence;
};

export const getSplitConsequence = (playerDecision: PlayerDecision) => {
  const betMultiplier = getBetMultiplier({ isDoubleBet: true });
  const outcomes: Consequence = {
    ...playerDecision.selectedConsequence,
    outcomes: {
      ...playerDecision.selectedConsequence.outcomes,
      betMultiplier,
      returns: computeReturns(
        playerDecision.selectedConsequence.outcomes.win,
        playerDecision.selectedConsequence.outcomes.lose,
        betMultiplier,
      ),
    },
  };

  return outcomes;
};

export const getStandConsequence = (
  playerScore: number,
  dealerProbabilities: FinalProbabilities,
): Consequence => {
  const lose = getLoseProbability(dealerProbabilities, playerScore);
  const push = getPushProbability(dealerProbabilities, playerScore);
  const win = getWinProbability(dealerProbabilities, playerScore);

  const betMultiplier = getBetMultiplier({ isBlackjack: playerScore === blackjackScore });
  return {
    finalProbabilities: { [playerScore]: 1 },
    outcomes: {
      lose,
      push,
      win,
      betMultiplier,
      returns: computeReturns(win, lose, betMultiplier),
    },
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

import { Consequence } from '../types/consequence.type';
import { FinalProbabilities } from '../types/final-probabilities.type';
import { PlayerHand } from '../types/hand.type';
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
  getBetMultiplier,
  multiplyOutcomes,
  reduceOutcomes,
} from './outcomes.logic';
import { blackjackScore, getScores } from './scores.logic';

const increaseOutcomes = (target: Outcomes, addition: Outcomes, weight: number) => {
  target.lose += addition.lose * weight;
  target.push += addition.push * weight;
  target.win += addition.win * weight;
  // Deliberately not increasing edge, betMultiplier and roi
};

const createConsequence = (): Consequence => {
  return {
    finalProbabilities: {},
    outcomes: createOutcomes(),
  };
};

export const getDoubleConsequence = (
  playerHand: PlayerHand,
  getNextScoreConsequence: (nextScoresLabel: string) => Consequence,
): Consequence => {
  const consequence = createConsequence();

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

    increaseOutcomes(consequence.outcomes, nextConsequence.outcomes, 1 / cardsNumber);
  }

  const betMultiplier = getBetMultiplier({ isDoubleBet: true });
  computeOutcomes(consequence.outcomes, betMultiplier);

  return consequence;
};

export const getHitConsequence = (
  playerHand: PlayerHand,
  getNextScoreDecision: (nextScoresLabel: string) => PlayerDecision,
): Consequence => {
  const consequence = createConsequence();

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

    increaseOutcomes(
      consequence.outcomes,
      nextDecision.selectedConsequence.outcomes,
      1 / cardsNumber,
    );
  }

  const betMultiplier = getBetMultiplier();
  computeOutcomes(consequence.outcomes, betMultiplier);

  return consequence;
};

export const getSplitConsequence = (playerDecision: PlayerDecision): Consequence => {
  const outcomes = {
    ...playerDecision.selectedConsequence.outcomes,
  };
  const betMultiplier = getBetMultiplier({ isDoubleBet: true });
  computeOutcomes(outcomes, betMultiplier);

  const consequence: Consequence = {
    ...playerDecision.selectedConsequence,
    outcomes,
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

  const outcomes = createOutcomes();
  outcomes.lose = lose;
  outcomes.push = push;
  outcomes.win = win;
  const betMultiplier = getBetMultiplier({
    isBlackjack: playerHand.effectiveScore === blackjackScore,
  });
  computeOutcomes(outcomes, betMultiplier);

  return {
    finalProbabilities: { [playerHand.effectiveScore]: 1 },
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

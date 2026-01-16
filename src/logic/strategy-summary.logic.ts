import { FinalScores } from '../types/final-scores.type';
import { PlayerHand } from '../types/hand.type';
import { DecisionsSummaryByPlayerScore } from '../types/player-decision-strategy.type';
import { StrategyOptions } from '../types/strategy-options.type';
import { ConsequencesByInitialPairs, StrategySummary } from '../types/strategy-summary.type';
import { getPlayerHandsSorted } from './hands.logic';
import { createOutcomes, mergeOutcomes, multiplyOutcomes } from './outcomes.logic';

export const createStrategySummary = (): StrategySummary => {
  return {
    breakdownByFinalScores: {},
    consequencesByInitialPairs: {},
    outcomes: createOutcomes(),
  };
};

export const decisionsToConsequences = (
  decisions: DecisionsSummaryByPlayerScore,
  playerHands: PlayerHand[],
) => {
  return playerHands.reduce<ConsequencesByInitialPairs>((reduced, playerHand) => {
    const consequence = decisions[playerHand.label].selectedConsequence;
    return {
      ...reduced,
      [playerHand.label]: consequence,
    };
  }, {});
};

export const getStrategySummary = (
  decisions: DecisionsSummaryByPlayerScore,
  dealerFinalScores: FinalScores,
  options: StrategyOptions = {},
): StrategySummary => {
  const playerHands = getPlayerHandsSorted(options.splitting);

  const consequencesByInitialPairs = decisionsToConsequences(decisions, playerHands);

  const weightedOutcomes = playerHands.map(playerHand => {
    const { outcomes } = decisions[playerHand.label].selectedConsequence;
    return multiplyOutcomes(outcomes, playerHand.initialProbability);
  });
  const mergedOutcomes = mergeOutcomes(weightedOutcomes);

  return {
    breakdownByFinalScores: {},
    consequencesByInitialPairs,
    outcomes: mergedOutcomes,
  };
};

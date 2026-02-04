import { FinalScoresMap } from '../types/final-scores.type';
import { PlayerHand } from '../types/hand.type';
import { ConsequencesByPlayerScore } from '../types/player-decision-strategy.type';
import { StrategyOptions } from '../types/strategy-options.type';
import { ConsequencesByInitialPairs, StrategySummary } from '../types/strategy-summary.type';
import { getPlayerHandsSorted } from './hands.logic';
import { createOutcomes, mergeOutcomes, multiplyOutcomes } from './outcomes.logic';

export const createStrategySummary = (): StrategySummary => {
  return {
    finalScoresSummaries: {},
    consequencesByInitialPairs: {},
    outcomes: createOutcomes(),
  };
};

export const getConsequencesByInitialPairs = (
  decisions: ConsequencesByPlayerScore,
  playerHands: PlayerHand[],
) => {
  return playerHands.reduce<ConsequencesByInitialPairs>((reduced, playerHand) => {
    const consequence = decisions[playerHand.label];
    return {
      ...reduced,
      [playerHand.label]: consequence,
    };
  }, {});
};

export const getStrategySummary = (
  decisions: ConsequencesByPlayerScore,
  dealerFinalScores: FinalScoresMap,
  options: StrategyOptions = {},
): StrategySummary => {
  const playerHands = getPlayerHandsSorted(options.splitting);

  const consequencesByInitialPairs = getConsequencesByInitialPairs(decisions, playerHands);

  const weightedOutcomes = playerHands.map(playerHand => {
    const { outcomes } = decisions[playerHand.label];
    return multiplyOutcomes(outcomes, playerHand.initialProbability);
  });
  const mergedOutcomes = mergeOutcomes(weightedOutcomes);

  return {
    finalScoresSummaries: {},
    consequencesByInitialPairs,
    outcomes: mergedOutcomes,
  };
};

import { FinalScores } from '../types/final-scores.type';
import { DecisionsSummaryByPlayerScore } from '../types/player-decision-strategy.type';
import { StrategyOptions } from '../types/strategy-options.type';
import { ConsequencesByInitialPairs, StrategySummary } from '../types/strategy-summary.type';
import { getInitialPairs } from './initial-pairs.logic';
import { getInitialPairLabels } from './labels.logic';
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
  initialPairLabels: string[],
) => {
  return initialPairLabels.reduce<ConsequencesByInitialPairs>((reduced, playerScoresLabel) => {
    const consequence = decisions[playerScoresLabel].selectedConsequence;
    return {
      ...reduced,
      [playerScoresLabel]: consequence,
    };
  }, {});
};

export const getStrategySummary = (
  decisions: DecisionsSummaryByPlayerScore,
  dealerFinalScores: FinalScores,
  options: StrategyOptions = {},
): StrategySummary => {
  const initialPairs = getInitialPairs(options.splitting);
  const initialPairLabels = getInitialPairLabels({
    includeNonInitialHands: true,
    ...options,
  });

  const consequencesByInitialPairs = decisionsToConsequences(decisions, initialPairLabels);

  const weightedOutcomes = Object.keys(initialPairs).map(playerScoresLabel => {
    const initialProbability = initialPairs[playerScoresLabel].probability;
    return multiplyOutcomes(
      decisions[playerScoresLabel].selectedConsequence.outcomes,
      initialProbability,
    );
  });
  const mergedOutcomes = mergeOutcomes(weightedOutcomes);

  return {
    breakdownByFinalScores: {},
    consequencesByInitialPairs,
    outcomes: mergedOutcomes,
  };
};

import {
  ConsequencesByPlayerScore,
  DecisionsByPlayerScore,
  PlayerDecisionStrategy,
} from '../types/player-decision-strategy.type';
import { StrategyOptions } from '../types/strategy-options.type';
import { mergeConsequences, multiplyConsequence } from './consequence.logic';
import { getDealerFinals } from './dealer-finals.logic';
import { createStrategySummary, getStrategySummary } from './strategy-summary.logic';

export const createPlayerDecisionStrategy = (
  options: StrategyOptions = {},
): PlayerDecisionStrategy => {
  const strategy: PlayerDecisionStrategy = {
    decisions: {},
    options,
    summary: createStrategySummary(),
  };
  return strategy;
};

export const decisionsToConsequences = (decisions: DecisionsByPlayerScore, factor?: number) => {
  return Object.keys(decisions).reduce<ConsequencesByPlayerScore>((reduced, playerScoresLabel) => {
    const { selectedConsequence } = decisions[playerScoresLabel];
    const weightedConsequence = factor
      ? multiplyConsequence(selectedConsequence, factor)
      : selectedConsequence;

    return { ...reduced, [playerScoresLabel]: weightedConsequence };
  }, {});
};

export const mergeConsequencesByPlayerScore = (
  a: ConsequencesByPlayerScore,
  b: ConsequencesByPlayerScore,
) => {
  return Object.keys({ ...a, ...b }).reduce<ConsequencesByPlayerScore>(
    (reduced, playerScoresLabel) => {
      const consequenceA = a[playerScoresLabel];
      const consequenceB = b[playerScoresLabel];

      const mergedConsequence = !consequenceA
        ? consequenceB
        : !consequenceB
        ? consequenceA
        : mergeConsequences([consequenceA, consequenceB]);

      return { ...reduced, [playerScoresLabel]: mergedConsequence };
    },
    {},
  );
};

export const mergePlayerDecisionStrategies = (strategies: PlayerDecisionStrategy[]) => {
  return strategies.reduce<ConsequencesByPlayerScore>((reduced, partialStrategy) => {
    const weightedConsequences = decisionsToConsequences(
      partialStrategy.decisions,
      1 / strategies.length,
    );
    return mergeConsequencesByPlayerScore(reduced, weightedConsequences);
  }, {});
};

export const setPlayerDecisionStrategyTotals = (strategy: PlayerDecisionStrategy) => {
  const dealerFinals = getDealerFinals();
  const consequences = decisionsToConsequences(strategy.decisions);
  strategy.summary = getStrategySummary(consequences, dealerFinals, strategy.options);
};

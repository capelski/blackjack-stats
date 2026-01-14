import {
  DecisionsByPlayerScore,
  DecisionsSummaryByPlayerScore,
  PlayerDecisionStrategy,
} from '../types/player-decision-strategy.type';
import { PlayerDecisionSummary } from '../types/player-decision.type';
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

export const setPlayerDecisionStrategyTotals = (strategy: PlayerDecisionStrategy) => {
  const dealerFinals = getDealerFinals();
  strategy.summary = getStrategySummary(strategy.decisions, dealerFinals, strategy.options);
};

export const aggregatePlayerDecisionStrategies = (strategies: PlayerDecisionStrategy[]) => {
  return strategies.reduce<DecisionsSummaryByPlayerScore>((reduced, partialStrategy) => {
    const weightedDecisions = multiplyDecisionsByPlayerScore(
      partialStrategy.decisions,
      1 / strategies.length,
    );
    return mergeDecisionsByPlayerScore(reduced, weightedDecisions);
  }, {});
};

export const mergeDecisionsByPlayerScore = (
  a: DecisionsSummaryByPlayerScore,
  b: DecisionsSummaryByPlayerScore,
) => {
  return Object.keys({ ...a, ...b }).reduce<DecisionsSummaryByPlayerScore>(
    (reduced, playerScoresLabel) => {
      const decisionA = a[playerScoresLabel];
      const decisionB = b[playerScoresLabel];

      const mergedDecision = !decisionA
        ? decisionB
        : !decisionB
        ? decisionA
        : {
            selectedConsequence: mergeConsequences([
              decisionA.selectedConsequence,
              decisionB.selectedConsequence,
            ]),
          };

      return { ...reduced, [playerScoresLabel]: mergedDecision };
    },
    {},
  );
};

export const multiplyDecisionsByPlayerScore = (
  decisions: DecisionsByPlayerScore,
  factor: number,
): DecisionsSummaryByPlayerScore => {
  return Object.keys(decisions).reduce<DecisionsSummaryByPlayerScore>(
    (reduced, playerScoresLabel) => {
      const playerDecision = decisions[playerScoresLabel];
      const weightedDecision: PlayerDecisionSummary = {
        selectedConsequence: multiplyConsequence(playerDecision.selectedConsequence, factor),
      };
      return { ...reduced, [playerScoresLabel]: weightedDecision };
    },
    {},
  );
};

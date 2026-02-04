import { Action } from '../enums/action.enum';
import { SearchMode } from '../enums/search-mode.enum';
import { CombinationsByFinalScore } from '../types/cards-combination.type';
import { FinalScoresMap } from '../types/final-scores.type';
import {
  ConsequencesByPlayerScore,
  DecisionsByPlayerScore,
  PlayerDecisionStrategy,
} from '../types/player-decision-strategy.type';
import { StrategyOptions } from '../types/strategy-options.type';
import { mergeConsequences, multiplyConsequence } from './consequence.logic';
import { getFinalScores } from './final-scores.logic';
import { getScoresLabel } from './labels.logic';
import { createStrategySummary, getStrategySummary } from './strategy-summary.logic';

export const createPlayerDecisionStrategy = (
  dealerFinalScores: FinalScoresMap,
  options: StrategyOptions = {},
): PlayerDecisionStrategy => {
  const strategy: PlayerDecisionStrategy = {
    dealerFinalScores,
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
  const consequences = decisionsToConsequences(strategy.decisions);

  const { combinations, finalScores } = getFinalScores<{
    combinations: CombinationsByFinalScore;
    finalScores: FinalScoresMap;
  }>(
    ({ canDouble, scores, splitCard }) => {
      const label = getScoresLabel(scores, {
        splitCard: strategy.options.splitting ? splitCard : undefined,
      });
      const action = strategy.decisions[label]?.action;
      const parsedAction =
        action === Action.double ? (canDouble ? Action.double : Action.hit) : action;

      return parsedAction;
    },
    {
      groupCombinationsByFinalScore: true,
      collectCombinations: true,
      searchMode: SearchMode.depthFirst,
    },
  );

  strategy.summary = getStrategySummary(
    consequences,
    strategy.dealerFinalScores,
    strategy.options,
    finalScores,
    combinations,
  );
};

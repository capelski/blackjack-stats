import { Action } from '../enums/action.enum';
import { SearchMode } from '../enums/search-mode.enum';
import { ConsequencesByPlayerScore } from '../types/consequence.type';
import { FinalScoresMap } from '../types/final-scores.type';
import { DecisionsByPlayerScore } from '../types/player-decision.type';
import { SelfAwareStrategy } from '../types/self-aware-strategy.type';
import { StrategyOptions } from '../types/strategy-options.type';
import { mergeConsequences, multiplyConsequence } from './consequence.logic';
import { getFinalScores } from './final-scores.logic';
import { getPlayerHandsSorted } from './hands.logic';
import { getScoresLabel } from './labels.logic';
import { createStrategySummary, getStrategySummary } from './strategy-summary.logic';

export const createSelfAwareStrategy = (
  dealerFinalScores: FinalScoresMap,
  options: StrategyOptions = {},
): SelfAwareStrategy => {
  const strategy: SelfAwareStrategy = {
    dealerFinalScores,
    decisions: {},
    options,
    summary: createStrategySummary(),
  };
  return strategy;
};

export const decisionsToConsequences = (
  decisions: DecisionsByPlayerScore,
  options: StrategyOptions,
  factor = 1,
): ConsequencesByPlayerScore => {
  const playerHands = getPlayerHandsSorted(options.splitting);

  return playerHands.reduce<ConsequencesByPlayerScore>((reduced, playerHand) => {
    const { selectedConsequence } = decisions[playerHand.label];
    const weightedConsequence = factor
      ? multiplyConsequence(selectedConsequence, factor)
      : selectedConsequence;

    return {
      ...reduced,
      [playerHand.label]: weightedConsequence,
    };
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

export const mergeSelfAwareStrategies = (strategies: SelfAwareStrategy[]) => {
  return strategies.reduce<ConsequencesByPlayerScore>((reduced, partialStrategy) => {
    const weightedConsequences = decisionsToConsequences(
      partialStrategy.decisions,
      partialStrategy.options,
      1 / strategies.length,
    );
    return mergeConsequencesByPlayerScore(reduced, weightedConsequences);
  }, {});
};

export const setSelfAwareStrategyTotals = (strategy: SelfAwareStrategy) => {
  const consequences = decisionsToConsequences(strategy.decisions, strategy.options);

  const { combinations, finalScores } = getFinalScores(
    ({ canDouble, canSplit, cards, scores }) => {
      const label = getScoresLabel(scores, {
        splitCard: canSplit ? cards[0] : undefined,
      });
      const action = strategy.decisions[label]?.action;
      const parsedAction =
        action === Action.double ? (canDouble ? Action.double : Action.hit) : action;

      return parsedAction;
    },
    {
      collectCombinations: true,
      searchMode: SearchMode.depthFirst,
      strategyOptions: strategy.options,
    },
  );

  strategy.summary = getStrategySummary(
    consequences,
    strategy.dealerFinalScores,
    finalScores,
    combinations,
  );
};

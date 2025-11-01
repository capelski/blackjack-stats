import { Action } from '../enums/action.enum';
import { ActionOutcomes } from '../types/outcomes.type';
import { PlayerDecisionStrategy } from '../types/player-decision-strategy.type';
import { StrategyOptions } from '../types/strategy-options.type';
import { getAction } from './actions.logic';
import { getDealerFinals } from './dealer-finals.logic';
import { getStandDecision } from './decisions.logic';
import { canDouble } from './doubling.logic';
import { getPlayerHands } from './hands.logic';
import { getInitialPairs } from './initial-pairs.logic';
import { getActionableLabels, getInitialPairLabels } from './labels.logic';
import {
  getDoubleOutcomes,
  getHitOutcomes,
  getSplitOutcomes,
  getStandOutcomes,
  mergeOutcomes,
  multiplyOutcomes,
  outcomesToValues,
} from './outcomes.logic';
import { toPercentage } from './percentages.logic';
import { getTable } from './table.logic';

export const getMaxReturnsStrategy = (options: StrategyOptions = {}) => {
  const dealerFinals = getDealerFinals();
  const maxReturnsStrategy: PlayerDecisionStrategy = {};

  for (const playerHand of getPlayerHands(options.splitting)) {
    if (playerHand.isFinal) {
      maxReturnsStrategy[playerHand.label] = getStandDecision(
        playerHand.effectiveScore,
        dealerFinals.probabilities,
      );
      continue;
    }

    const standOutcomes = getStandOutcomes(playerHand.effectiveScore, dealerFinals.probabilities);
    const additionalOutcomes: ActionOutcomes[] = [
      {
        action: Action.hit,
        outcomes: getHitOutcomes(
          playerHand.scores,
          (nextScoresLabel) => maxReturnsStrategy[nextScoresLabel],
        ),
      },
    ];

    if (canDouble(playerHand.scores, options.doubling)) {
      additionalOutcomes.push({
        action: Action.double,
        outcomes: getDoubleOutcomes(
          playerHand.scores,
          (nextScoresLabel) => maxReturnsStrategy[nextScoresLabel].standOutcomes,
        ),
      });
    }

    if (playerHand.splitLabel) {
      additionalOutcomes.push({
        action: Action.split,
        outcomes: getSplitOutcomes(maxReturnsStrategy[playerHand.splitLabel]),
      });
    }

    const { action, outcomes } = getAction(standOutcomes, additionalOutcomes);

    maxReturnsStrategy[playerHand.label] = {
      action,
      additionalOutcomes,
      outcomes,
      standOutcomes,
    };
  }

  return maxReturnsStrategy;
};

export const printMaxReturnsStrategy = (strategyOptions: StrategyOptions = {}) => {
  const strategy = getMaxReturnsStrategy(strategyOptions);

  const strategyHeaders = ['Score', 'Decision'];
  const strategyRows = getActionableLabels(strategyOptions.splitting).map((playerScoreLabel) => {
    return [playerScoreLabel, strategy[playerScoreLabel].action];
  });
  const strategyTable = getTable(strategyHeaders, strategyRows);

  console.log(strategyTable);

  const initialPairs = getInitialPairs(strategyOptions.splitting);
  const initialPairLabels = getInitialPairLabels(strategyOptions.splitting);

  const allScoresHeaders = ['Score', 'Returns'];
  const allScoresRows = initialPairLabels.map((playerScoresLabel) => {
    const decision = strategy[playerScoresLabel];

    return [playerScoresLabel, toPercentage(decision.outcomes.returns)];
  });
  const allScoresTable = getTable(allScoresHeaders, allScoresRows);

  console.log('\n');
  console.log(allScoresTable);

  const overallHeaders = ['Returns', 'Win', 'Lose', 'Push'];
  const overallOutcomes = mergeOutcomes(
    initialPairLabels.map((playerScoresLabel) => {
      const decision = strategy[playerScoresLabel];
      const initialProbability = initialPairs.probabilities[playerScoresLabel];

      return multiplyOutcomes(decision.outcomes, initialProbability);
    }),
  );
  const overallRows = [outcomesToValues(overallOutcomes)];
  const overallTable = getTable(overallHeaders, overallRows);

  console.log('\n');
  console.log(overallTable);
};

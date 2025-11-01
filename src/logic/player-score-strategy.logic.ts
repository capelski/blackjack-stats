import { Action } from '../enums/action.enum';
import { ActionOutcomes } from '../types/outcomes.type';
import { PlayerDecision } from '../types/player-decision.type';
import { PlayerScoreStrategy } from '../types/player-score-strategy.type';
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

export const getPlayerScoreStrategy = (options: StrategyOptions = {}) => {
  const dealerFinals = getDealerFinals();
  const playerScoreStrategy: PlayerScoreStrategy = {};

  for (const playerHand of getPlayerHands(options.splitting)) {
    playerScoreStrategy[playerHand.label] = playerScoreStrategy[playerHand.label] || {};

    if (playerHand.isFinal) {
      playerScoreStrategy[playerHand.label] = getStandDecision(
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
          (nextScoresLabel) => playerScoreStrategy[nextScoresLabel],
        ),
      },
      {
        action: Action.stand,
        outcomes: standOutcomes,
      },
    ];

    if (canDouble(playerHand.scores, options.doubling)) {
      additionalOutcomes.push({
        action: Action.double,
        outcomes: getDoubleOutcomes(
          playerHand.scores,
          (nextScoresLabel) => playerScoreStrategy[nextScoresLabel].standOutcomes,
        ),
      });
    }

    if (playerHand.splitLabel) {
      additionalOutcomes.push({
        action: Action.split,
        outcomes: getSplitOutcomes(playerScoreStrategy[playerHand.splitLabel]),
      });
    }

    const { action, outcomes } = getAction(standOutcomes, additionalOutcomes);
    const playerDecision: PlayerDecision = {
      action,
      additionalOutcomes,
      outcomes,
      standOutcomes,
    };

    playerScoreStrategy[playerHand.label] = playerScoreStrategy[playerHand.label] || {};
    playerScoreStrategy[playerHand.label] = playerDecision;
  }

  return playerScoreStrategy;
};

export const printPlayerScoreStrategy = (strategyOptions: StrategyOptions = {}) => {
  const strategy = getPlayerScoreStrategy(strategyOptions);

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

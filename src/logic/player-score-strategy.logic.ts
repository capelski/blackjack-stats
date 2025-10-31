import { ActionsOutcomes } from '../types/outcomes.type';
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

  for (const playerHand of getPlayerHands()) {
    playerScoreStrategy[playerHand.label] = playerScoreStrategy[playerHand.label] || {};

    if (playerHand.isFinal) {
      playerScoreStrategy[playerHand.label] = getStandDecision(
        playerHand.effectiveScore,
        dealerFinals.probabilities,
      );
      continue;
    }

    const outcomes: ActionsOutcomes = {
      double: getDoubleOutcomes(
        playerHand.scores,
        (nextScoresLabel) => playerScoreStrategy[nextScoresLabel].outcomes.stand,
      ),
      hit: getHitOutcomes(
        playerHand.scores,
        (nextScoresLabel) => playerScoreStrategy[nextScoresLabel],
      ),
      stand: getStandOutcomes(dealerFinals.probabilities, playerHand.effectiveScore),
    };

    const playerDecision: PlayerDecision = {
      action: getAction(outcomes, { canDouble: canDouble(playerHand.scores, options.doubling) }),
      outcomes,
    };

    playerScoreStrategy[playerHand.label] = playerScoreStrategy[playerHand.label] || {};
    playerScoreStrategy[playerHand.label] = playerDecision;
  }

  return playerScoreStrategy;
};

export const printPlayerScoreStrategy = (strategy: PlayerScoreStrategy) => {
  const strategyHeaders = ['Score', 'Decision'];
  const strategyRows = getActionableLabels().map((playerScoreLabel) => {
    return [playerScoreLabel, strategy[playerScoreLabel].action];
  });
  const strategyTable = getTable(strategyHeaders, strategyRows);

  console.log(strategyTable);

  const initialPairs = getInitialPairs();
  const initialPairLabels = getInitialPairLabels();

  const allScoresHeaders = ['Score', 'Returns'];
  const allScoresRows = initialPairLabels.map((playerScoresLabel) => {
    const decision = strategy[playerScoresLabel];
    const outcomes = decision.outcomes[decision.action];

    return [playerScoresLabel, toPercentage(outcomes.returns)];
  });
  const allScoresTable = getTable(allScoresHeaders, allScoresRows);

  console.log('\n');
  console.log(allScoresTable);

  const overallHeaders = ['Returns', 'Win', 'Lose', 'Push'];
  const overallOutcomes = mergeOutcomes(
    initialPairLabels.map((playerScoresLabel) => {
      const decision = strategy[playerScoresLabel];
      const outcomes = decision.outcomes[decision.action];
      const initialProbability = initialPairs.probabilities[playerScoresLabel];

      return multiplyOutcomes(outcomes, initialProbability);
    }),
  );
  const overallRows = [outcomesToValues(overallOutcomes)];
  const overallTable = getTable(overallHeaders, overallRows);

  console.log('\n');
  console.log(overallTable);
};

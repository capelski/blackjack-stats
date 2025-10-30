import { ActionsOutcomes } from '../types/outcomes.type';
import { PlayerDecision } from '../types/player-decision.type';
import { PlayerScoreStrategy } from '../types/player-score-strategy.type';
import { StrategyOptions } from '../types/strategy-options.type';
import { getAction } from './actions.logic';
import { getDealerFinals } from './dealer-finals.logic';
import { getStandDecision } from './decisions.logic';
import { canDouble } from './doubling.logic';
import { getInitialPairs } from './initial-pairs.logic';
import {
  blackjackLabel,
  bustLabel,
  getActionableLabels,
  getInitialPairLabels,
  getScoresLabel,
} from './labels.logic';
import {
  getDoubleOutcomes,
  getHitOutcomes,
  getStandOutcomes,
  mergeOutcomes,
  multiplyOutcomes,
  outcomesToValues,
} from './outcomes.logic';
import { toPercentage } from './percentages.logic';
import { blackjackScore, bustScore, getHighestScore, playerActionableScores } from './scores';
import { getTable } from './table.logic';

export const getPlayerScoreStrategy = (options: StrategyOptions = {}) => {
  const dealerFinals = getDealerFinals();

  const playerScoreStrategy: PlayerScoreStrategy = {
    [bustLabel]: getStandDecision(bustScore, dealerFinals.probabilities),
    [blackjackLabel]: getStandDecision(blackjackScore, dealerFinals.probabilities),
    21: getStandDecision(21, dealerFinals.probabilities),
    '11/21': getStandDecision(21, dealerFinals.probabilities),
  };

  playerActionableScores.forEach((playerScores) => {
    const scoresLabel = getScoresLabel(playerScores);

    const outcomes: ActionsOutcomes = {
      double: getDoubleOutcomes(
        playerScores,
        (nextScoresLabel) => playerScoreStrategy[nextScoresLabel].outcomes.stand,
      ),
      hit: getHitOutcomes(playerScores, (nextScoresLabel) => playerScoreStrategy[nextScoresLabel]),
      stand: getStandOutcomes(dealerFinals.probabilities, getHighestScore(playerScores)),
    };

    const playerDecision: PlayerDecision = {
      action: getAction(outcomes, { canDouble: canDouble(playerScores, options.doubling) }),
      outcomes,
    };

    playerScoreStrategy[scoresLabel] = playerScoreStrategy[scoresLabel] || {};
    playerScoreStrategy[scoresLabel] = playerDecision;
  });

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

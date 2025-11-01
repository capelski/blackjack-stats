import { Action } from '../enums/action.enum';
import { PlayerDecisionStrategy } from '../types/player-decision-strategy.type';
import { getDealerFinals } from './dealer-finals.logic';
import { getPlayerHands } from './hands.logic';
import { getInitialPairs } from './initial-pairs.logic';
import { getInitialPairLabels } from './labels.logic';
import {
  getStandOutcomes,
  mergeOutcomes,
  multiplyOutcomes,
  outcomesToValues,
} from './outcomes.logic';
import { toPercentage } from './percentages.logic';
import { getTable } from './table.logic';

export const getAlwaysStandStrategy = () => {
  const dealerFinals = getDealerFinals();
  const alwaysStandStrategy: PlayerDecisionStrategy = {};

  for (const playerHand of getPlayerHands()) {
    const standOutcomes = getStandOutcomes(playerHand.effectiveScore, dealerFinals.probabilities);

    alwaysStandStrategy[playerHand.label] = {
      action: Action.stand,
      additionalOutcomes: [],
      outcomes: standOutcomes,
      standOutcomes,
    };
  }

  return alwaysStandStrategy;
};

export const printAlwaysStandStrategy = () => {
  const strategy = getAlwaysStandStrategy();

  const initialPairs = getInitialPairs();
  const initialPairLabels = getInitialPairLabels();

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

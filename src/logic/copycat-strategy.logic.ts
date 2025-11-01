import { Action } from '../enums/action.enum';
import { ActionOutcomes } from '../types/outcomes.type';
import { PlayerDecisionStrategy } from '../types/player-decision-strategy.type';
import { getDealerFinals } from './dealer-finals.logic';
import { getStandDecision } from './decisions.logic';
import { getPlayerHands } from './hands.logic';
import { getInitialPairs } from './initial-pairs.logic';
import { getActionableLabels, getInitialPairLabels } from './labels.logic';
import {
  getHitOutcomes,
  getStandOutcomes,
  mergeOutcomes,
  multiplyOutcomes,
  outcomesToValues,
} from './outcomes.logic';
import { toPercentage } from './percentages.logic';
import { getTable } from './table.logic';

export const getCopycatStrategy = () => {
  const dealerFinals = getDealerFinals();
  const copycatStrategy: PlayerDecisionStrategy = {};

  for (const playerHand of getPlayerHands()) {
    if (playerHand.isFinal) {
      copycatStrategy[playerHand.label] = getStandDecision(
        playerHand.effectiveScore,
        dealerFinals.probabilities,
      );
      continue;
    }

    const standOutcomes = getStandOutcomes(playerHand.effectiveScore, dealerFinals.probabilities);
    let action = Action.stand;
    let outcomes = standOutcomes;
    const additionalOutcomes: ActionOutcomes[] = [];

    if (playerHand.effectiveScore < 17) {
      action = Action.hit;
      outcomes = getHitOutcomes(
        playerHand.scores,
        nextScoresLabel => copycatStrategy[nextScoresLabel],
      );
      additionalOutcomes.push({ action, outcomes });
    }

    copycatStrategy[playerHand.label] = {
      action,
      additionalOutcomes,
      outcomes,
      standOutcomes,
    };
  }

  return copycatStrategy;
};

export const printCopycatStrategy = () => {
  const strategy = getCopycatStrategy();

  const strategyHeaders = ['Score', 'Decision'];
  const strategyRows = getActionableLabels().map(playerScoreLabel => {
    return [playerScoreLabel, strategy[playerScoreLabel].action];
  });
  const strategyTable = getTable(strategyHeaders, strategyRows);

  console.log(strategyTable);

  const initialPairs = getInitialPairs();
  const initialPairLabels = getInitialPairLabels();

  const allScoresHeaders = ['Score', 'Returns'];
  const allScoresRows = initialPairLabels.map(playerScoresLabel => {
    const decision = strategy[playerScoresLabel];

    return [playerScoresLabel, toPercentage(decision.outcomes.returns)];
  });
  const allScoresTable = getTable(allScoresHeaders, allScoresRows);

  console.log('\n');
  console.log(allScoresTable);

  const overallHeaders = ['Returns', 'Win', 'Lose', 'Push'];
  const overallOutcomes = mergeOutcomes(
    initialPairLabels.map(playerScoresLabel => {
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

import { PlayerDecisionStrategy } from '../types/player-decision-strategy.type';
import { getDealerFinals } from './dealer-finals.logic';
import { getStandDecision } from './decisions.logic';
import { getPlayerHands } from './hands.logic';
import { getOutcomesLabels, outcomesToValues } from './outcomes.logic';
import {
  getIndividualOutcomesTable,
  getOverallFinalProbabilitiesTable,
  getOverallOutcomesTable,
} from './table.logic';

export const getAlwaysStandStrategy = () => {
  const dealerFinals = getDealerFinals();
  const alwaysStandStrategy: PlayerDecisionStrategy = {};

  for (const playerHand of getPlayerHands()) {
    alwaysStandStrategy[playerHand.label] = getStandDecision(
      playerHand.effectiveScore,
      dealerFinals.probabilities,
    );
  }

  return alwaysStandStrategy;
};

export const printAlwaysStandStrategy = () => {
  const strategy = getAlwaysStandStrategy();

  const overallFinalProbabilitiesTable = getOverallFinalProbabilitiesTable(
    playerScoresLabel => strategy[playerScoresLabel].selectedOutcomes.finalProbabilities,
  );

  const individualOutcomesTable = getIndividualOutcomesTable(
    ['Score', ...getOutcomesLabels()],
    playerScoresLabel => {
      const outcomes = strategy[playerScoresLabel].selectedOutcomes;
      return [playerScoresLabel, ...outcomesToValues(outcomes)];
    },
  );

  const overallOutcomesTable = getOverallOutcomesTable(
    playerScoresLabel => strategy[playerScoresLabel].selectedOutcomes,
  );

  console.log(
    `${overallFinalProbabilitiesTable}\n
${individualOutcomesTable}\n
${overallOutcomesTable}`,
  );
};

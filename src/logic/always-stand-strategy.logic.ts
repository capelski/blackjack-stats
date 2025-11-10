import { PlayerDecisionStrategy } from '../types/player-decision-strategy.type';
import { getDealerFinals } from './dealer-finals.logic';
import { getStandDecision } from './decisions.logic';
import { getPlayerHands } from './hands.logic';
import {
  printOverallFinalProbabilitiesTable,
  printOverallReturnsTable,
  printReturnsTable,
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

  printOverallFinalProbabilitiesTable(
    playerScoresLabel => strategy[playerScoresLabel].selectedOutcomes.finalProbabilities,
  );

  console.log('\n');

  printReturnsTable(playerScoresLabel => strategy[playerScoresLabel].selectedOutcomes.returns);

  console.log('\n');

  printOverallReturnsTable(playerScoresLabel => strategy[playerScoresLabel].selectedOutcomes);
};

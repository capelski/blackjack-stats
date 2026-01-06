import { PlayerDecisionStrategy } from '../types/player-decision-strategy.type';
import { getDealerFinals } from './dealer-finals.logic';
import { getHitDecision, getStandDecision } from './decisions.logic';
import { getPlayerHands } from './hands.logic';
import { printPlayerDecisionStrategyTables } from './table.logic';

export const getStandStrategy = (threshold: number) => {
  const dealerFinals = getDealerFinals();
  const copycatStrategy: PlayerDecisionStrategy = {};

  for (const playerHand of getPlayerHands()) {
    copycatStrategy[playerHand.label] = getStandDecision(
      playerHand.effectiveScore,
      dealerFinals.probabilities,
    );

    if (!playerHand.isFinal && playerHand.effectiveScore < threshold) {
      copycatStrategy[playerHand.label] = getHitDecision(
        playerHand.scores,
        copycatStrategy[playerHand.label].standOutcomes,
        nextScoresLabel => copycatStrategy[nextScoresLabel],
      );
    }
  }

  return copycatStrategy;
};

export const printStandStrategy = (threshold: number) => {
  const strategy = getStandStrategy(threshold);
  printPlayerDecisionStrategyTables(strategy);
};

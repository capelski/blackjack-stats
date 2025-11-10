import { PlayerDecisionStrategy } from '../types/player-decision-strategy.type';
import { getDealerFinals } from './dealer-finals.logic';
import { getHitDecision, getStandDecision } from './decisions.logic';
import { getPlayerHands } from './hands.logic';
import { printPlayerDecisionStrategyTables } from './table.logic';

export const getCopycatStrategy = () => {
  const dealerFinals = getDealerFinals();
  const copycatStrategy: PlayerDecisionStrategy = {};

  for (const playerHand of getPlayerHands()) {
    copycatStrategy[playerHand.label] = getStandDecision(
      playerHand.effectiveScore,
      dealerFinals.probabilities,
    );

    if (!playerHand.isFinal && playerHand.effectiveScore < 17) {
      copycatStrategy[playerHand.label] = getHitDecision(
        playerHand.scores,
        copycatStrategy[playerHand.label].standOutcomes,
        nextScoresLabel => copycatStrategy[nextScoresLabel],
      );
    }
  }

  return copycatStrategy;
};

export const printCopycatStrategy = () => {
  const strategy = getCopycatStrategy();
  printPlayerDecisionStrategyTables(strategy);
};

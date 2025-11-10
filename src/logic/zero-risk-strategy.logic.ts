import { PlayerDecisionStrategy } from '../types/player-decision-strategy.type';
import { getDealerFinals } from './dealer-finals.logic';
import { getHitDecision, getStandDecision } from './decisions.logic';
import { getPlayerHands } from './hands.logic';
import { printPlayerDecisionStrategyTables } from './table.logic';

export const getZeroRiskStrategy = () => {
  const dealerFinals = getDealerFinals();
  const zeroRiskStrategy: PlayerDecisionStrategy = {};

  for (const playerHand of getPlayerHands()) {
    zeroRiskStrategy[playerHand.label] = getStandDecision(
      playerHand.effectiveScore,
      dealerFinals.probabilities,
    );

    if (!playerHand.isFinal && (playerHand.effectiveScore < 12 || playerHand.scores.length > 1)) {
      zeroRiskStrategy[playerHand.label] = getHitDecision(
        playerHand.scores,
        zeroRiskStrategy[playerHand.label].standOutcomes,
        nextScoresLabel => zeroRiskStrategy[nextScoresLabel],
      );
    }
  }

  return zeroRiskStrategy;
};

export const printZeroRiskStrategy = () => {
  const strategy = getZeroRiskStrategy();
  printPlayerDecisionStrategyTables(strategy);
};

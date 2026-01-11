import { PlayerDecisionStrategy } from '../../types/player-decision-strategy.type';
import { getDealerFinals } from '../dealer-finals.logic';
import { getHitDecision, getStandDecision } from '../decisions.logic';
import { getFinalProbabilities } from '../final-scores.logic';
import { getPlayerHands } from '../hands.logic';
import { printPlayerDecisionStrategyTables } from '../table.logic';

export const getZeroRiskStrategy = () => {
  const dealerFinals = getDealerFinals();
  const strategy: PlayerDecisionStrategy = {};

  for (const playerHand of getPlayerHands()) {
    strategy[playerHand.label] = getStandDecision(
      playerHand.effectiveScore,
      getFinalProbabilities(dealerFinals),
    );

    if (!playerHand.isFinal && (playerHand.effectiveScore < 12 || playerHand.scores.length > 1)) {
      strategy[playerHand.label] = getHitDecision(
        playerHand.scores,
        strategy[playerHand.label].standConsequence,
        nextScoresLabel => strategy[nextScoresLabel],
      );
    }
  }

  return strategy;
};

export const printZeroRiskStrategy = () => {
  const strategy = getZeroRiskStrategy();
  printPlayerDecisionStrategyTables(strategy);
};

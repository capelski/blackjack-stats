import { getDealerFinals } from '../dealer-finals.logic';
import { getHitDecision, getStandDecision } from '../decisions.logic';
import { getFinalProbabilities } from '../final-scores.logic';
import { getPlayerHands } from '../hands.logic';
import {
  createPlayerDecisionStrategy,
  setPlayerDecisionStrategyTotals,
} from '../player-decision-strategy.logic';
import { printPlayerDecisionStrategyTables } from '../table.logic';

export const getZeroRiskStrategy = () => {
  const dealerFinals = getDealerFinals();
  const strategy = createPlayerDecisionStrategy(dealerFinals);

  for (const playerHand of getPlayerHands()) {
    strategy.decisions[playerHand.label] = getStandDecision(
      playerHand.effectiveScore,
      getFinalProbabilities(dealerFinals),
    );

    if (!playerHand.isFinal && (playerHand.effectiveScore < 12 || playerHand.scores.length > 1)) {
      strategy.decisions[playerHand.label] = getHitDecision(
        playerHand.scores,
        strategy.decisions[playerHand.label].standConsequence,
        nextScoresLabel => strategy.decisions[nextScoresLabel],
      );
    }
  }

  setPlayerDecisionStrategyTotals(strategy);

  return strategy;
};

export const printZeroRiskStrategy = () => {
  const strategy = getZeroRiskStrategy();
  printPlayerDecisionStrategyTables(strategy);
};

import { getDealerFinals } from '../dealer-finals.logic';
import { getHitDecision, getStandDecision } from '../decisions.logic';
import { getFinalProbabilities } from '../final-scores.logic';
import { getPlayerHands } from '../hands.logic';
import {
  createPlayerDecisionStrategy,
  setPlayerDecisionStrategyTotals,
} from '../player-decision-strategy.logic';
import { printPlayerDecisionStrategyTables } from '../table.logic';

export const getStandStrategy = (threshold: number) => {
  const dealerFinals = getDealerFinals();
  const strategy = createPlayerDecisionStrategy(dealerFinals);
  const dealerProbabilities = getFinalProbabilities(dealerFinals);

  for (const playerHand of getPlayerHands()) {
    strategy.decisions[playerHand.label] = getStandDecision(
      playerHand.effectiveScore,
      dealerProbabilities,
    );

    if (!playerHand.isFinal && playerHand.effectiveScore < threshold) {
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

export const printStandStrategy = (threshold: number) => {
  const strategy = getStandStrategy(threshold);
  printPlayerDecisionStrategyTables(strategy);
};

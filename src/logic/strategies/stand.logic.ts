import { PlayerDecisionStrategy } from '../../types/player-decision-strategy.type';
import { getDealerFinals } from '../dealer-finals.logic';
import { getHitDecision, getStandDecision } from '../decisions.logic';
import { getFinalProbabilities } from '../final-scores.logic';
import { getPlayerHands } from '../hands.logic';
import { printPlayerDecisionStrategyTables } from '../table.logic';

export const getStandStrategy = (threshold: number) => {
  const dealerFinals = getDealerFinals();
  const strategy: PlayerDecisionStrategy = {};

  for (const playerHand of getPlayerHands()) {
    strategy[playerHand.label] = getStandDecision(
      playerHand.effectiveScore,
      getFinalProbabilities(dealerFinals),
    );

    if (!playerHand.isFinal && playerHand.effectiveScore < threshold) {
      strategy[playerHand.label] = getHitDecision(
        playerHand.scores,
        strategy[playerHand.label].standConsequence,
        nextScoresLabel => strategy[nextScoresLabel],
      );
    }
  }

  return strategy;
};

export const printStandStrategy = (threshold: number) => {
  const strategy = getStandStrategy(threshold);
  printPlayerDecisionStrategyTables(strategy);
};

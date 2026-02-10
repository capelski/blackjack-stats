import { getDealerFinals } from '../dealer-finals.logic';
import { getHitDecision, getStandDecision } from '../decisions.logic';
import { getFinalProbabilities } from '../final-scores.logic';
import { getPlayerHands } from '../hands.logic';
import { createSelfAwareStrategy, setSelfAwareStrategyTotals } from '../self-aware-strategy.logic';
import { printSelfAwareStrategyTables } from '../table.logic';

export const getZeroRiskStrategy = () => {
  const dealerFinals = getDealerFinals();
  const strategy = createSelfAwareStrategy(dealerFinals);
  const dealerProbabilities = getFinalProbabilities(dealerFinals);

  for (const playerHand of getPlayerHands()) {
    strategy.decisions[playerHand.label] = getStandDecision(playerHand, dealerProbabilities);

    if (!playerHand.isFinal && (playerHand.effectiveScore < 12 || playerHand.scores.length > 1)) {
      strategy.decisions[playerHand.label] = getHitDecision(
        playerHand,
        strategy.decisions[playerHand.label].standConsequence,
        nextScoresLabel => strategy.decisions[nextScoresLabel],
      );
    }
  }

  setSelfAwareStrategyTotals(strategy);

  return strategy;
};

export const printZeroRiskStrategy = () => {
  const strategy = getZeroRiskStrategy();
  printSelfAwareStrategyTables(['naive', 'zero-risk'], strategy);
};

import { DealerCardStrategy } from '../types/dealer-card-strategy.type';
import { ActionsOutcomes } from '../types/outcomes.type';
import { PlayerDecision } from '../types/player-decision.type';
import { StrategyOptions } from '../types/strategy-options.type';
import { getAction } from './actions.logic';
import { cards } from './cards.logic';
import { getDealerFinalsByCard } from './dealer-finals-by-card.logic';
import { getStandDecision } from './decisions.logic';
import { canDouble } from './doubling.logic';
import { getPlayerHands } from './hands.logic';
import { getInitialPairs } from './initial-pairs.logic';
import { getAbbreviatedAction, getActionableLabels, getInitialPairLabels } from './labels.logic';
import {
  getDoubleOutcomes,
  getHitOutcomes,
  getStandOutcomes,
  mergeOutcomes,
  multiplyOutcomes,
  outcomesToValues,
} from './outcomes.logic';
import { toPercentage } from './percentages.logic';
import { getTable } from './table.logic';

export const getDealerCardStrategy = (options: StrategyOptions = {}) => {
  const dealerFinalsByCard = getDealerFinalsByCard();
  const dealerCardStrategy: DealerCardStrategy = {};

  cards.forEach((dealerCard) => {
    const dealerProbabilities = dealerFinalsByCard[dealerCard].probabilities;

    for (const playerHand of getPlayerHands()) {
      dealerCardStrategy[playerHand.label] = dealerCardStrategy[playerHand.label] || {};

      if (playerHand.isFinal) {
        dealerCardStrategy[playerHand.label][dealerCard] = getStandDecision(
          playerHand.effectiveScore,
          dealerProbabilities,
        );
        continue;
      }

      const outcomes: ActionsOutcomes = {
        double: getDoubleOutcomes(
          playerHand.scores,
          (nextScoresLabel) => dealerCardStrategy[nextScoresLabel][dealerCard].outcomes.stand,
        ),
        hit: getHitOutcomes(
          playerHand.scores,
          (nextScoresLabel) => dealerCardStrategy[nextScoresLabel][dealerCard],
        ),
        stand: getStandOutcomes(dealerProbabilities, playerHand.effectiveScore),
      };

      const playerDecision: PlayerDecision = {
        action: getAction(outcomes, { canDouble: canDouble(playerHand.scores, options.doubling) }),
        outcomes,
      };

      dealerCardStrategy[playerHand.label] = dealerCardStrategy[playerHand.label] || {};
      dealerCardStrategy[playerHand.label][dealerCard] = playerDecision;
    }
  });

  return dealerCardStrategy;
};

export const printDealerCardStrategy = (strategy: DealerCardStrategy) => {
  const strategyHeaders = ['', ...cards];
  const strategyRows = getActionableLabels().map((playerScoreLabel) => {
    const decisions = cards.map((dealerCard) => {
      return getAbbreviatedAction(strategy[playerScoreLabel][dealerCard].action);
    });
    return [playerScoreLabel, ...decisions];
  });
  const strategyTable = getTable(strategyHeaders, strategyRows);

  console.log(strategyTable);

  const initialPairs = getInitialPairs();
  const initialPairLabels = getInitialPairLabels();

  const allScoresHeaders = ['', ...cards];
  const allScoresRows = initialPairLabels.map((playerScoresLabel) => {
    const allReturns = cards.map((dealerCard) => {
      const decision = strategy[playerScoresLabel][dealerCard];
      return toPercentage(decision.outcomes[decision.action].returns);
    });

    return [playerScoresLabel, ...allReturns];
  });
  const allScoresTable = getTable(allScoresHeaders, allScoresRows);

  console.log('\n');
  console.log(allScoresTable);

  const overallHeaders = ['Returns', 'Win', 'Lose', 'Push'];
  const overallOutcomes = mergeOutcomes(
    initialPairLabels.map((playerScoresLabel) => {
      const allOutcomes = cards.map((dealerCard) => {
        const decision = strategy[playerScoresLabel][dealerCard];
        return decision.outcomes[decision.action];
      });
      const aggregatedOutcomes = mergeOutcomes(allOutcomes);

      const initialProbability = initialPairs.probabilities[playerScoresLabel];
      const averageOutcomes = multiplyOutcomes(aggregatedOutcomes, 1 / allOutcomes.length);
      return multiplyOutcomes(averageOutcomes, initialProbability);
    }),
  );
  const overallRows = [outcomesToValues(overallOutcomes)];
  const overallTable = getTable(overallHeaders, overallRows);

  console.log('\n');
  console.log(overallTable);
};

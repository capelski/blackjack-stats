import { Action } from '../enums/action.enum';
import { DealerCardStrategy } from '../types/dealer-card-strategy.type';
import { FinalProbabilities } from '../types/finals.type';
import { ActionOutcomes } from '../types/outcomes.type';
import { StrategyOptions } from '../types/strategy-options.type';
import { getAction } from './actions.logic';
import { cards } from './cards.logic';
import { getDealerFinalsByCard } from './dealer-finals-by-card.logic';
import { getStandDecision } from './decisions.logic';
import { canDouble } from './doubling.logic';
import { getPlayerHands } from './hands.logic';
import { getAbbreviatedAction, getActionableLabels, getInitialPairLabels } from './labels.logic';
import {
  getDoubleOutcomes,
  getHitOutcomes,
  getSplitOutcomes,
  getStandOutcomes,
  mergeOutcomes,
  multiplyOutcomes,
} from './outcomes.logic';
import { toPercentage } from './percentages.logic';
import { mergeFinalProbabilities, multiplyFinalProbabilities } from './player-finals.logic';
import {
  getTable,
  printOverallFinalProbabilitiesTable,
  printOverallReturnsTable,
} from './table.logic';

export const getDealerCardStrategy = (options: StrategyOptions = {}) => {
  const dealerFinalsByCard = getDealerFinalsByCard();
  const dealerCardStrategy: DealerCardStrategy = {};

  cards.forEach(dealerCard => {
    const dealerProbabilities = dealerFinalsByCard[dealerCard].probabilities;

    for (const playerHand of getPlayerHands(options.splitting)) {
      dealerCardStrategy[playerHand.label] = dealerCardStrategy[playerHand.label] || {};

      if (playerHand.isFinal) {
        dealerCardStrategy[playerHand.label][dealerCard] = getStandDecision(
          playerHand.effectiveScore,
          dealerProbabilities,
        );
        continue;
      }

      const standOutcomes = getStandOutcomes(playerHand.effectiveScore, dealerProbabilities);
      const additionalOutcomes: ActionOutcomes[] = [
        {
          action: Action.hit,
          outcomes: getHitOutcomes(
            playerHand.scores,
            nextScoresLabel => dealerCardStrategy[nextScoresLabel][dealerCard],
          ),
        },
      ];

      if (canDouble(playerHand.scores, options.doubling)) {
        additionalOutcomes.push({
          action: Action.double,
          outcomes: getDoubleOutcomes(
            playerHand.scores,
            nextScoresLabel => dealerCardStrategy[nextScoresLabel][dealerCard].standOutcomes,
          ),
        });
      }

      if (playerHand.splitLabel) {
        additionalOutcomes.push({
          action: Action.split,
          outcomes: getSplitOutcomes(dealerCardStrategy[playerHand.splitLabel][dealerCard]),
        });
      }

      const { action, selectedOutcomes } = getAction(standOutcomes, additionalOutcomes);

      dealerCardStrategy[playerHand.label][dealerCard] = {
        action,
        additionalOutcomes,
        selectedOutcomes,
        standOutcomes,
      };
    }
  });

  return dealerCardStrategy;
};

export const printDealerCardStrategy = (strategyOptions: StrategyOptions = {}) => {
  const strategy = getDealerCardStrategy(strategyOptions);

  const strategyHeaders = ['', ...cards];
  const strategyRows = getActionableLabels(strategyOptions.splitting).map(playerScoresLabel => {
    const decisions = cards.map(dealerCard => {
      return getAbbreviatedAction(strategy[playerScoresLabel][dealerCard].action);
    });
    return [playerScoresLabel, ...decisions];
  });
  const strategyTable = getTable(strategyHeaders, strategyRows);

  console.log(strategyTable);

  const finalsHeaders = ['', ...cards];
  const finalsRows = getActionableLabels(strategyOptions.splitting).map(playerScoresLabel => {
    const allFinalProbabilities = cards.map(dealerCard => {
      const decision = strategy[playerScoresLabel][dealerCard];
      return Object.keys(decision.selectedOutcomes.finalProbabilities)
        .map(finalScoreLabel => {
          return `${finalScoreLabel}: ${toPercentage(
            decision.selectedOutcomes.finalProbabilities[finalScoreLabel],
          )}`;
        })
        .join(' / ');
    });

    return [playerScoresLabel, ...allFinalProbabilities];
  });
  const finalsTable = getTable(finalsHeaders, finalsRows);

  console.log('\n');
  console.log(finalsTable);

  const initialPairLabels = getInitialPairLabels(strategyOptions.splitting);

  console.log('\n');

  printOverallFinalProbabilitiesTable(playerScoresLabel => {
    const allProbabilities = cards.map(dealerCard => {
      const decision = strategy[playerScoresLabel][dealerCard];
      return multiplyFinalProbabilities(
        decision.selectedOutcomes.finalProbabilities,
        1 / cards.length,
      );
    });
    return allProbabilities.reduce<FinalProbabilities>(mergeFinalProbabilities, {});
  }, strategyOptions);

  const allScoresHeaders = ['', ...cards];
  const allScoresRows = initialPairLabels.map(playerScoresLabel => {
    const allReturns = cards.map(dealerCard => {
      const decision = strategy[playerScoresLabel][dealerCard];
      return toPercentage(decision.selectedOutcomes.returns);
    });

    return [playerScoresLabel, ...allReturns];
  });
  const allScoresTable = getTable(allScoresHeaders, allScoresRows);

  console.log('\n');
  console.log(allScoresTable);

  console.log('\n');

  printOverallReturnsTable(playerScoresLabel => {
    const allOutcomes = cards.map(dealerCard => {
      const decision = strategy[playerScoresLabel][dealerCard];
      return decision.selectedOutcomes;
    });
    const aggregatedOutcomes = mergeOutcomes(allOutcomes);
    return multiplyOutcomes(aggregatedOutcomes, 1 / allOutcomes.length);
  }, strategyOptions);
};

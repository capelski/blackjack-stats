import { Action } from '../../enums/action.enum';
import { DealerCardStrategy } from '../../types/dealer-card-strategy.type';
import { FinalProbabilities } from '../../types/finals.type';
import { ActionOutcomes } from '../../types/outcomes.type';
import { StrategyOptions } from '../../types/strategy-options.type';
import { getAction } from '../actions.logic';
import { cards } from '../cards.logic';
import { getDealerFinalsByCard } from '../dealer-finals-by-card.logic';
import { getStandDecision } from '../decisions.logic';
import { canDouble } from '../doubling.logic';
import { getPlayerHands } from '../hands.logic';
import { getAbbreviatedAction } from '../labels.logic';
import {
  getDoubleOutcomes,
  getHitOutcomes,
  getOutcomesLabels,
  getSplitOutcomes,
  getStandOutcomes,
  mergeOutcomes,
  multiplyOutcomes,
  outcomesToValues,
} from '../outcomes.logic';
import { toPercentage } from '../percentages.logic';
import { mergeFinalProbabilities, multiplyFinalProbabilities } from '../player-finals.logic';
import {
  getActionsTable,
  getIndividualFinalProbabilitiesTable,
  getIndividualOutcomesTable,
  getOverallFinalProbabilitiesTable,
  getOverallOutcomesTable,
} from '../table.logic';

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

  const actionsTable = getActionsTable(
    ['', ...cards],
    playerScoresLabel => {
      const actions = cards.map(dealerCard => {
        return getAbbreviatedAction(strategy[playerScoresLabel][dealerCard].action);
      });
      return [playerScoresLabel, ...actions];
    },
    strategyOptions,
  );

  const overallFinalProbabilitiesTable = getOverallFinalProbabilitiesTable(playerScoresLabel => {
    const allProbabilities = cards.map(dealerCard => {
      const decision = strategy[playerScoresLabel][dealerCard];
      return multiplyFinalProbabilities(
        decision.selectedOutcomes.finalProbabilities,
        1 / cards.length,
      );
    });
    return allProbabilities.reduce<FinalProbabilities>(mergeFinalProbabilities, {});
  }, strategyOptions);

  const overallOutcomesTable = getOverallOutcomesTable(playerScoresLabel => {
    const allOutcomes = cards.map(dealerCard => {
      const decision = strategy[playerScoresLabel][dealerCard];
      return decision.selectedOutcomes;
    });
    const aggregatedOutcomes = mergeOutcomes(allOutcomes);
    return multiplyOutcomes(aggregatedOutcomes, 1 / allOutcomes.length);
  }, strategyOptions);

  const individualFinalProbabilitiesTable = getIndividualFinalProbabilitiesTable(
    ['', ...cards],
    playerScoresLabel => {
      const allFinalProbabilities = cards.map(dealerCard => {
        const finalProbabilities =
          strategy[playerScoresLabel][dealerCard].selectedOutcomes.finalProbabilities;
        return Object.keys(finalProbabilities)
          .map(finalScoreLabel => {
            return `${finalScoreLabel}: ${toPercentage(finalProbabilities[finalScoreLabel])}`;
          })
          .join(' / ');
      });

      return [playerScoresLabel, ...allFinalProbabilities];
    },
    strategyOptions,
  );

  const individualOutcomesTable = getIndividualOutcomesTable(
    ['', ...cards],
    playerScoresLabel => {
      const outcomesLabels = getOutcomesLabels();
      const allReturns = cards.map(dealerCard => {
        const decision = strategy[playerScoresLabel][dealerCard];
        const outcomes = outcomesToValues(decision.selectedOutcomes);
        return outcomesLabels.map((label, index) => `${label}: ${outcomes[index]}`).join(' / ');
      });

      return [playerScoresLabel, ...allReturns];
    },
    strategyOptions,
  );

  console.log(
    `${actionsTable}\n
${overallFinalProbabilitiesTable}\n
${overallOutcomesTable}\n
${individualFinalProbabilitiesTable}\n
${individualOutcomesTable}`,
  );
};

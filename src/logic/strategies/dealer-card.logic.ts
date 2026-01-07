import { Action } from '../../enums/action.enum';
import { DealerCardStrategy } from '../../types/dealer-card-strategy.type';
import { ActionOutcomes } from '../../types/outcomes.type';
import { StrategyOptions } from '../../types/strategy-options.type';
import { getAction } from '../actions.logic';
import { cards } from '../cards.logic';
import { getDealerFinalsByCard } from '../dealer-finals-by-card.logic';
import { getStandDecision } from '../decisions.logic';
import { canDouble } from '../doubling.logic';
import { getPlayerHands } from '../hands.logic';
import {
  getDoubleOutcomes,
  getHitOutcomes,
  getSplitOutcomes,
  getStandOutcomes,
} from '../outcomes.logic';
import { printDealerCardStrategyTables } from '../table.logic';

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
  printDealerCardStrategyTables(strategy, strategyOptions);
};

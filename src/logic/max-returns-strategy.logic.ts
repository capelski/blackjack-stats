import { Action } from '../enums/action.enum';
import { ActionOutcomes } from '../types/outcomes.type';
import { PlayerDecisionStrategy } from '../types/player-decision-strategy.type';
import { StrategyOptions } from '../types/strategy-options.type';
import { getAction } from './actions.logic';
import { getDealerFinals } from './dealer-finals.logic';
import { getStandDecision } from './decisions.logic';
import { canDouble } from './doubling.logic';
import { getPlayerHands } from './hands.logic';
import {
  getDoubleOutcomes,
  getHitOutcomes,
  getSplitOutcomes,
  getStandOutcomes,
} from './outcomes.logic';
import { printPlayerDecisionStrategyTables } from './table.logic';

export const getMaxReturnsStrategy = (options: StrategyOptions = {}) => {
  const dealerFinals = getDealerFinals();
  const maxReturnsStrategy: PlayerDecisionStrategy = {};

  for (const playerHand of getPlayerHands(options.splitting)) {
    if (playerHand.isFinal) {
      maxReturnsStrategy[playerHand.label] = getStandDecision(
        playerHand.effectiveScore,
        dealerFinals.probabilities,
      );
      continue;
    }

    const standOutcomes = getStandOutcomes(playerHand.effectiveScore, dealerFinals.probabilities);
    const additionalOutcomes: ActionOutcomes[] = [
      {
        action: Action.hit,
        outcomes: getHitOutcomes(
          playerHand.scores,
          nextScoresLabel => maxReturnsStrategy[nextScoresLabel],
        ),
      },
    ];

    if (canDouble(playerHand.scores, options.doubling)) {
      additionalOutcomes.push({
        action: Action.double,
        outcomes: getDoubleOutcomes(
          playerHand.scores,
          nextScoresLabel => maxReturnsStrategy[nextScoresLabel].standOutcomes,
        ),
      });
    }

    if (playerHand.splitLabel) {
      additionalOutcomes.push({
        action: Action.split,
        outcomes: getSplitOutcomes(maxReturnsStrategy[playerHand.splitLabel]),
      });
    }

    const { action, selectedOutcomes } = getAction(standOutcomes, additionalOutcomes);

    maxReturnsStrategy[playerHand.label] = {
      action,
      additionalOutcomes,
      selectedOutcomes,
      standOutcomes,
    };
  }

  return maxReturnsStrategy;
};

export const printMaxReturnsStrategy = (strategyOptions: StrategyOptions = {}) => {
  const strategy = getMaxReturnsStrategy(strategyOptions);
  printPlayerDecisionStrategyTables(strategy, strategyOptions);
};

import { Action } from '../../enums/action.enum';
import { Consequence, ConsequenceByAction } from '../../types/consequence.type';
import { FinalProbabilities } from '../../types/final-scores.type';
import { PlayerDecisionStrategy } from '../../types/player-decision-strategy.type';
import { PlayerDecision } from '../../types/player-decision.type';
import { StrategyOptions } from '../../types/strategy-options.type';
import {
  getDoubleConsequence,
  getHitConsequence,
  getSplitConsequence,
  getStandConsequence,
} from '../consequence.logic';
import { getDealerFinals } from '../dealer-finals.logic';
import { getStandDecision } from '../decisions.logic';
import { canDouble } from '../doubling.logic';
import { getFinalProbabilities } from '../final-scores.logic';
import { getPlayerHands } from '../hands.logic';
import { printPlayerDecisionStrategyTables } from '../table.logic';

export const selectConsequence = (
  standConsequence: Consequence,
  additionalConsequences: ConsequenceByAction,
): PlayerDecision => {
  const { action, selectedConsequence } = Object.keys(additionalConsequences).reduce<{
    action: Action;
    selectedConsequence: Consequence;
  }>(
    (reduced, actionStr) => {
      const action = actionStr as Action;
      const consequence = additionalConsequences[action]!;
      return consequence.outcomes.returns > reduced.selectedConsequence.outcomes.returns
        ? { action, selectedConsequence: consequence }
        : reduced;
    },
    {
      action: Action.stand,
      selectedConsequence: standConsequence,
    },
  );

  return {
    action,
    additionalConsequences,
    selectedConsequence,
    standConsequence,
  };
};

export const maxReturnsCore = (
  dealerFinals: FinalProbabilities,
  options: StrategyOptions,
): PlayerDecisionStrategy => {
  const strategy: PlayerDecisionStrategy = {};

  for (const playerHand of getPlayerHands(options.splitting)) {
    if (playerHand.isFinal) {
      strategy[playerHand.label] = getStandDecision(playerHand.effectiveScore, dealerFinals);
      continue;
    }

    const standConsequence = getStandConsequence(playerHand.effectiveScore, dealerFinals);
    const additionalConsequences: ConsequenceByAction = {
      [Action.hit]: getHitConsequence(
        playerHand.scores,
        nextScoresLabel => strategy[nextScoresLabel],
      ),
    };

    if (canDouble(playerHand.scores, options.doubling)) {
      additionalConsequences[Action.double] = getDoubleConsequence(
        playerHand.scores,
        nextScoresLabel => strategy[nextScoresLabel].standConsequence,
      );
    }

    if (playerHand.splitLabel) {
      additionalConsequences[Action.split] = getSplitConsequence(strategy[playerHand.splitLabel]);
    }

    strategy[playerHand.label] = selectConsequence(standConsequence, additionalConsequences);
  }

  return strategy;
};

export const getMaxReturnsStrategy = (options: StrategyOptions = {}) => {
  const dealerFinals = getDealerFinals();
  return maxReturnsCore(getFinalProbabilities(dealerFinals), options);
};

export const printMaxReturnsStrategy = (strategyOptions: StrategyOptions = {}) => {
  const strategy = getMaxReturnsStrategy(strategyOptions);
  printPlayerDecisionStrategyTables(strategy, strategyOptions);
};

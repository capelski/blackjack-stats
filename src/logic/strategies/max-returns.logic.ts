import { Action } from '../../enums/action.enum';
import { Consequence, ConsequenceByAction } from '../../types/consequence.type';
import { FinalProbabilities } from '../../types/final-probabilities.type';
import { DecisionsByPlayerScore, PlayerDecision } from '../../types/player-decision.type';
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
import {
  createPlayerDecisionStrategy,
  setPlayerDecisionStrategyTotals,
} from '../player-decision-strategy.logic';
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
      return consequence.outcomes.roi > reduced.selectedConsequence.outcomes.roi
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
): DecisionsByPlayerScore => {
  const decisions: DecisionsByPlayerScore = {};

  for (const playerHand of getPlayerHands(options.splitting)) {
    if (playerHand.isFinal) {
      decisions[playerHand.label] = getStandDecision(playerHand, dealerFinals);
      continue;
    }

    const standConsequence = getStandConsequence(playerHand, dealerFinals);
    const additionalConsequences: ConsequenceByAction = {
      [Action.hit]: getHitConsequence(playerHand, nextScoresLabel => decisions[nextScoresLabel]),
    };

    if (canDouble(playerHand.scores, options.doubling)) {
      additionalConsequences[Action.double] = getDoubleConsequence(
        playerHand,
        nextScoresLabel => decisions[nextScoresLabel].standConsequence,
      );
    }

    if (playerHand.splitLabel) {
      additionalConsequences[Action.split] = getSplitConsequence(
        decisions[playerHand.splitLabel],
        playerHand.initialProbability,
      );
    }

    decisions[playerHand.label] = selectConsequence(standConsequence, additionalConsequences);
  }

  return decisions;
};

export const getMaxReturnsStrategy = (options: StrategyOptions = {}) => {
  const dealerFinals = getDealerFinals();
  const strategy = createPlayerDecisionStrategy(dealerFinals, options);

  strategy.decisions = maxReturnsCore(getFinalProbabilities(dealerFinals), options);

  setPlayerDecisionStrategyTotals(strategy);

  return strategy;
};

export const printMaxReturnsStrategy = (strategyOptions: StrategyOptions = {}) => {
  const strategy = getMaxReturnsStrategy(strategyOptions);
  printPlayerDecisionStrategyTables(strategy);
};

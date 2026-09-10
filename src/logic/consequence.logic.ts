import {
  Action,
  double,
  hit,
  split,
  stand,
  surrender as surrenderAction,
} from '../models/action.model';
import { cards } from '../models/cards.model';
import { surrender as surrenderResult } from '../models/result.model';
import { blackjackScore, surrenderScore } from '../models/scores.model';
import { AbstractHand } from '../types/abstract-hand.type';
import { Consequence, FinalProbabilities } from '../types/consequence.type';
import { EdgeContribution } from '../types/edge-contribution.type';
import { FinalScore } from '../types/final-score.type';
import { HandModifiers } from '../types/hand-modifiers.type';
import { ResolvedHand, ResolvedHandsMap } from '../types/resolved-hand.type';
import { Rules } from '../types/rules.type';
import { getBetMultiplier } from './bet-multiplier.logic';
import { createEdgeContributions } from './edge-contribution.logic';
import { getEdge } from './edge.logic';
import { getExpectedResult } from './expected-results.logic';
import { createFinalScore } from './final-scores-list.logic';
import { getNextHandLabel } from './labels.logic';

export type FutureHandsConsequenceParameters = [
  AbstractHand,
  Rules,
  AbstractHand[],
  ResolvedHandsMap,
];

export const getDoubleConsequence = (
  ...[abstractHand, rules, abstractHands, futureResolvedHandsMap]: FutureHandsConsequenceParameters
): Consequence => {
  const futureConsequences = getFutureConsequences(
    abstractHand.label,
    double,
    rules,
    abstractHands,
    futureResolvedHandsMap,
    () => stand,
  );

  const { edge, finalProbabilities } = mergeFutureConsequences(futureConsequences);

  return {
    action: double,
    edge: edge * 2,
    finalProbabilities,
  };
};

export const getHitConsequence = (
  ...[abstractHand, rules, abstractHands, futureResolvedHandsMap]: FutureHandsConsequenceParameters
): Consequence => {
  const futureConsequences = getFutureConsequences(
    abstractHand.label,
    hit,
    rules,
    abstractHands,
    futureResolvedHandsMap,
    (resolvedHand) => resolvedHand.action,
  );

  const { edge, finalProbabilities } = mergeFutureConsequences(futureConsequences);

  return {
    action: hit,
    edge,
    finalProbabilities,
  };
};

export const getSplitConsequence = (
  ...[abstractHand, rules, abstractHands, futureResolvedHandsMap]: FutureHandsConsequenceParameters
): Consequence => {
  const futureConsequences = getFutureConsequences(
    abstractHand.label,
    split,
    rules,
    abstractHands,
    futureResolvedHandsMap,
    (resolvedHand) => resolvedHand.action,
  );

  const { edge, finalProbabilities } = mergeFutureConsequences(futureConsequences);

  return {
    action: split,
    edge: edge * 2, // This is not consistent with material hands
    finalProbabilities,
  };
};

export const getStandConsequence = (
  abstractHand: AbstractHand,
  dealerScores: FinalScore[],
): Consequence => {
  const finalScore = createFinalScore(abstractHand.effectiveScore, {
    isBlackjack: abstractHand.effectiveScore === blackjackScore,
  });
  finalScore.probability = 1;

  const expectedResult = getExpectedResult(finalScore, dealerScores);
  const edgeContributions = createEdgeContributions(expectedResult);

  return {
    action: stand,
    edge: getEdge(edgeContributions),
    finalProbabilities: { [finalScore.score]: 1 },
  };
};

export const getSurrenderConsequence = (): Consequence => {
  const modifiers: HandModifiers = { isSurrender: true };
  const result = surrenderResult;
  const betMultiplier = getBetMultiplier(modifiers, result);
  const probability = 1;

  const edgeContributions: EdgeContribution[] = [{ betMultiplier, modifiers, probability, result }];

  return {
    action: surrenderAction,
    edge: getEdge(edgeContributions),
    finalProbabilities: { [surrenderScore]: probability },
  };
};

const increaseFinalProbabilities = (
  finalProbabilities: FinalProbabilities,
  toAdd: FinalProbabilities,
  weight = 1,
) => {
  for (const score in toAdd) {
    const scoreNumber = parseFloat(score);
    if (!finalProbabilities[scoreNumber]) {
      finalProbabilities[scoreNumber] = 0;
    }
    finalProbabilities[scoreNumber] += toAdd[scoreNumber] * weight;
  }
};

const getFutureConsequences = (
  label: string,
  action: typeof double | typeof hit | typeof split,
  rules: Rules,
  abstractHands: AbstractHand[],
  futureResolvedHandsMap: ResolvedHandsMap,
  getFutureAction: (resolvedHand: ResolvedHand) => Action,
): Consequence[] => {
  const futureConsequences = cards.map((card) => {
    const futureLabel = getNextHandLabel(abstractHands, rules, label, action, card)!;
    const futureResolvedHand = futureResolvedHandsMap[futureLabel];
    const futureAction = getFutureAction(futureResolvedHand);
    const futureConsequence = futureResolvedHand.consequences[futureAction]!;

    return futureConsequence;
  });

  return futureConsequences;
};

export const mergeFutureConsequences = (
  futureConsequences: Consequence[],
): Pick<Consequence, 'edge' | 'finalProbabilities'> => {
  let edge = 0;
  const finalProbabilities: FinalProbabilities = {};
  const weight = 1 / futureConsequences.length;

  for (const futureConsequence of futureConsequences) {
    increaseFinalProbabilities(finalProbabilities, futureConsequence.finalProbabilities, weight);
    edge += futureConsequence.edge * weight;
  }

  return { edge, finalProbabilities };
};

import { Action, double, hit, split, stand, surrender } from '../models/action.model';
import { cards } from '../models/cards.model';
import { surrender as surrenderResult } from '../models/result.model';
import { blackjackScore, surrenderScore } from '../models/scores.model';
import { AbstractHand } from '../types/abstract-hand.type';
import { Consequence, FinalProbabilities } from '../types/consequence.type';
import { FinalScore } from '../types/final-score.type';
import { EdgeContribution } from '../types/outcomes.type';
import { ResolvedHand, ResolvedHandsMap } from '../types/resolved-hand.type';
import { Rules } from '../types/rules.type';
import { isDoubleBetAction } from './action.logic';
import { getBetMultiplier } from './bet-multiplier.logic';
import { getEdge } from './edge.logic';
import { getExpectedResult } from './expected-results.logic';
import { createFinalScore } from './final-scores-list.logic';
import { getNextHandLabel } from './labels.logic';
import {
  createEdgeContributions,
  mergeEdgeContributions,
  rebaseEdgeContributions,
} from './outcomes.logic';

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

  return mergeFutureConsequences(futureConsequences, double);
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

  return mergeFutureConsequences(futureConsequences, hit);
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

  return mergeFutureConsequences(futureConsequences, split);
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
    edgeContributions,
    finalProbabilities: { [finalScore.score]: 1 },
  };
};

export const getSurrenderConsequence = (): Consequence => {
  const betMultiplier = getBetMultiplier({ isSurrender: true });

  const edgeContributions: EdgeContribution[] = [
    { betMultiplier, probability: 1, result: surrenderResult },
  ];

  return {
    action: surrender,
    edge: getEdge(edgeContributions),
    edgeContributions,
    finalProbabilities: { [surrenderScore]: 1 },
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
  action: typeof double | typeof hit | typeof split,
) => {
  const mergedConsequence: Consequence = {
    action,
    edge: 0,
    edgeContributions: [],
    finalProbabilities: {},
  };
  const weight = 1 / futureConsequences.length;

  for (const futureConsequence of futureConsequences) {
    increaseFinalProbabilities(
      mergedConsequence.finalProbabilities,
      futureConsequence.finalProbabilities,
      weight,
    );
    mergeEdgeContributions(
      mergedConsequence.edgeContributions,
      futureConsequence.edgeContributions,
      weight,
    );
  }

  if (isDoubleBetAction(action)) {
    mergedConsequence.edgeContributions = rebaseEdgeContributions(
      mergedConsequence.edgeContributions,
      2,
    );
  }

  mergedConsequence.edge = getEdge(mergedConsequence.edgeContributions);

  return mergedConsequence;
};

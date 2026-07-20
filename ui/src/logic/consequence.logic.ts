import { Action, double, hit, split, stand } from '../models/action.model';
import { cards } from '../models/cards.model';
import { blackjackScore } from '../models/scores.model';
import { AbstractHand } from '../types/abstract-hand.type';
import { Consequence, FinalProbabilities } from '../types/consequence.type';
import { FinalScoreBase } from '../types/final-score.type';
import { ResolvedHand, ResolvedHandsMap } from '../types/resolved-hand.type';
import { Rules } from '../types/rules.type';
import { getBetMultiplier } from './bet-multiplier.logic';
import { getEdge } from './edge.logic';
import { getExpectedResult } from './expected-results.logic';
import { getNextHandLabel } from './labels.logic';
import { createOutcomesByBetMultiplier, increaseOutcomesByBetMultiplier } from './outcomes.logic';

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

  return mergeFutureConsequences(futureConsequences, double, 2);
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
    resolvedHand => resolvedHand.action,
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
    resolvedHand => resolvedHand.action,
  );

  return mergeFutureConsequences(futureConsequences, split, 2);
};

export const getStandConsequence = (abstractHand: AbstractHand): Consequence => {
  const betMultiplier = getBetMultiplier(1, {
    isBlackjack: abstractHand.effectiveScore === blackjackScore,
  });
  const finalScore: FinalScoreBase = {
    score: abstractHand.effectiveScore,
    probability: 1,
    probabilityByBetMultiplier: {
      [betMultiplier]: 1,
    },
  };

  const expectedResult = getExpectedResult(finalScore);

  return {
    finalProbabilities: { [finalScore.score]: 1 },
    action: stand,
    outcomesByBetMultiplier: expectedResult.outcomesByBetMultiplier,
    edge: expectedResult.edge,
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
  const futureConsequences = cards.map(card => {
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
  multiplier = 1,
) => {
  const mergedConsequence: Consequence = {
    action,
    finalProbabilities: {},
    outcomesByBetMultiplier: createOutcomesByBetMultiplier({}),
    edge: 0,
  };
  const weight = 1 / futureConsequences.length;

  for (const futureConsequence of futureConsequences) {
    increaseFinalProbabilities(
      mergedConsequence.finalProbabilities,
      futureConsequence.finalProbabilities,
      weight,
    );
    increaseOutcomesByBetMultiplier(
      mergedConsequence.outcomesByBetMultiplier,
      futureConsequence.outcomesByBetMultiplier,
      weight,
      multiplier,
    );
  }

  mergedConsequence.edge = getEdge(mergedConsequence.outcomesByBetMultiplier);

  return mergedConsequence;
};

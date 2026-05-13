import { double, hit, split, stand } from '../models/action.model';
import { cards } from '../models/cards.model';
import { Consequence, FinalProbabilities } from '../types/consequence.type';
import { FinalScoreBase } from '../types/final-score.type';
import { ResolvedHandsMap } from '../types/resolved-hand.type';
import { Rules } from '../types/rules.type';
import { getBetMultiplier } from './bet-multiplier.logic';
import { getExpectedResult } from './expected-results.logic';
import { getNextLabel, getNextLabelAndScores } from './labels.logic';
import { createOutcomes, increaseOutcomes } from './outcomes.logic';
import { getEffectiveScore, getScoresFromScores } from './scores.logic';

export const getDoubleConsequence = (
  rules: Rules,
  scores: number[],
  betMultiplier: number,
): Consequence => {
  const doubleConsequence: Consequence = {
    action: double,
    finalProbabilities: {},
    outcomes: createOutcomes(),
    edge: 0,
  };

  const weight = 1 / cards.length;

  for (const card of cards) {
    const nextScores = getScoresFromScores(rules, {
      allScores: [scores, card.scores],
      // The player will never have two cards after doubling
      hasTwoCards: false,
      isPostSplit: false,
    });
    const nextEffectiveScore = getEffectiveScore(nextScores);

    const nextBetMultiplier = getBetMultiplier(betMultiplier, { isDoubleBet: true });
    const standConsequence = getStandConsequence(nextEffectiveScore, nextBetMultiplier);

    increaseFinalProbabilities(
      doubleConsequence.finalProbabilities,
      standConsequence.finalProbabilities,
      weight,
    );
    increaseOutcomes(doubleConsequence.outcomes, standConsequence.outcomes, weight);
    doubleConsequence.edge += standConsequence.edge * weight;
  }

  return doubleConsequence;
};

export type HitConsequenceParameters = {
  isPostSplit: boolean;
  isPostSplitAces: boolean;
  isSingleCard: boolean;
  scores: number[];
  splitSymbol?: string;
};

export const getHitConsequence = (
  rules: Rules,
  futureResolvedHandsMap: ResolvedHandsMap,
  { isPostSplit, isPostSplitAces, isSingleCard, scores, splitSymbol }: HitConsequenceParameters,
): Consequence => {
  const nextConsequences = cards.map(card => {
    const nextResolvedHand = getNextResolvedHand(rules, futureResolvedHandsMap, {
      allScores: [scores, card.scores],
      // When hitting a hand with a single card (i.e. after splitting), the player will have two cards
      hasTwoCards: isSingleCard,
      isPostSplit,
      isPostSplitAces,
      splitSymbol,
    });
    return nextResolvedHand.consequences[nextResolvedHand.action]!;
  });

  return getHitConsequenceCore(nextConsequences);
};

export const getHitConsequenceCore = (nextConsequences: Consequence[]): Consequence => {
  const hitConsequence: Consequence = {
    action: hit,
    finalProbabilities: {},
    outcomes: createOutcomes(),
    edge: 0,
  };

  const weight = 1 / nextConsequences.length;

  for (const nextConsequence of nextConsequences) {
    increaseFinalProbabilities(
      hitConsequence.finalProbabilities,
      nextConsequence.finalProbabilities,
      weight,
    );
    increaseOutcomes(hitConsequence.outcomes, nextConsequence.outcomes, weight);
    hitConsequence.edge += nextConsequence.edge * weight;
  }

  return hitConsequence;
};

type NextResolvedHandParameters = {
  allScores: number[][];
  hasTwoCards: boolean;
  isPostSplit: boolean;
  isPostSplitAces: boolean;
  splitSymbol?: string;
};

const getNextResolvedHand = (
  rules: Rules,
  futureResolvedHandsMap: ResolvedHandsMap,
  { allScores, hasTwoCards, isPostSplit, isPostSplitAces, splitSymbol }: NextResolvedHandParameters,
) => {
  const { label } = getNextLabelAndScores(rules, {
    allScores,
    hasTwoCards,
    isPostSplit,
    isPostSplitAces,
    // The player will never get to a split hand after hitting
    splitSymbol: undefined,
  });
  const nextResolvedHand = futureResolvedHandsMap[label];

  if (!nextResolvedHand) {
    const [firstScores] = allScores;
    const label = getNextLabel(rules, {
      isPostSplit,
      isPostSplitAces,
      scores: firstScores,
      splitSymbol,
    });
    throw new Error(`The "${label}" resolved hand is not available before ${label}`);
  }

  return nextResolvedHand;
};

export const getSplitConsequence = (
  postSplitLabel: string,
  futureResolvedHandsMap: ResolvedHandsMap,
): Consequence => {
  const nextResolvedHand = futureResolvedHandsMap[postSplitLabel];
  const nextConsequence = nextResolvedHand.consequences[nextResolvedHand.action]!;

  const { edge, finalProbabilities, outcomes } = nextConsequence;

  const splitConsequence: Consequence = {
    action: split,
    finalProbabilities,
    outcomes,
    edge,
  };

  return splitConsequence;
};

export const getStandConsequence = (score: number, betMultiplier: number): Consequence => {
  const finalScore: FinalScoreBase = {
    score,
    probability: 1,
  };
  const expectedResult = getExpectedResult(finalScore, { [betMultiplier]: 1 });

  return {
    finalProbabilities: { [score]: 1 },
    action: stand,
    outcomes: expectedResult.outcomes,
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

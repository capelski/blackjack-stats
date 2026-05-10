import { double, hit, split, stand } from '../models/action.model';
import { cards } from '../models/cards.model';
import { Consequence, FinalProbabilities } from '../types/consequence.type';
import { FinalScoreBase } from '../types/final-score.type';
import { ResolvedHandsMap } from '../types/hand.type';
import { Rules } from '../types/rules.type';
import { getBetMultiplier } from './bet-multiplier.logic';
import { getExpectedResult } from './expected-results.logic';
import { getLabelFromScores } from './labels.logic';
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
      cardsNumber: -1,
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

export const getHitConsequence = (
  rules: Rules,
  scores: number[],
  isPostSplit: boolean,
  isPostSplitAces: boolean,
  futureResolvedHandsMap: ResolvedHandsMap,
): Consequence => {
  const nextConsequences = cards.map(card => {
    const nextResolvedHand = getNextResolvedHand(rules, {
      allScores: [scores, card.scores],
      futureResolvedHandsMap,
      isPostSplit,
      isPostSplitAces,
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

type NextResolvedHand = {
  allScores: number[][];
  futureResolvedHandsMap: ResolvedHandsMap;
  isPostSplit: boolean;
  isPostSplitAces: boolean;
};

const getNextResolvedHand = (
  rules: Rules,
  { allScores, futureResolvedHandsMap, isPostSplit, isPostSplitAces }: NextResolvedHand,
) => {
  const nextScores = getScoresFromScores(rules, {
    allScores,
    cardsNumber: -1,
    isPostSplit,
  });
  const nextLabel = getLabelFromScores(rules, { scores: nextScores, isPostSplit, isPostSplitAces });
  const nextResolvedHand = futureResolvedHandsMap[nextLabel];

  if (!nextResolvedHand) {
    const [firstScores] = allScores;
    const label = getLabelFromScores(rules, { scores: firstScores, isPostSplit, isPostSplitAces });
    throw new Error(`The "${nextLabel}" resolved hand is not available before ${label}`);
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
  const expectedResults = getExpectedResult(finalScore, { [betMultiplier]: 1 });

  return {
    finalProbabilities: { [score]: 1 },
    action: stand,
    outcomes: expectedResults.outcomes,
    edge: expectedResults.edge,
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

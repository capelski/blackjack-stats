import { double, hit, stand } from '../models/action.model';
import { cards } from '../models/cards.model';
import { Consequence, FinalProbabilities } from '../types/consequence.type';
import { FinalScoreBase } from '../types/final-score.type';
import { ResolvedHandsMap } from '../types/hand.type';
import { getBetMultiplier } from './bet-multiplier.logic';
import { getExpectedResult } from './expected-results.logic';
import { getLabelFromScores } from './labels.logic';
import { createOutcomes, increaseOutcomes } from './outcomes.logic';
import { getEffectiveScore, getScoresFromScores } from './scores.logic';

export const getDoubleConsequence = (scores: number[]): Consequence => {
  const doubleConsequence: Consequence = {
    action: double,
    finalProbabilities: {},
    outcomes: createOutcomes(),
    edge: 0,
  };

  const weight = 1 / cards.length;

  for (const card of cards) {
    const nextScores = getScoresFromScores([scores, card.scores], {
      cardsNumber: undefined,
      isPostSplit: false,
    });
    const nextEffectiveScore = getEffectiveScore(nextScores);

    const betMultiplier = getBetMultiplier({ isDoubleBet: true });
    const standConsequence = getStandConsequence(nextEffectiveScore, betMultiplier);

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
  scores: number[],
  futureResolvedHandsMap: ResolvedHandsMap,
): Consequence => {
  const nextConsequences = cards.map(card => {
    const nextResolvedHand = getNextResolvedHand([scores, card.scores], futureResolvedHandsMap);
    return nextResolvedHand.consequences[nextResolvedHand.action as typeof stand]!;
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

const getNextResolvedHand = (allScores: number[][], futureResolvedHandsMap: ResolvedHandsMap) => {
  const nextScores = getScoresFromScores(allScores, {
    cardsNumber: undefined,
    isPostSplit: false,
  });
  const nextLabel = getLabelFromScores(nextScores);
  const nextResolvedHand = futureResolvedHandsMap[nextLabel];

  if (!nextResolvedHand) {
    const [firstScores] = allScores;
    const label = getLabelFromScores(firstScores);
    throw new Error(`The "${nextLabel}" resolved hand is not available before ${label}`);
  }

  return nextResolvedHand;
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

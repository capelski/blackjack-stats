import { hit, stand } from '../models/action.model';
import { cards } from '../models/cards.model';
import { blackjackScore } from '../models/scores.model';
import { Consequence, FinalProbabilities } from '../types/consequence.type';
import { FinalScoreBase } from '../types/final-score.type';
import { ResolvedHandsMap } from '../types/hand.type';
import { getBetMultiplier } from './bet-multiplier.logic';
import { getExpectedResult } from './expected-results.logic';
import { getLabelFromScores } from './labels.logic';
import { createOutcomes, increaseOutcomes } from './outcomes.logic';
import { getScoresFromScores } from './scores.logic';

export const getHitConsequence = (
  scores: number[],
  futureResolvedHandsMap: ResolvedHandsMap,
): Consequence => {
  const hitConsequence: Consequence = {
    action: hit,
    finalProbabilities: {},
    outcomes: createOutcomes(),
    edge: 0,
  };

  for (const card of cards) {
    const nextResolvedHand = getNextResolvedHand([scores, card.scores], futureResolvedHandsMap);
    const nextConsequence = nextResolvedHand.consequences[nextResolvedHand.action as typeof stand]!;
    const weight = 1 / cards.length;

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

export const getStandConsequence = (score: number): Consequence => {
  const finalScore: FinalScoreBase = {
    score,
    probability: 1,
  };
  const betMultiplier = getBetMultiplier({ isBlackjack: score === blackjackScore });
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

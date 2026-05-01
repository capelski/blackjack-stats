import { hit, stand } from '../models/action.model';
import { cards } from '../models/cards.model';
import { blackjackScore } from '../models/scores.model';
import { Consequence, FinalProbabilities } from '../types/consequence.type';
import { FinalScoreBase } from '../types/final-score.type';
import { HandIdentitiesMap } from '../types/hand-identity.type';
import { getBetMultiplier } from './bet-multiplier.logic';
import { getExpectedResult } from './expected-results.logic';
import { getLabelFromScores } from './labels.logic';
import { createOutcomes, increaseOutcomes } from './outcomes.logic';
import { getScoresFromScores } from './scores.logic';

export const getHitConsequence = (
  scores: number[],
  handIdentitiesMap: HandIdentitiesMap,
): Consequence => {
  const hitConsequence: Consequence = {
    action: hit,
    finalProbabilities: {},
    outcomes: createOutcomes(),
    edge: 0,
  };

  for (const card of cards) {
    const nextHandIdentity = getNextHandIdentity([scores, card.scores], handIdentitiesMap);
    const nextConsequence = nextHandIdentity.selectedConsequence;
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

const getNextHandIdentity = (allScores: number[][], handIdentitiesMap: HandIdentitiesMap) => {
  const nextScores = getScoresFromScores(allScores, {
    cardsNumber: undefined,
    isPostSplit: false,
  });
  const nextLabel = getLabelFromScores(nextScores);
  return handIdentitiesMap[nextLabel];
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

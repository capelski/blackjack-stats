import { FinalScore, FinalScoresMap } from '../types/final-score.type';
import { MaterialHand } from '../types/material-hand.type';
import { getSortedNumericKeys } from './numbers.logic';

export const getFinalScoresList = (hands: MaterialHand[]): FinalScore[] => {
  const finalScoresMap: FinalScoresMap = {};

  for (const hand of hands) {
    if (!hand.isFinal) {
      continue;
    }

    if (!finalScoresMap[hand.effectiveScore]) {
      finalScoresMap[hand.effectiveScore] = {
        hands: [],
        probability: 0,
        probabilityByBetMultiplier: {},
        score: hand.effectiveScore,
      };
    }

    const finalScore = finalScoresMap[hand.effectiveScore];
    finalScore.hands.push(hand);
    finalScore.probability += hand.probability;
    if (!finalScore.probabilityByBetMultiplier[hand.betMultiplier]) {
      finalScore.probabilityByBetMultiplier[hand.betMultiplier] = 0;
    }
    finalScore.probabilityByBetMultiplier[hand.betMultiplier] += hand.probability;
  }

  for (const finalScore of Object.values(finalScoresMap)) {
    for (const betMultiplier of getSortedNumericKeys(finalScore.probabilityByBetMultiplier)) {
      finalScore.probabilityByBetMultiplier[betMultiplier] /= finalScore.probability;
    }
  }

  const sortedKeys = getSortedNumericKeys(finalScoresMap);

  return sortedKeys.map(key => finalScoresMap[key]);
};

export const getFinalScoresTotals = (
  finalScores: FinalScore[],
): { totalHands: number; totalProbability: number } => {
  return finalScores.reduce(
    (reduced, finalScore) => {
      reduced.totalHands += Array.isArray(finalScore.hands) ? finalScore.hands.length : 0;
      reduced.totalProbability += finalScore.probability;
      return reduced;
    },
    { totalHands: 0, totalProbability: 0 },
  );
};

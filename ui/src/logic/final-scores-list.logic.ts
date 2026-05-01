import { BetMultiplierMap } from '../types/bet-multiplier.type';
import { FinalScore, FinalScoresMap } from '../types/final-score.type';
import { HandWithAction } from '../types/hand.type';
import { getSortedNumericKeys } from './numbers.logic';

export const getFinalScoresList = (hands: HandWithAction[]): FinalScore[] => {
  const finalScoresMap: FinalScoresMap = {};

  for (const hand of hands) {
    if (!hand.isFinal) {
      continue;
    }

    if (!finalScoresMap[hand.effectiveScore]) {
      finalScoresMap[hand.effectiveScore] = {
        hands: [],
        probability: 0,
        score: hand.effectiveScore,
      };
    }

    const finalScore = finalScoresMap[hand.effectiveScore];
    finalScore.hands.push(hand);
    finalScore.probability += hand.probability;
  }

  const sortedKeys = getSortedNumericKeys(finalScoresMap);

  return sortedKeys.map(key => finalScoresMap[key]);
};

export const getProbabilityByBetMultiplier = (finalScore: FinalScore): BetMultiplierMap => {
  const probabilityByBetMultiplier: BetMultiplierMap = {};

  for (const hand of finalScore.hands) {
    if (!probabilityByBetMultiplier[hand.betMultiplier]) {
      probabilityByBetMultiplier[hand.betMultiplier] = 0;
    }
    probabilityByBetMultiplier[hand.betMultiplier] += hand.probability;
  }

  return probabilityByBetMultiplier;
};

import { FinalScore, FinalScoresByFirstCard, FinalScoresMap } from '../types/final-score.type';
import { MaterialHand } from '../types/material-hand.type';
import { getSortedNumericKeys } from './numbers.logic';

const addHandToFinalScore = (finalScore: FinalScore, hand: MaterialHand): void => {
  finalScore.hands.push(hand);
  finalScore.probability += hand.probability;
  if (!finalScore.probabilityByBetMultiplier[hand.betMultiplier]) {
    finalScore.probabilityByBetMultiplier[hand.betMultiplier] = 0;
  }
  finalScore.probabilityByBetMultiplier[hand.betMultiplier] += hand.probability;
};

const createFinalScore = (effectiveScore: number): FinalScore => ({
  hands: [],
  probability: 0,
  probabilityByBetMultiplier: {},
  score: effectiveScore,
});

export const getFinalScoresList = (hands: MaterialHand[]): FinalScore[] => {
  const finalScoresMap: FinalScoresMap = {};

  for (const hand of hands) {
    if (!hand.isFinal) {
      continue;
    }

    if (!finalScoresMap[hand.effectiveScore]) {
      finalScoresMap[hand.effectiveScore] = createFinalScore(hand.effectiveScore);
    }
    const finalScore = finalScoresMap[hand.effectiveScore];

    addHandToFinalScore(finalScore, hand);
  }

  return getSortedFinalScores(finalScoresMap);
};

export const getFinalScoresByFirstCard = (hands: MaterialHand[]): FinalScoresByFirstCard => {
  const finalScoresByFirstCard: FinalScoresByFirstCard = {};

  for (const hand of hands) {
    if (!hand.isFinal) {
      continue;
    }

    const firstCardSymbol = hand.cards[0].symbol;

    if (!finalScoresByFirstCard[firstCardSymbol]) {
      finalScoresByFirstCard[firstCardSymbol] = {};
    }
    const finalScoresGroup = finalScoresByFirstCard[firstCardSymbol];

    if (!finalScoresGroup[hand.effectiveScore]) {
      finalScoresGroup[hand.effectiveScore] = createFinalScore(hand.effectiveScore);
    }
    const finalScoreEntry = finalScoresGroup[hand.effectiveScore];

    addHandToFinalScore(finalScoreEntry, hand);
  }

  return finalScoresByFirstCard;
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

export const getSortedFinalScores = (finalScoresMap: FinalScoresMap): FinalScore[] => {
  const sortedKeys = getSortedNumericKeys(finalScoresMap);
  return sortedKeys.map(key => finalScoresMap[key]);
};

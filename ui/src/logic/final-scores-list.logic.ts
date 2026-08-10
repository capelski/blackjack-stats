import { tenCardsSymbols, tenCardUnifiedSymbol } from '../models/cards.model';
import {
  FinalScore,
  FinalScoresByFirstCard,
  FinalScoresGroup,
  FinalScoresMap,
} from '../types/final-score.type';
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

const createFinalScoresGroup = (): FinalScoresGroup => {
  return {
    finalScores: {},
    probability: 0,
  };
};

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
    const applicableSymbol = tenCardsSymbols.includes(firstCardSymbol)
      ? tenCardUnifiedSymbol
      : firstCardSymbol;

    if (!finalScoresByFirstCard[applicableSymbol]) {
      finalScoresByFirstCard[applicableSymbol] = createFinalScoresGroup();
    }
    const finalScoresGroup = finalScoresByFirstCard[applicableSymbol];
    finalScoresGroup.probability += hand.probability;

    if (!finalScoresGroup.finalScores[hand.effectiveScore]) {
      finalScoresGroup.finalScores[hand.effectiveScore] = createFinalScore(hand.effectiveScore);
    }
    const finalScoreEntry = finalScoresGroup.finalScores[hand.effectiveScore];

    addHandToFinalScore(finalScoreEntry, hand);
  }

  for (const finalScoresGroup of Object.values(finalScoresByFirstCard)) {
    for (const finalScore of Object.values(finalScoresGroup.finalScores)) {
      finalScore.probability /= finalScoresGroup.probability;
    }
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

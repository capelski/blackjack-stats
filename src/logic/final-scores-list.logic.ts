import { surrender } from '../models/action.model';
import { tenCardsSymbols, tenCardUnifiedSymbol } from '../models/cards.model';
import { surrenderScore } from '../models/scores.model';
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

/** Surrendered hands are grouped apart from the hands that stand on the same score */
const getHandFinalScore = (hand: MaterialHand): number =>
  hand.action === surrender ? surrenderScore : hand.effectiveScore;

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

    const score = getHandFinalScore(hand);

    if (!finalScoresMap[score]) {
      finalScoresMap[score] = createFinalScore(score);
    }
    const finalScore = finalScoresMap[score];

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

    const score = getHandFinalScore(hand);

    if (!finalScoresGroup.finalScores[score]) {
      finalScoresGroup.finalScores[score] = createFinalScore(score);
    }
    const finalScoreEntry = finalScoresGroup.finalScores[score];

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

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

/** Adds the hand to the final score of its score & bet multiplier, creating it when missing */
const addHandToFinalScores = (finalScoresMap: FinalScoresMap, hand: MaterialHand): void => {
  const score = getHandFinalScore(hand);
  const id = getFinalScoreId(score, hand.betMultiplier);

  if (!finalScoresMap[id]) {
    finalScoresMap[id] = createFinalScore(score, hand.betMultiplier);
  }
  const finalScore = finalScoresMap[id];

  finalScore.hands.push(hand);
  finalScore.probability += hand.probability;
};

export const getFinalScoreId = (score: number, betMultiplier: number): string =>
  `${score}-${betMultiplier}`;

/** Surrendered hands are grouped apart from the hands that stand on the same score */
const getHandFinalScore = (hand: MaterialHand): number =>
  hand.action === surrender ? surrenderScore : hand.effectiveScore;

const createFinalScore = (score: number, betMultiplier: number): FinalScore => ({
  betMultiplier,
  hands: [],
  id: getFinalScoreId(score, betMultiplier),
  probability: 0,
  score,
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

    addHandToFinalScores(finalScoresMap, hand);
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

    addHandToFinalScores(finalScoresGroup.finalScores, hand);
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
  return Object.values(finalScoresMap).sort(
    (a, b) => a.score - b.score || a.betMultiplier - b.betMultiplier,
  );
};

import { MaterialHand } from './material-hand.type';

export type FinalScoreBase = {
  betMultiplier: number;
  /** Identifies the score & bet multiplier combination of the final score */
  id: string;
  probability: number;
  score: number;
};

export type FinalScore = FinalScoreBase & {
  hands: MaterialHand[];
};

export type FinalScoresMap = {
  [finalScoreId: string]: FinalScore;
};

export type FinalScoresGroup = {
  finalScores: FinalScoresMap;
  probability: number;
};

export type FinalScoresByFirstCard = {
  [card: string]: FinalScoresGroup;
};

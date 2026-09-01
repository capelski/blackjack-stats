import { MaterialHand } from './material-hand.type';

export type FinalScore = {
  betMultiplier: number;
  hands: MaterialHand[];
  /** Identifies the score & bet multiplier combination of the final score */
  id: string;
  probability: number;
  score: number;
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

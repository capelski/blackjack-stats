import { HandModifiers } from './hand-modifiers.type';
import { MaterialHand } from './material-hand.type';

export type FinalScore = {
  hands: MaterialHand[];
  /** Identifies the score & bet multiplier combination of the final score */
  id: string;
  modifiers: HandModifiers;
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

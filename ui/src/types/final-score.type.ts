import { MaterialHand } from './hand.type';

export type FinalScoreBase = {
  probability: number;
  score: number;
};

export type FinalScore = FinalScoreBase & {
  hands: MaterialHand[];
};

export type FinalScoresMap = {
  [score: number]: FinalScore;
};

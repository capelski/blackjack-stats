import { HandWithAction } from './hand.type';

export type FinalScoreBase = {
  probability: number;
  score: number;
};

export type FinalScore = FinalScoreBase & {
  hands: HandWithAction[];
};

export type FinalScoresMap = {
  [score: number]: FinalScore;
};

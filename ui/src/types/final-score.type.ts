import { HandWithAction } from './hand.type';

export type FinalScore = {
  hands: HandWithAction[];
  probability: number;
  score: number;
};

export type FinalScoresMap = {
  [score: number]: FinalScore;
};

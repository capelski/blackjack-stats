import { HandExtended } from './hand.type';

export type FinalScore = {
  hands: HandExtended[];
  probability: number;
  score: number;
};

export type FinalScoresMap = {
  [score: number]: FinalScore;
};

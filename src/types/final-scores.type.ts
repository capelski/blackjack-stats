import { Card } from './card.type';

export type FinalScore = {
  combinations: string[];
  probability: number;
  score: number;
};

export type FinalScoresMap = {
  [score: number]: FinalScore;
};

export type FinalScoresByDealerCard = Record<Card, FinalScoresMap>;

export type FinalScoresByInitialPair = Record<
  string,
  {
    finalScores: FinalScoresMap;
    probability: number;
  }
>;

import { Card } from './card.type';

export type FinalScore = {
  combinations: string[];
  probability: number;
};

export type FinalScoresMap = {
  [score: number]: FinalScore;
};

export type FinalScoresByDealerCard = Record<Card, FinalScoresMap>;

import { Card } from './card.type';

export type FinalScores = {
  [score: number]: {
    combinations: string[];
    probability: number;
  };
};

export type FinalScoresByDealerCard = Record<Card, FinalScores>;

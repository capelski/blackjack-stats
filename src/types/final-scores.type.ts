import { AppliedAction } from '../enums/action.enum';
import { Card } from './card.type';

export type CombinationsByFinalScore = {
  [score: number]: string[];
};

export type FinalScore = {
  combinations: number;
  probability: number;
  score: number;
};

export type FinalScoresMap = {
  [score: number]: FinalScore;
};

export type FinalScoresByDealerCard = Record<Card, FinalScoresMap>;

export type FinalScoresByInitialPair = {
  action: AppliedAction;
  finalScores: FinalScoresMap;
  initialPairScore: number;
  probability: number;
};

export type FinalScoresByInitialPairMap = Record<string, FinalScoresByInitialPair>;

import { BetMultiplierMap } from './bet-multiplier.type';
import { MaterialHand } from './material-hand.type';

export type FinalScoreBase = {
  probability: number;
  probabilityByBetMultiplier: BetMultiplierMap;
  score: number;
};

export type FinalScore = FinalScoreBase & {
  hands: MaterialHand[];
};

export type FinalScoresMap = {
  [score: number]: FinalScore;
};

export type FinalScoresGroup = {
  finalScores: FinalScoresMap;
  probability: number;
};

export type FinalScoresByFirstCard = {
  [card: string]: FinalScoresGroup;
};

import { Result } from '../enums/result.enum';
import { Consequence } from './consequence.type';
import { Outcomes } from './outcomes.type';

export type DealerFinalScoreSummary = {
  probability: number;
  rowProbability: number;
  result: Result;
  outcomes: Outcomes;
};

export type PlayerFinalScoreSummary = {
  count: number;
  probability: number;
  dealerFinals: {
    [dealerFinalScore: number]: DealerFinalScoreSummary;
  };
  outcomes: Outcomes;
};

export type StrategyBreakdownByFinalScores = {
  [playerFinalScore: number]: PlayerFinalScoreSummary;
};

export type ConsequencesByInitialPairs = {
  [initialPairLabel: string]: Consequence;
};

export type StrategySummary = {
  breakdownByFinalScores: StrategyBreakdownByFinalScores;
  consequencesByInitialPairs: ConsequencesByInitialPairs;
  outcomes: Outcomes;
};

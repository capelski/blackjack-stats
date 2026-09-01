import { FinalComparisonsMap } from './final-comparison.type';
import { Outcomes, OutcomesByBetMultiplierMap } from './outcomes.type';

export type ExpectedResult = {
  betMultiplier: number;
  edge: number;
  finalComparisons: FinalComparisonsMap;
  outcomes: Outcomes;
  probability: number;
  score: number;
};

export type ExpectedResultsMap = {
  [playerScoreId: string]: ExpectedResult;
};

export type ExpectedResults = {
  breakdown: ExpectedResultsMap;
  probability: number;
  outcomesByBetMultiplier: OutcomesByBetMultiplierMap;
  edge: number;
};

import { BetMultiplierMap } from './bet-multiplier.type';
import { FinalComparisonsMap } from './final-comparison.type';
import { OutcomesByBetMultiplierMap } from './outcomes.type';

export type ExpectedResult = {
  /** Identifies the final score the expected result belongs to */
  id: string;
  score: number;
  finalComparisons: FinalComparisonsMap;
  probabilityByBetMultiplier: BetMultiplierMap;
  outcomesByBetMultiplier: OutcomesByBetMultiplierMap;
  edge: number;
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

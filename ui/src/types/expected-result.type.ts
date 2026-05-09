import { BetMultiplierMap } from './bet-multiplier.type';
import { FinalComparisonsMap } from './final-comparison.type';
import { Outcomes } from './outcomes.type';

export type ExpectedResult = {
  score: number;
  finalComparisons: FinalComparisonsMap;
  probability: number;
  probabilityByBetMultiplier: BetMultiplierMap;
  outcomes: Outcomes;
  edge: number;
  edgeByBetMultiplier: BetMultiplierMap;
};

export type ExpectedResultsMap = {
  [playerScore: number]: ExpectedResult;
};

export type ExpectedResults = {
  breakdown: ExpectedResultsMap;
  probability: number;
  outcomes: Outcomes;
  edge: number;
};

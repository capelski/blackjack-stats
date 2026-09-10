import { EdgeContribution } from './edge-contribution.type';
import { FinalComparisonsMap } from './final-comparison.type';
import { HandModifiers } from './hand-modifiers.type';
import { Outcomes } from './outcomes.type';

export type ExpectedResult = {
  finalComparisons: FinalComparisonsMap;
  modifiers: HandModifiers;
  outcomes: Outcomes;
  probability: number;
  score: number;
};

export type ExpectedResultsMap = {
  [playerScoreId: string]: ExpectedResult;
};

export type ExpectedResults = {
  breakdown: ExpectedResultsMap;
  edge: number;
  edgeContributions: EdgeContribution[];
  probability: number;
};

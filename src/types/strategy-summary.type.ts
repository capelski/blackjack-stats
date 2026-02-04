import { Result } from '../enums/result.enum';
import { Consequence } from './consequence.type';
import { Outcomes } from './outcomes.type';

export type DealerFinalSummary = {
  outcomes: Outcomes;
  probability: number;
  result: Result;
};

export type DealerFinalsSummaryMap = {
  [dealerFinalScore: number]: DealerFinalSummary;
};

export type PlayerFinalSummary = {
  dealerFinals: DealerFinalsSummaryMap;
  outcomes: Outcomes;
  probability: number;
};

export type PlayerFinalsSummaryMap = {
  [playerFinalScore: number]: PlayerFinalSummary;
};

export type ConsequencesByInitialPairs = {
  [initialPairLabel: string]: Consequence;
};

export type StrategySummary = {
  finalScoresSummaries: PlayerFinalsSummaryMap;
  consequencesByInitialPairs: ConsequencesByInitialPairs;
  outcomes: Outcomes;
};

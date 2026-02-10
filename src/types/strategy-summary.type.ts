import { Result } from '../enums/result.enum';
import { CardsCombination } from './cards-combination.type';
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
  betMultiplier: number;
  combinations: number;
  dealerFinals: DealerFinalsSummaryMap;
  outcomes: Outcomes;
  probability: number;
};

export type PlayerFinalsSummaryMap = {
  [playerFinalScore: number]: PlayerFinalSummary;
};

export type InitialPairsConsequences = {
  [initialPairLabel: string]: Consequence;
};

export type StrategySummary = {
  combinations: {
    number: number;
    probability: number;
    tree?: CardsCombination[];
  };
  finalScoresSummaries: PlayerFinalsSummaryMap;
  initialPairsConsequences: InitialPairsConsequences;
  outcomes: Outcomes;
};

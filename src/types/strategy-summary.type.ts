import { Result } from '../enums/result.enum';
import { Outcomes } from './outcomes.type';

export type StrategyBreakdown = {
  [playerFinalScore: number]: {
    probability: number;
    dealerFinals: {
      [dealerFinalScore: number]: {
        probability: number;
        rowProbability: number;
        result: Result;
        outcomes: Outcomes;
      };
    };
    outcomes: Outcomes;
  };
};

export type StrategySummary = {
  outcomes: Outcomes;
  breakdown: StrategyBreakdown;
};

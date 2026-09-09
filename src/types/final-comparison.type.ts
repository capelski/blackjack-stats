import { Result } from '../models/result.model';

export type FinalComparison = {
  probability: number;
  result: Result;
};

export type FinalComparisonsMap = {
  [dealerScoreId: string]: FinalComparison;
};

import { Result } from '../models/result.model';
import { BetMultiplierMap } from './bet-multiplier.type';

export type FinalComparison = {
  probabilityByBetMultiplier: BetMultiplierMap;
  result: Result;
};

export type FinalComparisonsMap = {
  [dealerScoreId: string]: FinalComparison;
};

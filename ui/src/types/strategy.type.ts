import { ExpectedResults } from './expected-result.type';
import { FinalScore } from './final-score.type';
import { MaterialHand, ResolvedHand } from './hand.type';

export type Strategy = {
  expectedResults: ExpectedResults;
  finalScores: FinalScore[];
  materialHands: MaterialHand[];
  resolvedHands: ResolvedHand[];
};

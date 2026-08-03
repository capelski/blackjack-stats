import { ExpectedResults } from './expected-result.type';
import { FinalScore } from './final-score.type';
import { MaterialHand } from './material-hand.type';
import { ResolvedHand, ResolvedHandsMap } from './resolved-hand.type';

export type Strategy = {
  expectedResults: ExpectedResults;
  finalScores: FinalScore[];
  materialHands: MaterialHand[];
  resolvedHandsList: ResolvedHand[];
  resolvedHandsMap: ResolvedHandsMap;
};

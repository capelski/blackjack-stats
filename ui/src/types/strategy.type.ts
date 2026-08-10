import { ExpectedResults } from './expected-result.type';
import { FinalScore, FinalScoreBase } from './final-score.type';
import { MaterialHand } from './material-hand.type';
import { ResolvedHand, ResolvedHandsMap } from './resolved-hand.type';

export type Strategy = {
  dealerScores: FinalScoreBase[];
  expectedResults: ExpectedResults;
  finalScores: FinalScore[];
  materialHands: MaterialHand[];
  resolvedHandsList: ResolvedHand[];
  resolvedHandsMap: ResolvedHandsMap;
};

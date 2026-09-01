import { DecisionOverridesByFirstCard, DecisionOverridesMap } from './decision-overrides.type';
import { ExpectedResults } from './expected-result.type';
import { FinalScore } from './final-score.type';
import { MaterialHand } from './material-hand.type';
import { ResolvedHand, ResolvedHandsMap } from './resolved-hand.type';

export type Strategy = {
  dealerScores: FinalScore[];
  decisionOverrides: DecisionOverridesMap;
  expectedResults: ExpectedResults;
  finalScores: FinalScore[];
  materialHands: MaterialHand[];
  resolvedHandsList: ResolvedHand[];
  resolvedHandsMap: ResolvedHandsMap;
};

export type StrategyByFirstCard = {
  breakdown: StrategyMap;
  decisionOverrides: DecisionOverridesByFirstCard;
  expectedResults: Pick<ExpectedResults, 'edge' | 'outcomesByBetMultiplier' | 'probability'>;
};

export type StrategyMap = Record<string, Strategy>;

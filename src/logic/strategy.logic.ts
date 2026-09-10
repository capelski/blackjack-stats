import {
  DecisionOverridesByFirstCard,
  DecisionOverridesMap,
} from '../types/decision-overrides.type';
import { EdgeContribution } from '../types/edge-contribution.type';
import { FinalScore, FinalScoresByFirstCard } from '../types/final-score.type';
import { HandResolver } from '../types/hand-resolution.type';
import { Rules } from '../types/rules.type';
import { Strategy, StrategyByFirstCard, StrategyMap } from '../types/strategy.type';
import { getOverridesResolver } from './decision-overrides.logic';
import { mergeEdgeContributions } from './edge-contribution.logic';
import { getEdge } from './edge.logic';
import { getExpectedResults } from './expected-results.logic';
import { getFinalScoresList, getSortedFinalScores } from './final-scores-list.logic';
import { getMaterialHands } from './material-hands.logic';
import { getResolvedHands } from './resolved-hands.logic';

export const getStrategy = async (
  rules: Rules,
  handResolver: HandResolver,
  dealerScores: FinalScore[],
  decisionOverrides: DecisionOverridesMap,
): Promise<Strategy> => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate async computation
  return getStrategyCore(rules, handResolver, dealerScores, decisionOverrides);
};

export const getStrategyByFirstCard = async (
  rules: Rules,
  handResolver: HandResolver,
  dealerScores: FinalScoresByFirstCard,
  decisionOverrides: DecisionOverridesByFirstCard,
): Promise<StrategyByFirstCard> => {
  await new Promise((resolve) => setTimeout(resolve, 10)); // Simulate async computation

  const strategyMap: StrategyMap = {};

  let probability = 0;
  const edgeContributions: EdgeContribution[] = [];

  for (const [firstCard, finalScoresGroup] of Object.entries(dealerScores)) {
    const finalScores = getSortedFinalScores(finalScoresGroup.finalScores);
    const strategy = getStrategyCore(
      rules,
      handResolver,
      finalScores,
      decisionOverrides[firstCard] ?? {},
    );
    strategyMap[firstCard] = strategy;

    probability += strategy.expectedResults.probability * finalScoresGroup.probability;
    mergeEdgeContributions(
      edgeContributions,
      strategy.expectedResults.edgeContributions,
      finalScoresGroup.probability,
    );
  }

  return {
    breakdown: strategyMap,
    decisionOverrides,
    expectedResults: {
      edge: getEdge(edgeContributions),
      edgeContributions,
      probability,
    },
  };
};

const getStrategyCore = (
  rules: Rules,
  handResolver: HandResolver,
  dealerScores: FinalScore[],
  decisionOverrides: DecisionOverridesMap,
): Strategy => {
  const { handResolutionMap, resolvedHandsList, resolvedHandsMap } = getResolvedHands(
    rules,
    getOverridesResolver(handResolver, decisionOverrides),
    dealerScores,
  );
  const materialHands = getMaterialHands(rules, handResolutionMap);
  const finalScores = getFinalScoresList(materialHands);
  const expectedResults = getExpectedResults(finalScores, dealerScores);

  return {
    dealerScores,
    decisionOverrides,
    expectedResults,
    finalScores,
    materialHands,
    resolvedHandsList,
    resolvedHandsMap,
  };
};

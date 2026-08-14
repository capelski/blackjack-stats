import { FinalScoreBase, FinalScoresByFirstCard } from '../types/final-score.type';
import { HandResolver } from '../types/hand-resolution.type';
import { Rules } from '../types/rules.type';
import { Strategy, StrategyByFirstCard, StrategyMap } from '../types/strategy.type';
import { getEdge } from './edge.logic';
import { getExpectedResults } from './expected-results.logic';
import { getFinalScoresList, getSortedFinalScores } from './final-scores-list.logic';
import { getMaterialHands } from './material-hands.logic';
import { createOutcomesByBetMultiplier, increaseOutcomesByBetMultiplier } from './outcomes.logic';
import { getResolvedHands } from './resolved-hands.logic';

export const getStrategy = async (
  rules: Rules,
  handResolver: HandResolver,
  dealerScores: FinalScoreBase[],
): Promise<Strategy> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async computation
  return getStrategyCore(rules, handResolver, dealerScores);
};

export const getStrategyByFirstCard = async (
  rules: Rules,
  getHandResolver: (firstCard: string) => HandResolver,
  dealerScores: FinalScoresByFirstCard,
): Promise<StrategyByFirstCard> => {
  await new Promise(resolve => setTimeout(resolve, 10)); // Simulate async computation

  const strategyMap: StrategyMap = {};

  let probability = 0;
  const outcomesByBetMultiplier = createOutcomesByBetMultiplier({});

  for (const [firstCard, finalScoresGroup] of Object.entries(dealerScores)) {
    const finalScores = getSortedFinalScores(finalScoresGroup.finalScores);
    const strategy = getStrategyCore(rules, getHandResolver(firstCard), finalScores);
    strategyMap[firstCard] = strategy;

    probability += strategy.expectedResults.probability * finalScoresGroup.probability;
    increaseOutcomesByBetMultiplier(
      outcomesByBetMultiplier,
      strategy.expectedResults.outcomesByBetMultiplier,
      finalScoresGroup.probability,
    );
  }

  return {
    breakdown: strategyMap,
    expectedResults: {
      probability,
      outcomesByBetMultiplier,
      edge: getEdge(outcomesByBetMultiplier),
    },
  };
};

const getStrategyCore = (
  rules: Rules,
  handResolver: HandResolver,
  dealerScores: FinalScoreBase[],
): Strategy => {
  const { handResolutionMap, resolvedHandsList, resolvedHandsMap } = getResolvedHands(
    rules,
    handResolver,
    dealerScores,
  );
  const materialHands = getMaterialHands(rules, handResolutionMap);
  const finalScores = getFinalScoresList(materialHands);
  const expectedResults = getExpectedResults(finalScores, dealerScores);

  return {
    dealerScores,
    expectedResults,
    finalScores,
    materialHands,
    resolvedHandsList,
    resolvedHandsMap,
  };
};

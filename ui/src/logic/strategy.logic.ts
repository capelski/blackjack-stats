import { HandResolver } from '../types/hand-resolution.type';
import { Rules } from '../types/rules.type';
import { Strategy } from '../types/strategy.type';
import { getExpectedResults } from './expected-results.logic';
import { getFinalScoresList } from './final-scores-list.logic';
import { getMaterialHands } from './material-hands.logic';
import { getResolvedHands } from './resolved-hands.logic';

export const getStrategy = async (rules: Rules, handResolver: HandResolver): Promise<Strategy> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async computation
  const { handResolutionMap, resolvedHandsList, resolvedHandsMap } = getResolvedHands(
    rules,
    handResolver,
  );
  const materialHands = getMaterialHands(rules, handResolutionMap);
  const finalScores = getFinalScoresList(materialHands);
  const expectedResults = getExpectedResults(finalScores);

  return {
    expectedResults,
    finalScores,
    materialHands,
    resolvedHandsList,
    resolvedHandsMap,
  };
};

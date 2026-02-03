import { SearchMode } from '../enums/search-mode.enum';
import { dealerHandResolver } from './dealer-finals.logic';
import { getFinalScores } from './final-scores.logic';

export const getDealerCombinations = () => {
  const { allCombinations } = getFinalScores(dealerHandResolver, {
    collectCombinations: true,
    searchMode: SearchMode.depthFirst,
  });
  return allCombinations;
};

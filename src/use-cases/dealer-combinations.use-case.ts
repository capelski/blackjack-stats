import { getDealerCombinations } from '../logic/dealer-combinations.logic';

const dealerCombinations = getDealerCombinations();

const combinationsTree = dealerCombinations
  .map(({ cards, effectiveScore, label }) => {
    const tabulations = '\t'.repeat(cards.length - 1);
    const decision = effectiveScore < 17 ? 'Hit' : 'Stand';
    return `${tabulations}- ${cards.join(',')}. ${label}. ${decision}`;
  })
  .join('\n');

console.log(combinationsTree);

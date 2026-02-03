import { getDealerCombinations } from '../logic/dealer-combinations.logic';

const dealerCombinations = getDealerCombinations();

const combinationsTree = dealerCombinations
  .map(cardsCombination => {
    const { action, cards, label } = cardsCombination;
    const tabulations = '  '.repeat(cards.length - 1);
    return `${tabulations}- ${cards.join(',')}. ${label}. ${action}`;
  })
  .join('\n');

console.log(combinationsTree);

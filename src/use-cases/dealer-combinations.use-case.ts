import { printCardsCombinations } from '../logic/cards-combination.logic';
import { getDealerCombinations } from '../logic/dealer-combinations.logic';

const dealerCombinations = getDealerCombinations();

const combinationsTree = printCardsCombinations(dealerCombinations);

console.log(combinationsTree);

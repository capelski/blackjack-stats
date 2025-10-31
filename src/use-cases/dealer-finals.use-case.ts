import { getDealerFinals } from '../logic/dealer-finals.logic';
import { dealerFinalHands } from '../logic/hands.logic';
import { toPercentage } from '../logic/percentages.logic';
import { getTable } from '../logic/table.logic';

const dealerFinals = getDealerFinals();

const combinationsHeaders = ['Score', 'Combinations', 'Examples'];
const combinationsRows = dealerFinalHands.map((dealerHand) => {
  const dealerCombinations = dealerFinals.combinations[dealerHand.effectiveScore];
  const examples = dealerCombinations.slice(0, 10);
  const drawEllipsis = examples.length < dealerCombinations.length;
  return [
    dealerHand.label,
    dealerCombinations.length,
    `${examples.join(' / ')}${drawEllipsis ? ' ...' : ''}`,
  ];
});
const scoresTable = getTable(combinationsHeaders, combinationsRows);

console.log(scoresTable);

const probabilitiesHeaders = ['Score', 'Probability'];
const probabilitiesRows = dealerFinalHands.map((dealerHand) => {
  return [dealerHand.label, toPercentage(dealerFinals.probabilities[dealerHand.effectiveScore])];
});

const probabilitiesTable = getTable(probabilitiesHeaders, probabilitiesRows);

console.log('\n');
console.log(probabilitiesTable);

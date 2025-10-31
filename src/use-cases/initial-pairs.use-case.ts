import { getInitialPairs } from '../logic/initial-pairs.logic';
import { getInitialPairLabels } from '../logic/labels.logic';
import { toPercentage } from '../logic/percentages.logic';
import { getTable } from '../logic/table.logic';

const initialPairs = getInitialPairs();
const initialPairLabels = getInitialPairLabels();

const combinationsHeaders = ['Score', 'Combinations', 'Examples'];
const combinationsRows = initialPairLabels.map((label) => {
  const examples = initialPairs.combinations[label].slice(0, 10);
  const drawEllipsis = examples.length < initialPairs.combinations[label].length;
  return [
    label,
    initialPairs.combinations[label].length,
    `${examples.join(' / ')}${drawEllipsis ? ' ...' : ''}`,
  ];
});
const combinationsTable = getTable(combinationsHeaders, combinationsRows);

console.log(combinationsTable);

const probabilitiesHeaders = ['Score', 'Probability'];
const probabilitiesRows = initialPairLabels.map((label) => {
  return [label, toPercentage(initialPairs.probabilities[label])];
});

const probabilitiesTable = getTable(probabilitiesHeaders, probabilitiesRows);

console.log('\n');
console.log(probabilitiesTable);

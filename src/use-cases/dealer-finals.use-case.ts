import { getDealerFinals } from '../logic/dealer-finals.logic';
import { getScoresLabel } from '../logic/labels.logic';
import { toPercentage } from '../logic/percentages.logic';
import { dealerFinalScores } from '../logic/scores';
import { getTable } from '../logic/table.logic';

const dealerFinals = getDealerFinals();

const combinationsHeaders = ['Score', 'Combinations', 'Examples'];
const combinationsRows = dealerFinalScores.map((key) => {
  const examples = dealerFinals.combinations[key].slice(0, 10);
  const drawEllipsis = examples.length < dealerFinals.combinations[key].length;
  return [
    getScoresLabel([key]),
    dealerFinals.combinations[key].length,
    `${examples.join(' / ')}${drawEllipsis ? ' ...' : ''}`,
  ];
});
const scoresTable = getTable(combinationsHeaders, combinationsRows);

console.log(scoresTable);

const probabilitiesHeaders = ['Score', 'Probability'];
const probabilitiesRows = dealerFinalScores.map((key) => {
  return [getScoresLabel([key]), toPercentage(dealerFinals.probabilities[key])];
});

const probabilitiesTable = getTable(probabilitiesHeaders, probabilitiesRows);

console.log('\n');
console.log(probabilitiesTable);

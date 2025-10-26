import { getDealerFinals } from '../logic/dealer-finals.logic';
import { getScoresLabel } from '../logic/labels.logic';
import { getMarkdownTable } from '../logic/markdown.logic';
import { toPercentage } from '../logic/percentages.logic';
import { dealerFinalScores } from '../logic/scores';

const dealerFinals = getDealerFinals();

const combinationsHeaders = ['Score', 'Count', 'Examples'];
const combinationsRows = dealerFinalScores.map((key) => [
  getScoresLabel([key]),
  dealerFinals.combinations[key].length,
  `"${dealerFinals.combinations[key].slice(0, 10).join(' / ')}"`,
]);
const scoresTable = getMarkdownTable(combinationsHeaders, combinationsRows);

console.log(scoresTable);

const probabilitiesHeaders = ['Score', 'Probability'];
const probabilitiesRows = dealerFinalScores.map((key) => {
  return [getScoresLabel([key]), toPercentage(dealerFinals.probabilities[key])];
});

const probabilitiesTable = getMarkdownTable(probabilitiesHeaders, probabilitiesRows);

console.log('\n');
console.log(probabilitiesTable);

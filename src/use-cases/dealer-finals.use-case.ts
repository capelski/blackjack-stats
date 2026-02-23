import { dealerHandResolver } from '../logic/dealer-finals.logic';
import { getFinalScores } from '../logic/final-scores.logic';
import { getScoresLabel } from '../logic/labels.logic';
import { getNumericKeys, toPercentage } from '../logic/numbers.logic';
import { getTable } from '../logic/table.logic';

const { finalScores: dealerFinals, combinationsByFinalScore } = getFinalScores(dealerHandResolver);

const combinationsHeaders = ['Score', 'Combinations', 'Examples'];
const combinationsRows = getNumericKeys(dealerFinals).map(dealerFinalScore => {
  const dealerCombinations = combinationsByFinalScore[dealerFinalScore];
  const examples = dealerCombinations.slice(0, 10);
  const drawEllipsis = examples.length < dealerCombinations.length;
  return [
    getScoresLabel([dealerFinalScore]),
    dealerCombinations.length,
    `${examples.join(' / ')}${drawEllipsis ? ' ...' : ''}`,
  ];
});
const scoresTable = getTable(combinationsHeaders, combinationsRows);

console.log(scoresTable);

const probabilitiesHeaders = ['Score', 'Probability'];
const probabilitiesRows = getNumericKeys(dealerFinals).map(dealerFinalScore => {
  return [
    getScoresLabel([dealerFinalScore]),
    toPercentage(dealerFinals[dealerFinalScore].probability),
  ];
});

const probabilitiesTable = getTable(probabilitiesHeaders, probabilitiesRows);

console.log('\n');
console.log(probabilitiesTable);

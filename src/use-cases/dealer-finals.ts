import { getDealerFinals } from '../logic/dealer-finals';
import { getScoresLabel } from '../logic/labels';
import { dealerFinalScores } from '../logic/scores';

/**
 * Produces the following table
 *
 * Score,Count,Examples
 * 17,6640,"6,A / 7,10 / 7,J / 7,Q / 7,K / 8,9 / 9,8 / 10,7 / A,6 / J,7"
 * 18,6650,"7,A / 8,10 / 8,J / 8,Q / 8,K / 9,9 / 10,8 / A,7 / J,8 / Q,8"
 * 19,6666,"8,A / 9,10 / 9,J / 9,Q / 9,K / 10,9 / A,8 / J,9 / Q,9 / K,9"
 * 20,6701,"9,A / 10,10 / 10,J / 10,Q / 10,K / A,9 / J,10 / J,J / J,Q / J,K"
 * 21,6726,"2,8,A / 2,9,10 / 2,9,J / 2,9,Q / 2,9,K / 2,10,9 / 2,A,8 / 2,J,9 / 2,Q,9 / 2,K,9"
 * BJ,8,"10,A / A,10 / A,J / A,Q / A,K / J,A / Q,A / K,A"
 * 22+,46098,"2,10,10 / 2,10,J / 2,10,Q / 2,10,K / 2,J,10 / 2,J,J / 2,J,Q / 2,J,K / 2,Q,10 / 2,Q,J"
 *
 * Score,Probability
 * 17,0.14512590450523324
 * 18,0.13949692685146656
 * 19,0.13346395558618554
 * 20,0.18025242390966803
 * 21,0.07273066367426625
 * BJ,0.04733727810650888
 * 22+,0.28159284736631784
 */

const dealerFinals = getDealerFinals();

const scoresCsv = [
  ['Score', 'Count', 'Examples'].join(','),
  ...dealerFinalScores.map((key) =>
    [
      getScoresLabel([key]),
      dealerFinals.combinations[key].length,
      `"${dealerFinals.combinations[key].slice(0, 10).join(' / ')}"`,
    ].join(','),
  ),
].join('\n');

console.log(scoresCsv);

console.log('\n\n');

const probabilitiesCsv = [
  ['Score', 'Probability'].join(','),
  ...dealerFinalScores.map((key) =>
    [getScoresLabel([key]), dealerFinals.probabilities[key]].join(','),
  ),
].join('\n');

console.log(probabilitiesCsv);

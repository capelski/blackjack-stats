import { cardsNumber } from '../logic/cards';
import { dealerFinalsByCardToCsv, getDealerFinalsByCard } from '../logic/dealer-finals';
import { dealerFinalScores } from '../logic/scores';

/**
 * Produces the following table
 *
 * Dealer card,17,18,19,20,21,BJ,22+
 * A,1184,1184,1184,1184,1183,4,8286
 * 2,2230,2234,2240,2250,2266,0,15469
 * 3,1300,1302,1306,1312,1322,0,9011
 * 4,758,760,762,766,772,0,5255
 * 5,458,458,460,462,466,0,3169
 * 6,259,261,261,263,265,0,1800
 * 7,163,160,162,162,164,0,1110
 * 8,96,99,96,98,98,0,666
 * 9,64,64,67,64,66,0,444
 * 10,32,32,32,35,31,1,222
 * J,32,32,32,35,31,1,222
 * Q,32,32,32,35,31,1,222
 * K,32,32,32,35,31,1,222
 *
 * Dealer card,17,18,19,20,21,BJ,22+
 * A,1.01%,1.01%,1.01%,1.01%,0.41%,2.37%,0.89%
 * 2,1.08%,1.04%,1.00%,0.95%,0.91%,0.00%,2.72%
 * 3,1.04%,1.00%,0.97%,0.93%,0.88%,0.00%,2.88%
 * 4,1.00%,0.97%,0.93%,0.90%,0.86%,0.00%,3.03%
 * 5,0.94%,0.94%,0.91%,0.87%,0.83%,0.00%,3.20%
 * 6,1.27%,0.82%,0.82%,0.78%,0.75%,0.00%,3.26%
 * 7,2.84%,1.06%,0.60%,0.60%,0.57%,0.00%,2.02%
 * 8,0.99%,2.76%,0.99%,0.53%,0.53%,0.00%,1.88%
 * 9,0.92%,0.92%,2.70%,0.92%,0.47%,0.00%,1.76%
 * 10,0.86%,0.86%,0.86%,2.63%,0.27%,0.59%,1.63%
 * J,0.86%,0.86%,0.86%,2.63%,0.27%,0.59%,1.63%
 * Q,0.86%,0.86%,0.86%,2.63%,0.27%,0.59%,1.63%
 * K,0.86%,0.86%,0.86%,2.63%,0.27%,0.59%,1.63%
 *
 * Dealer card,17,18,19,20,21,BJ,22+
 * A,13.08%,13.08%,13.08%,13.08%,5.39%,30.77%,11.53%
 * 2,13.98%,13.49%,12.97%,12.40%,11.80%,0.00%,35.36%
 * 3,13.50%,13.05%,12.56%,12.03%,11.47%,0.00%,37.39%
 * 4,13.05%,12.59%,12.14%,11.65%,11.12%,0.00%,39.45%
 * 5,12.23%,12.23%,11.77%,11.31%,10.82%,0.00%,41.64%
 * 6,16.54%,10.63%,10.63%,10.17%,9.72%,0.00%,42.32%
 * 7,36.86%,13.78%,7.86%,7.86%,7.41%,0.00%,26.23%
 * 8,12.86%,35.93%,12.86%,6.94%,6.94%,0.00%,24.47%
 * 9,12.00%,12.00%,35.08%,12.00%,6.08%,0.00%,22.84%
 * 10,11.14%,11.14%,11.14%,34.22%,3.45%,7.69%,21.21%
 * J,11.14%,11.14%,11.14%,34.22%,3.45%,7.69%,21.21%
 * Q,11.14%,11.14%,11.14%,34.22%,3.45%,7.69%,21.21%
 * K,11.14%,11.14%,11.14%,34.22%,3.45%,7.69%,21.21%
 */

const dealerCombinationsByCard = getDealerFinalsByCard();

const combinationsCsv = dealerFinalsByCardToCsv(dealerCombinationsByCard, (cardFacts) => {
  return dealerFinalScores.map((dealerFinalScore) => {
    return cardFacts.combinations[dealerFinalScore]?.length || 0;
  });
});
console.log(`${combinationsCsv}\n\n`);

const probabilitiesCsv = dealerFinalsByCardToCsv(dealerCombinationsByCard, (cardFacts) => {
  return dealerFinalScores.map((dealerFinalScore) => {
    const probabilities = (cardFacts.probabilities[dealerFinalScore] || 0) / cardsNumber;
    return `${(probabilities * 100).toFixed(2)}%`;
  });
});
console.log(`${probabilitiesCsv}\n\n`);

const ponderedProbabilitiesCsv = dealerFinalsByCardToCsv(dealerCombinationsByCard, (cardFacts) => {
  return dealerFinalScores.map((dealerFinalScore) => {
    const probabilities = cardFacts.probabilities[dealerFinalScore] || 0;
    return `${(probabilities * 100).toFixed(2)}%`;
  });
});
console.log(`${ponderedProbabilitiesCsv}\n\n`);

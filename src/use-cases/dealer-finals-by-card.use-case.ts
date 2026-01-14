import { cards, cardsNumber } from '../logic/cards.logic';
import { getDealerFinalsByCard } from '../logic/dealer-finals-by-card.logic';
import { dealerFinalHands } from '../logic/hands.logic';
import { toPercentage } from '../logic/numbers.logic';
import { getTable } from '../logic/table.logic';
import { FinalScores, FinalScoresByDealerCard } from '../types/final-scores.type';

const headers = ['Dealer card', ...dealerFinalHands.map(({ label }) => label)];

const getRows = (
  dealerFinalsByCard: FinalScoresByDealerCard,
  formatter: (dealerFinals: FinalScores, dealerFinalScore: number) => number | string,
) => {
  return cards.map(dealerCard => {
    const dealerFinals = dealerFinalsByCard[dealerCard];

    return [
      dealerCard,
      ...dealerFinalHands.map(({ effectiveScore }) => {
        return formatter(dealerFinals, effectiveScore);
      }),
    ];
  });
};

const dealerFinalsByCard = getDealerFinalsByCard();

const combinationsRows = getRows(dealerFinalsByCard, (dealerFinals, dealerFinalScore) => {
  return dealerFinals[dealerFinalScore]?.combinations.length || 0;
});
const combinationsTable = getTable(headers, combinationsRows);

console.log(combinationsTable);

const overallProbabilitiesRows = getRows(dealerFinalsByCard, (dealerFinals, dealerFinalScore) => {
  const probabilities = (dealerFinals[dealerFinalScore]?.probability || 0) / cardsNumber;
  return toPercentage(probabilities);
});
const overallProbabilitiesTable = getTable(headers, overallProbabilitiesRows);

console.log('\n');
console.log(overallProbabilitiesTable);

const individualProbabilitiesRows = getRows(
  dealerFinalsByCard,
  (dealerFinals, dealerFinalScore) => {
    const probabilities = dealerFinals[dealerFinalScore]?.probability || 0;
    return toPercentage(probabilities);
  },
);
const individualProbabilitiesTable = getTable(headers, individualProbabilitiesRows);

console.log('\n');
console.log(individualProbabilitiesTable);

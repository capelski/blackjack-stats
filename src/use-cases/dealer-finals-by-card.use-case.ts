import { cards, cardsNumber } from '../logic/cards.logic';
import { getDealerFinalsByCard } from '../logic/dealer-finals-by-card.logic';
import { dealerFinalHands } from '../logic/hands.logic';
import { getTable } from '../logic/table.logic';
import { Finals, FinalsByDealerCard } from '../types/finals.type';

const headers = ['Dealer card', ...dealerFinalHands.map(({ label }) => label)];

const getRows = (
  dealerFinalsByCard: FinalsByDealerCard,
  formatter: (dealerFinals: Finals, dealerFinalScore: number) => number | string,
) => {
  return cards.map((dealerCard) => {
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
  return dealerFinals.combinations[dealerFinalScore]?.length || 0;
});
const combinationsTable = getTable(headers, combinationsRows);

console.log(combinationsTable);

const overallProbabilitiesRows = getRows(dealerFinalsByCard, (dealerFinals, dealerFinalScore) => {
  const probabilities = (dealerFinals.probabilities[dealerFinalScore] || 0) / cardsNumber;
  return `${(probabilities * 100).toFixed(2)}%`;
});
const overallProbabilitiesTable = getTable(headers, overallProbabilitiesRows);

console.log('\n');
console.log(overallProbabilitiesTable);

const individualProbabilitiesRows = getRows(
  dealerFinalsByCard,
  (dealerFinals, dealerFinalScore) => {
    const probabilities = dealerFinals.probabilities[dealerFinalScore] || 0;
    return `${(probabilities * 100).toFixed(2)}%`;
  },
);
const individualProbabilitiesTable = getTable(headers, individualProbabilitiesRows);

console.log('\n');
console.log(individualProbabilitiesTable);

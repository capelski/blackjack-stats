import { cards, cardsNumber } from '../logic/cards.logic';
import { getDealerFinalsByCard } from '../logic/dealer-finals-by-card.logic';
import { getScoresLabel } from '../logic/labels.logic';
import { getMarkdownTable } from '../logic/markdown.logic';
import { dealerFinalScores } from '../logic/scores';
import { Finals, FinalsByDealerCard } from '../types/finals.type';

const headers = ['Dealer card', ...dealerFinalScores.map((score) => getScoresLabel([score]))];

const getRows = (
  dealerFinalsByCard: FinalsByDealerCard,
  formatter: (dealerFinals: Finals, dealerFinalScore: number) => number | string,
) => {
  return cards.map((dealerCard) => {
    const dealerFinals = dealerFinalsByCard[dealerCard];

    return [
      dealerCard,
      ...dealerFinalScores.map((dealerFinalScore) => {
        return formatter(dealerFinals, dealerFinalScore);
      }),
    ];
  });
};

const dealerFinalsByCard = getDealerFinalsByCard();

const combinationsRows = getRows(dealerFinalsByCard, (dealerFinals, dealerFinalScore) => {
  return dealerFinals.combinations[dealerFinalScore]?.length || 0;
});
const combinationsTable = getMarkdownTable(headers, combinationsRows);

console.log(combinationsTable);

const overallProbabilitiesRows = getRows(dealerFinalsByCard, (dealerFinals, dealerFinalScore) => {
  const probabilities = (dealerFinals.probabilities[dealerFinalScore] || 0) / cardsNumber;
  return `${(probabilities * 100).toFixed(2)}%`;
});
const overallProbabilitiesTable = getMarkdownTable(headers, overallProbabilitiesRows);

console.log('\n');
console.log(overallProbabilitiesTable);

const individualProbabilitiesRows = getRows(
  dealerFinalsByCard,
  (dealerFinals, dealerFinalScore) => {
    const probabilities = dealerFinals.probabilities[dealerFinalScore] || 0;
    return `${(probabilities * 100).toFixed(2)}%`;
  },
);
const individualProbabilitiesTable = getMarkdownTable(headers, individualProbabilitiesRows);

console.log('\n');
console.log(individualProbabilitiesTable);

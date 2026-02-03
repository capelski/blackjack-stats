import { cards, cardsNumber } from '../logic/cards.logic';
import { getDealerFinalsByCard } from '../logic/dealer-finals-by-card.logic';
import { getDealerFinals } from '../logic/dealer-finals.logic';
import { getScoresLabel } from '../logic/labels.logic';
import { getNumericKeys, toPercentage } from '../logic/numbers.logic';
import { getTable } from '../logic/table.logic';
import { FinalScoresByDealerCard, FinalScoresMap } from '../types/final-scores.type';

const overallDealerFinals = getDealerFinals();
const dealerFinalScores = getNumericKeys(overallDealerFinals);
const headers = [
  'Dealer card',
  ...dealerFinalScores.map(dealerFinalScore => getScoresLabel([dealerFinalScore])),
];

const getRows = (
  dealerFinalsByCard: FinalScoresByDealerCard,
  formatter: (dealerFinals: FinalScoresMap, dealerFinalScore: number) => number | string,
) => {
  return cards.map(dealerCard => {
    const dealerFinals = dealerFinalsByCard[dealerCard];

    return [
      dealerCard,
      ...dealerFinalScores.map(dealerFinalScore => {
        return formatter(dealerFinals, dealerFinalScore);
      }),
    ];
  });
};

const dealerFinalsByCard = getDealerFinalsByCard();

const combinationsRows = getRows(dealerFinalsByCard, (dealerFinals, dealerFinalScore) => {
  return dealerFinals[dealerFinalScore]?.combinations.length || 0;
});
const combinationsTable = getTable(headers, combinationsRows);

const overallProbabilitiesRows = getRows(dealerFinalsByCard, (dealerFinals, dealerFinalScore) => {
  const probabilities = dealerFinals[dealerFinalScore]?.probability || 0;
  return toPercentage(probabilities);
});
const overallProbabilitiesTable = getTable(headers, overallProbabilitiesRows);

const individualProbabilitiesRows = getRows(
  dealerFinalsByCard,
  (dealerFinals, dealerFinalScore) => {
    const probabilities = (dealerFinals[dealerFinalScore]?.probability || 0) * cardsNumber;
    return toPercentage(probabilities);
  },
);
const individualProbabilitiesTable = getTable(headers, individualProbabilitiesRows);

console.log(`${combinationsTable}\n
${overallProbabilitiesTable}\n
${individualProbabilitiesTable}`);

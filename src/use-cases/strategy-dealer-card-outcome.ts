import { cardValues, sortByCard } from '../logic/cards';
import { getDealerFinalsByCard } from '../logic/dealer-finals';
import { getInitialPairs } from '../logic/initial-pairs';
import { sortByScoreLabels } from '../logic/labels';
import { headersToMarkdown, rowToMarkdown } from '../logic/markdown';
import { mergeOutcomes, multiplyOutcomes, outcomesToValues } from '../logic/outcomes';
import { toPercentage } from '../logic/percentages';
import { getDealerCardStrategy } from '../logic/strategy';

const dealerCardBasedFinals = getDealerFinalsByCard();
const dealerCardStrategy = getDealerCardStrategy(dealerCardBasedFinals);
const initialPairs = getInitialPairs();

const sortedCards = Object.keys(cardValues).sort(sortByCard);
const breakdownMarkdown = [
  headersToMarkdown(['', ...sortedCards]),
  ...Object.keys(initialPairs)
    .sort(sortByScoreLabels)
    .map((playerKey) => {
      const allEdges = sortedCards.map((dealerKey) => {
        const { decision } = dealerCardStrategy[playerKey][dealerKey];
        return toPercentage(dealerCardStrategy[playerKey][dealerKey][decision].edge);
      });

      return rowToMarkdown([playerKey, ...allEdges]);
    }),
].join('\n');

console.log(breakdownMarkdown);

const overallOutcomes = mergeOutcomes(
  Object.keys(initialPairs).map((playerKey) => {
    const allOutcomes = Object.keys(dealerCardStrategy[playerKey]).map((dealerKey) => {
      const { decision } = dealerCardStrategy[playerKey][dealerKey];
      return dealerCardStrategy[playerKey][dealerKey][decision];
    });
    const aggregatedOutcomes = mergeOutcomes(allOutcomes);

    const initialProbability = initialPairs[playerKey];
    const averageOutcomes = multiplyOutcomes(aggregatedOutcomes, 1 / allOutcomes.length);
    return multiplyOutcomes(averageOutcomes, initialProbability);
  }),
);
const overallMarkdown = [
  headersToMarkdown(['Edge', 'Win', 'Lose', 'Push']),
  rowToMarkdown(outcomesToValues(overallOutcomes)),
].join('\n');

console.log('\n');
console.log(overallMarkdown);

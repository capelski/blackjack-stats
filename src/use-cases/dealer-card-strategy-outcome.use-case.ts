import { cards } from '../logic/cards.logic';
import { getDealerCardStrategy } from '../logic/dealer-card-strategy.logic';
import { getInitialPairs } from '../logic/initial-pairs.logic';
import { initialPairLabels } from '../logic/labels.logic';
import { getMarkdownTable } from '../logic/markdown.logic';
import { mergeOutcomes, multiplyOutcomes, outcomesToValues } from '../logic/outcomes.logic';
import { toPercentage } from '../logic/percentages.logic';

const dealerCardStrategy = getDealerCardStrategy();
const initialPairs = getInitialPairs();

const allScoresHeaders = ['', ...cards];
const allScoresRows = initialPairLabels.map((playerScoreLabel) => {
  const allEdges = cards.map((dealerCard) => {
    const { decision } = dealerCardStrategy[playerScoreLabel][dealerCard];
    return toPercentage(dealerCardStrategy[playerScoreLabel][dealerCard][decision].edge);
  });

  return [playerScoreLabel, ...allEdges];
});
const allScoresTable = getMarkdownTable(allScoresHeaders, allScoresRows);

console.log(allScoresTable);

const overallHeaders = ['Edge', 'Win', 'Lose', 'Push'];
const overallOutcomes = mergeOutcomes(
  initialPairLabels.map((playerKey) => {
    const allOutcomes = cards.map((dealerKey) => {
      const { decision } = dealerCardStrategy[playerKey][dealerKey];
      return dealerCardStrategy[playerKey][dealerKey][decision];
    });
    const aggregatedOutcomes = mergeOutcomes(allOutcomes);

    const initialProbability = initialPairs[playerKey];
    const averageOutcomes = multiplyOutcomes(aggregatedOutcomes, 1 / allOutcomes.length);
    return multiplyOutcomes(averageOutcomes, initialProbability);
  }),
);
const overallRows = [outcomesToValues(overallOutcomes)];
const overallTable = getMarkdownTable(overallHeaders, overallRows);

console.log('\n');
console.log(overallTable);

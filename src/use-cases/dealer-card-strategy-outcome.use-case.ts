import { cards } from '../logic/cards.logic';
import { getDealerCardStrategy } from '../logic/dealer-card-strategy.logic';
import { getInitialPairs } from '../logic/initial-pairs.logic';
import { initialPairLabels } from '../logic/labels.logic';
import { mergeOutcomes, multiplyOutcomes, outcomesToValues } from '../logic/outcomes.logic';
import { toPercentage } from '../logic/percentages.logic';
import { getTable } from '../logic/table.logic';

const dealerCardStrategy = getDealerCardStrategy();
const initialPairs = getInitialPairs();

const allScoresHeaders = ['', ...cards];
const allScoresRows = initialPairLabels.map((playerScoresLabel) => {
  const allEdges = cards.map((dealerCard) => {
    const decision = dealerCardStrategy[playerScoresLabel][dealerCard];
    return toPercentage(decision.outcomes[decision.action].edge);
  });

  return [playerScoresLabel, ...allEdges];
});
const allScoresTable = getTable(allScoresHeaders, allScoresRows);

console.log(allScoresTable);

const overallHeaders = ['Edge', 'Win', 'Lose', 'Push'];
const overallOutcomes = mergeOutcomes(
  initialPairLabels.map((playerScoresLabel) => {
    const allOutcomes = cards.map((dealerCard) => {
      const decision = dealerCardStrategy[playerScoresLabel][dealerCard];
      return decision.outcomes[decision.action];
    });
    const aggregatedOutcomes = mergeOutcomes(allOutcomes);

    const initialProbability = initialPairs.probabilities[playerScoresLabel];
    const averageOutcomes = multiplyOutcomes(aggregatedOutcomes, 1 / allOutcomes.length);
    return multiplyOutcomes(averageOutcomes, initialProbability);
  }),
);
const overallRows = [outcomesToValues(overallOutcomes)];
const overallTable = getTable(overallHeaders, overallRows);

console.log('\n');
console.log(overallTable);

import { Doubling } from '../../enums/doubling.enum';
import { cards } from '../../logic/cards.logic';
import { getDealerCardStrategy } from '../../logic/dealer-card-strategy.logic';
import { getInitialPairs } from '../../logic/initial-pairs.logic';
import {
  actionableLabels,
  getAbbreviatedAction,
  initialPairLabels,
} from '../../logic/labels.logic';
import { mergeOutcomes, multiplyOutcomes, outcomesToValues } from '../../logic/outcomes.logic';
import { toPercentage } from '../../logic/percentages.logic';
import { getTable } from '../../logic/table.logic';

const dealerCardStrategy = getDealerCardStrategy({ doubling: Doubling.all });

const strategyHeaders = ['', ...cards];
const strategyRows = actionableLabels.map((playerScoreLabel) => {
  const decisions = cards.map((dealerCard) => {
    return getAbbreviatedAction(dealerCardStrategy[playerScoreLabel][dealerCard].action);
  });
  return [playerScoreLabel, ...decisions];
});
const strategyTable = getTable(strategyHeaders, strategyRows);

console.log(strategyTable);

const initialPairs = getInitialPairs();

const allScoresHeaders = ['', ...cards];
const allScoresRows = initialPairLabels.map((playerScoresLabel) => {
  const allReturns = cards.map((dealerCard) => {
    const decision = dealerCardStrategy[playerScoresLabel][dealerCard];
    return toPercentage(decision.outcomes[decision.action].returns);
  });

  return [playerScoresLabel, ...allReturns];
});
const allScoresTable = getTable(allScoresHeaders, allScoresRows);

console.log('\n');
console.log(allScoresTable);

const overallHeaders = ['Returns', 'Win', 'Lose', 'Push'];
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

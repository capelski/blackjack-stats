import { getDealerFinals } from '../logic/dealer-finals';
import { getInitialPairs } from '../logic/initial-pairs';
import { sortByScoreLabels } from '../logic/labels';
import { headersToMarkdown, rowToMarkdown } from '../logic/markdown';
import { mergeOutcomes, multiplyOutcomes, outcomesToValues } from '../logic/outcomes';
import { getPlayerScoreStrategy } from '../logic/strategy';

const dealerFinals = getDealerFinals();
const playerScoreStrategy = getPlayerScoreStrategy(dealerFinals);
const initialPairs = getInitialPairs();

const breakdownMarkdown = [
  headersToMarkdown(['Player Score', 'Edge', 'Win', 'Lose', 'Push']),
  ...Object.keys(initialPairs)
    .sort(sortByScoreLabels)
    .map((playerKey) => {
      const { decision } = playerScoreStrategy[playerKey];
      const outcomes = playerScoreStrategy[playerKey][decision];

      return rowToMarkdown([playerKey, ...outcomesToValues(outcomes)]);
    }),
].join('\n');

console.log(breakdownMarkdown);

const overallOutcomes = mergeOutcomes(
  Object.keys(initialPairs).map((playerKey) => {
    const { decision } = playerScoreStrategy[playerKey];
    const outcomes = playerScoreStrategy[playerKey][decision];
    const initialProbability = initialPairs[playerKey];

    return multiplyOutcomes(outcomes, initialProbability);
  }),
);
const overallMarkdown = [
  headersToMarkdown(['Edge', 'Win', 'Lose', 'Push']),
  rowToMarkdown(outcomesToValues(overallOutcomes)),
].join('\n');

console.log('\n');
console.log(overallMarkdown);

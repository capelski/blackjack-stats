import { getDealerFinals } from '../logic/dealer-finals.logic';
import { getInitialPairs } from '../logic/initial-pairs.logic';
import { initialPairLabels } from '../logic/labels.logic';
import { getMarkdownTable } from '../logic/markdown.logic';
import { mergeOutcomes, multiplyOutcomes, outcomesToValues } from '../logic/outcomes.logic';
import { getPlayerScoreStrategy } from '../logic/player-score-strategy.logic';

const dealerFinals = getDealerFinals();
const playerScoreStrategy = getPlayerScoreStrategy(dealerFinals);
const initialPairs = getInitialPairs();

const allScoresHeaders = ['Score', 'Edge', 'Win', 'Lose', 'Push'];
const allScoresRows = initialPairLabels.map((playerKey) => {
  const { decision } = playerScoreStrategy[playerKey];
  const outcomes = playerScoreStrategy[playerKey][decision];

  return [playerKey, ...outcomesToValues(outcomes)];
});
const allScoresTable = getMarkdownTable(allScoresHeaders, allScoresRows);

console.log(allScoresTable);

const overallHeaders = ['Edge', 'Win', 'Lose', 'Push'];
const overallOutcomes = mergeOutcomes(
  initialPairLabels.map((playerKey) => {
    const { decision } = playerScoreStrategy[playerKey];
    const outcomes = playerScoreStrategy[playerKey][decision];
    const initialProbability = initialPairs[playerKey];

    return multiplyOutcomes(outcomes, initialProbability);
  }),
);
const overallRows = [outcomesToValues(overallOutcomes)];
const overallTable = getMarkdownTable(overallHeaders, overallRows);

console.log('\n');
console.log(overallTable);

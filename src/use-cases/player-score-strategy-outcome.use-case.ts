import { getInitialPairs } from '../logic/initial-pairs.logic';
import { initialPairLabels } from '../logic/labels.logic';
import { getMarkdownTable } from '../logic/markdown.logic';
import { mergeOutcomes, multiplyOutcomes, outcomesToValues } from '../logic/outcomes.logic';
import { getPlayerScoreStrategy } from '../logic/player-score-strategy.logic';

const playerScoreStrategy = getPlayerScoreStrategy();
const initialPairs = getInitialPairs();

const allScoresHeaders = ['Score', 'Edge', 'Win', 'Lose', 'Push'];
const allScoresRows = initialPairLabels.map((playerScoresLabel) => {
  const decision = playerScoreStrategy[playerScoresLabel];
  const outcomes = decision.outcomes[decision.action];

  return [playerScoresLabel, ...outcomesToValues(outcomes)];
});
const allScoresTable = getMarkdownTable(allScoresHeaders, allScoresRows);

console.log(allScoresTable);

const overallHeaders = ['Edge', 'Win', 'Lose', 'Push'];
const overallOutcomes = mergeOutcomes(
  initialPairLabels.map((playerScoresLabel) => {
    const decision = playerScoreStrategy[playerScoresLabel];
    const outcomes = decision.outcomes[decision.action];
    const initialProbability = initialPairs.probabilities[playerScoresLabel];

    return multiplyOutcomes(outcomes, initialProbability);
  }),
);
const overallRows = [outcomesToValues(overallOutcomes)];
const overallTable = getMarkdownTable(overallHeaders, overallRows);

console.log('\n');
console.log(overallTable);

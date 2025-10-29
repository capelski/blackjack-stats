import { Doubling } from '../../enums/doubling.enum';
import { getInitialPairs } from '../../logic/initial-pairs.logic';
import { actionableLabels, initialPairLabels } from '../../logic/labels.logic';
import { mergeOutcomes, multiplyOutcomes, outcomesToValues } from '../../logic/outcomes.logic';
import { getPlayerScoreStrategy } from '../../logic/player-score-strategy.logic';
import { getTable } from '../../logic/table.logic';

const playerScoreStrategy = getPlayerScoreStrategy({ doubling: Doubling.all });

const strategyHeaders = ['Score', 'Decision'];
const strategyRows = actionableLabels.map((playerScoreLabel) => {
  return [playerScoreLabel, playerScoreStrategy[playerScoreLabel].action];
});
const strategyTable = getTable(strategyHeaders, strategyRows);

console.log(strategyTable);

const initialPairs = getInitialPairs();

const allScoresHeaders = ['Score', 'Returns', 'Win', 'Lose', 'Push'];
const allScoresRows = initialPairLabels.map((playerScoresLabel) => {
  const decision = playerScoreStrategy[playerScoresLabel];
  const outcomes = decision.outcomes[decision.action];

  return [playerScoresLabel, ...outcomesToValues(outcomes)];
});
const allScoresTable = getTable(allScoresHeaders, allScoresRows);

console.log('\n');
console.log(allScoresTable);

const overallHeaders = ['Returns', 'Win', 'Lose', 'Push'];
const overallOutcomes = mergeOutcomes(
  initialPairLabels.map((playerScoresLabel) => {
    const decision = playerScoreStrategy[playerScoresLabel];
    const outcomes = decision.outcomes[decision.action];
    const initialProbability = initialPairs.probabilities[playerScoresLabel];

    return multiplyOutcomes(outcomes, initialProbability);
  }),
);
const overallRows = [outcomesToValues(overallOutcomes)];
const overallTable = getTable(overallHeaders, overallRows);

console.log('\n');
console.log(overallTable);

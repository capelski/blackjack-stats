import { cardValues } from './cards.logic';
import { getPlayerHands } from './hands.logic';
import { blackjackLabel, getActionableLabels, getScoresLabel } from './labels.logic';
import { getScores } from './scores.logic';
import { getTable } from './table.logic';

export const getScoreDependencies = () => {
  const backwardDependencies: { [key: string]: string[] } = {};
  const forwardDependencies: { [key: string]: string[] } = {};

  for (const playerHand of getPlayerHands()) {
    if (playerHand.isFinal) {
      continue;
    }

    forwardDependencies[playerHand.label] = forwardDependencies[playerHand.label] || [];

    for (const nextCardValues of cardValues) {
      const nextScores = getScores(playerHand.scores, nextCardValues, undefined);
      const nextScoresLabel = getScoresLabel(nextScores);

      backwardDependencies[nextScoresLabel] = backwardDependencies[nextScoresLabel] || [];

      if (!backwardDependencies[nextScoresLabel].includes(playerHand.label)) {
        backwardDependencies[nextScoresLabel].push(playerHand.label);
      }

      if (!forwardDependencies[playerHand.label].includes(nextScoresLabel)) {
        forwardDependencies[playerHand.label].push(nextScoresLabel);
      }
    }
  }

  return { backwardDependencies, forwardDependencies };
};

export const printScoreDependencies = () => {
  const actionableLabels = getActionableLabels();
  const { forwardDependencies } = getScoreDependencies();

  const forwardHeaders = ['Score', 'Next Scores'];
  const forwardRows = actionableLabels.map(scoreLabel => {
    return [scoreLabel, forwardDependencies[scoreLabel].join(', ')];
  });
  const forwardTable = getTable(forwardHeaders, forwardRows);

  console.log(forwardTable);

  const playerLabels = getPlayerHands()
    .filter(hand => hand.label !== blackjackLabel)
    .map(hand => hand.label);
  const headers = ['Score', ...playerLabels];
  const rows = actionableLabels.map(scoreLabel => {
    return [
      scoreLabel,
      ...playerLabels.map(
        label => (forwardDependencies[scoreLabel]?.includes(String(label)) && 'x') || '',
      ),
    ];
  });
  const table = getTable(headers, rows);

  console.log('\n');
  console.log(table);
};

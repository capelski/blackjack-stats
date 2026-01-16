import { cardValues } from './cards.logic';
import { getPlayerHands, getPlayerHandsSorted } from './hands.logic';
import { getScoresLabel } from './labels.logic';
import { getScores } from './scores.logic';
import { getTable } from './table.logic';

type Dependencies = { [playerScoreLabel: string]: string[] };

export const getScoreDependencies = () => {
  const backwardDependencies: Dependencies = {};
  const forwardDependencies: Dependencies = {};

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

const getForwardReferencesTable = (playerHandLabels: string[], dependencies: Dependencies) => {
  const headers = ['Score', 'Next Scores'];
  const rows = playerHandLabels.map(playerHandLabel => {
    return [playerHandLabel, dependencies[playerHandLabel].join(', ')];
  });
  const table = getTable(headers, rows);
  return table;
};

const getScoreDependenciesMatrix = (playerHandLabels: string[], dependencies: Dependencies) => {
  const headers = ['Score', ...playerHandLabels];
  const rows = playerHandLabels.map(scoreLabel => {
    return [
      scoreLabel,
      ...playerHandLabels.map(
        label => (dependencies[scoreLabel]?.includes(String(label)) && 'x') || '',
      ),
    ];
  });
  return getTable(headers, rows);
};

export const printScoreDependencies = () => {
  const playerHandLabels = getPlayerHandsSorted()
    .filter(hand => !hand.isFinal)
    .map(hand => hand.label);
  const { forwardDependencies } = getScoreDependencies();

  const forwardReferencesTable = getForwardReferencesTable(playerHandLabels, forwardDependencies);
  const scoreDependenciesMatrix = getScoreDependenciesMatrix(playerHandLabels, forwardDependencies);

  console.log(`${forwardReferencesTable}\n
${scoreDependenciesMatrix}`);
};

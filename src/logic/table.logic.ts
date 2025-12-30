import { FinalProbabilities } from '../types/finals.type';
import { Outcomes } from '../types/outcomes.type';
import { PlayerDecisionStrategy } from '../types/player-decision-strategy.type';
import { StrategyOptions } from '../types/strategy-options.type';
import { getInitialPairs } from './initial-pairs.logic';
import { getInitialPairLabels } from './labels.logic';
import {
  getOutcomesLabels,
  mergeOutcomes,
  multiplyOutcomes,
  outcomesToValues,
} from './outcomes.logic';
import {
  mergeFinalProbabilities,
  multiplyFinalProbabilities,
  stringifyFinalProbabilities,
} from './player-finals.logic';

export const tableFormat: 'csv' | 'markdown' = 'markdown';

export const getTable = (headers: (string | number)[], rows: (string | number)[][]) => {
  const lines =
    tableFormat === 'markdown'
      ? [...headersToMarkdown(headers), ...rows.map(row => rowToMarkdown(row))]
      : [headersToCsv(headers), ...rows.map(row => rowToCsv(row))];

  return lines.join('\n');
};

const headersToCsv = (headers: (string | number)[]) => {
  return `${headers.join(',')}`;
};

const headersToMarkdown = (headers: (string | number)[]) => {
  const headersRow = headers.map(header => `| ${header} `).join('') + '|';
  const separatorRow = headers.map(() => '| --- ').join('') + '|';

  return [headersRow, separatorRow];
};

const rowToCsv = (columns: (string | number)[]) => {
  return columns.map(column => (String(column).includes(',') ? `"${column}"` : column)).join(',');
};

const rowToMarkdown = (columns: (string | number)[]) => {
  return columns.map(column => `| ${column} `).join('') + '|';
};

export const getActionsTable = (
  headers: (string | number)[],
  getRow: (playerScoresLabel: string) => string[],
  strategyOptions: StrategyOptions = {},
) => {
  const actionsRows = getInitialPairLabels({ excludeFinalHands: true, ...strategyOptions }).map(
    playerScoresLabel => {
      return getRow(playerScoresLabel);
    },
  );

  return getTable(headers, actionsRows);
};

export const getIndividualFinalProbabilitiesTable = (
  headers: (string | number)[],
  getRow: (playerScoresLabel: string) => string[],
  strategyOptions: StrategyOptions = {},
) => {
  const finalsRows = getInitialPairLabels({
    includeNonInitialHands: true,
    ...strategyOptions,
  }).map(playerScoresLabel => {
    return getRow(playerScoresLabel);
  });

  return getTable(headers, finalsRows);
};

export const getOverallFinalProbabilitiesTable = (
  getFinalProbabilities: (playerScoresLabel: string) => FinalProbabilities,
  strategyOptions: StrategyOptions = {},
) => {
  const initialPairs = getInitialPairs(strategyOptions.splitting);
  const initialPairLabels = getInitialPairLabels(strategyOptions);

  const overallHeaders = ['Final Probabilities'];
  const overallFinalProbabilities = initialPairLabels.reduce<FinalProbabilities>(
    (reduced, playerScoresLabel) => {
      const initialProbability = initialPairs.probabilities[playerScoresLabel];
      const finalProbabilities = getFinalProbabilities(playerScoresLabel);
      const weightedProbabilities = multiplyFinalProbabilities(
        finalProbabilities,
        initialProbability,
      );

      return mergeFinalProbabilities(weightedProbabilities, reduced);
    },
    {},
  );
  const overallRows = stringifyFinalProbabilities(overallFinalProbabilities).map(value => [value]);

  return getTable(overallHeaders, overallRows);
};

export const getIndividualOutcomesTable = (
  headers: (string | number)[],
  getRow: (playerScoresLabel: string) => string[],
  strategyOptions: StrategyOptions = {},
) => {
  const initialPairLabels = getInitialPairLabels({
    includeNonInitialHands: true,
    ...strategyOptions,
  });

  const allScoresRows = initialPairLabels.map(playerScoresLabel => {
    return getRow(playerScoresLabel);
  });

  return getTable(headers, allScoresRows);
};

export const getOverallOutcomesTable = (
  getOutcomes: (playerScoresLabel: string) => Outcomes,
  strategyOptions: StrategyOptions = {},
) => {
  const initialPairs = getInitialPairs(strategyOptions.splitting);
  const initialPairLabels = getInitialPairLabels(strategyOptions);

  const overallHeaders = getOutcomesLabels();
  const overallOutcomes = mergeOutcomes(
    initialPairLabels.map(playerScoresLabel => {
      const initialProbability = initialPairs.probabilities[playerScoresLabel];

      return multiplyOutcomes(getOutcomes(playerScoresLabel), initialProbability);
    }),
  );
  const overallRows = [outcomesToValues(overallOutcomes)];

  return getTable(overallHeaders, overallRows);
};

export const printPlayerDecisionStrategyTables = (
  strategy: PlayerDecisionStrategy,
  strategyOptions: StrategyOptions = {},
) => {
  const actionsTable = getActionsTable(
    ['Score', 'Action'],
    playerScoresLabel => [playerScoresLabel, strategy[playerScoresLabel].action],
    strategyOptions,
  );

  const individualFinalProbabilitiesTable = getIndividualFinalProbabilitiesTable(
    ['Score', 'Final Probabilities'],
    playerScoresLabel => {
      const finalProbabilities = strategy[playerScoresLabel].selectedOutcomes.finalProbabilities;
      return [playerScoresLabel, stringifyFinalProbabilities(finalProbabilities).join(' / ')];
    },
    strategyOptions,
  );

  const overallFinalProbabilitiesTable = getOverallFinalProbabilitiesTable(
    playerScoresLabel => strategy[playerScoresLabel].selectedOutcomes.finalProbabilities,
    strategyOptions,
  );

  const individualOutcomesTable = getIndividualOutcomesTable(
    ['Score', ...getOutcomesLabels()],
    playerScoresLabel => {
      const outcomes = strategy[playerScoresLabel].selectedOutcomes;
      return [playerScoresLabel, ...outcomesToValues(outcomes)];
    },
    strategyOptions,
  );

  const overallOutcomesTable = getOverallOutcomesTable(
    playerScoresLabel => strategy[playerScoresLabel].selectedOutcomes,
    strategyOptions,
  );

  console.log(
    `${actionsTable}\n
${individualFinalProbabilitiesTable}\n
${overallFinalProbabilitiesTable}\n
${individualOutcomesTable}\n
${overallOutcomesTable}`,
  );
};

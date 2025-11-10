import { Action } from '../enums/action.enum';
import { FinalProbabilities } from '../types/finals.type';
import { Outcomes } from '../types/outcomes.type';
import { PlayerDecisionStrategy } from '../types/player-decision-strategy.type';
import { StrategyOptions } from '../types/strategy-options.type';
import { getInitialPairs } from './initial-pairs.logic';
import { getActionableLabels, getInitialPairLabels } from './labels.logic';
import { mergeOutcomes, multiplyOutcomes, outcomesToValues } from './outcomes.logic';
import { toPercentage } from './percentages.logic';

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

export const printActionsTable = (
  getAction: (playerScoresLabel: string) => Action,
  strategyOptions: StrategyOptions = {},
) => {
  const actionsHeaders = ['Score', 'Action'];
  const actionsRows = getActionableLabels(strategyOptions.splitting).map(playerScoresLabel => {
    return [playerScoresLabel, getAction(playerScoresLabel)];
  });
  const actionsTable = getTable(actionsHeaders, actionsRows);
  console.log(actionsTable);
};

export const printFinalProbabilitiesTable = (
  getFinalProbabilities: (playerScoresLabel: string) => FinalProbabilities,
  strategyOptions: StrategyOptions = {},
) => {
  const finalsHeaders = ['Score', 'Final Probabilities'];
  const finalsRows = getActionableLabels(strategyOptions.splitting).map(playerScoresLabel => {
    const finalProbabilities = getFinalProbabilities(playerScoresLabel);
    return [
      playerScoresLabel,
      Object.keys(finalProbabilities)
        .map(finalScoreLabel => {
          return `${finalScoreLabel}: ${toPercentage(finalProbabilities[finalScoreLabel])}`;
        })
        .join(' / '),
    ];
  });
  const finalsTable = getTable(finalsHeaders, finalsRows);

  console.log(finalsTable);
};

export const printReturnsTable = (
  getReturns: (playerScoresLabel: string) => number,
  strategyOptions: StrategyOptions = {},
) => {
  const initialPairLabels = getInitialPairLabels(strategyOptions.splitting);

  const allScoresHeaders = ['Score', 'Returns'];
  const allScoresRows = initialPairLabels.map(playerScoresLabel => {
    const returns = getReturns(playerScoresLabel);
    return [playerScoresLabel, toPercentage(returns)];
  });
  const allScoresTable = getTable(allScoresHeaders, allScoresRows);

  console.log(allScoresTable);
};

export const printOverallReturnsTable = (
  getOutcomes: (playerScoresLabel: string) => Outcomes,
  strategyOptions: StrategyOptions = {},
) => {
  const initialPairs = getInitialPairs(strategyOptions.splitting);
  const initialPairLabels = getInitialPairLabels(strategyOptions.splitting);

  const overallHeaders = ['Returns', 'Win', 'Lose', 'Push'];
  const overallOutcomes = mergeOutcomes(
    initialPairLabels.map(playerScoresLabel => {
      const initialProbability = initialPairs.probabilities[playerScoresLabel];

      return multiplyOutcomes(getOutcomes(playerScoresLabel), initialProbability);
    }),
  );
  const overallRows = [outcomesToValues(overallOutcomes)];
  const overallTable = getTable(overallHeaders, overallRows);

  console.log(overallTable);
};

export const printPlayerDecisionStrategyTables = (
  strategy: PlayerDecisionStrategy,
  strategyOptions: StrategyOptions = {},
) => {
  printActionsTable(playerScoresLabel => strategy[playerScoresLabel].action, strategyOptions);

  console.log('\n');

  printFinalProbabilitiesTable(
    playerScoresLabel => strategy[playerScoresLabel].selectedOutcomes.finalProbabilities,
    strategyOptions,
  );

  console.log('\n');

  printReturnsTable(
    playerScoresLabel => strategy[playerScoresLabel].selectedOutcomes.returns,
    strategyOptions,
  );

  console.log('\n');

  printOverallReturnsTable(
    playerScoresLabel => strategy[playerScoresLabel].selectedOutcomes,
    strategyOptions,
  );
};

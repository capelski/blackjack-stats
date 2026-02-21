import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { Result } from '../enums/result.enum';
import { Card } from '../types/card.type';
import { DealerAwareStrategy } from '../types/dealer-aware-strategy.type';
import { FinalProbabilities } from '../types/final-probabilities.type';
import { SelfAwareStrategy } from '../types/self-aware-strategy.type';
import { StrategyBase } from '../types/strategy-base.type';
import { StrategyOptions } from '../types/strategy-options.type';
import {
  InitialPairsConsequences,
  PlayerFinalsSummaryMap,
  PlayerFinalSummary,
  StrategySummary,
} from '../types/strategy-summary.type';
import { formatBetMultiplier, getBetMultiplierLabel } from './bet-multiplier.logic';
import { printCardsCombinations } from './cards-combination.logic';
import { cards } from './cards.logic';
import { stringifyFinalProbabilities } from './final-probabilities.logic';
import { getPlayerHandsSorted } from './hands.logic';
import { getAbbreviatedAction, getScoresLabel } from './labels.logic';
import { getNumericKeys, toPercentage } from './numbers.logic';
import { getOutcomesLabels, outcomesToValues } from './outcomes.logic';
import { getResultsLabels, resultsToValues } from './results.logic';

export const tableFormat: 'csv' | 'markdown' = 'markdown';

export type PlayerScoresRowGetter = (playerScoresLabel: string) => string[];
export type FinalProbabilitiesRowGetter = (playerScoresLabel: string) => FinalProbabilities;

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
  getRow: PlayerScoresRowGetter,
  options: StrategyOptions = {},
) => {
  const actionsRows = getPlayerHandsSorted(options.splitting)
    .filter(hand => !hand.isFinal)
    .map(playerHand => {
      return getRow(playerHand.label);
    });

  return getTable(headers, actionsRows);
};

const getApplicableKeys = (finalScoresSummaries: PlayerFinalsSummaryMap): number[] => {
  const applicableKeys = getNumericKeys(finalScoresSummaries).filter(finalScore => {
    const finalScoreSummary = finalScoresSummaries[finalScore];
    return finalScoreSummary.probability > 0;
  });
  return applicableKeys;
};

export const getOverallFinalProbabilitiesTable = (summary: StrategySummary) => {
  const headers = ['Final score', 'Combinations', 'Probability'];

  const applicableKeys = getApplicableKeys(summary.finalScoresSummaries);

  const finalScoreRows = applicableKeys.map(finalScore => {
    const finalScoreSummary = summary.finalScoresSummaries[finalScore];

    return [
      getScoresLabel([finalScore]),
      finalScoreSummary.combinations,
      toPercentage(finalScoreSummary.probability),
    ];
  });

  const totals = applicableKeys.reduce<{ combinations: number; probability: number }>(
    (reduced, finalScore) => {
      const finalScoreSummary = summary.finalScoresSummaries[finalScore];
      return {
        combinations: (reduced.combinations || 0) + finalScoreSummary.combinations,
        probability: (reduced.probability || 0) + finalScoreSummary.probability,
      };
    },
    {
      combinations: 0,
      probability: 0,
    },
  );

  const totalsRow = [
    '<b>Total</b>',
    `<b>${totals.combinations}</b>`,
    `<b>${toPercentage(totals.probability)}</b>`,
  ];

  return getTable(headers, [...finalScoreRows, totalsRow]);
};

/** Helper to validate that all rows have the same length */
export const overallRow = (
  values: [string, string, string, string, string, string, string, string, string],
) => {
  return values;
};

const getFinalScoreRow = (finalScore: number, playerScoreSummary: PlayerFinalSummary) => {
  const { betMultiplier, outcomes, probability, results } = playerScoreSummary;
  const playerScoreRow = overallRow([
    getScoresLabel([finalScore]),
    toPercentage(probability),
    ...outcomesToValues(outcomes),
    formatBetMultiplier(betMultiplier),
    ...resultsToValues(results),
  ]);
  return playerScoreRow;
};

const getSummaryRow = (summary: StrategySummary) => {
  const { outcomes, results } = summary;
  const summaryRow = overallRow([
    '<b>Total</b>',
    '-',
    ...outcomesToValues(outcomes, { bold: true }),
    '-',
    ...resultsToValues(results, { bold: true }),
  ]);
  return summaryRow;
};

export const getFinalScoresTable = (summary: StrategySummary) => {
  const headers = overallRow([
    'Final score',
    'Probability',
    ...getOutcomesLabels(),
    getBetMultiplierLabel(),
    ...getResultsLabels(),
  ]);

  const finalScoreRows = getApplicableKeys(summary.finalScoresSummaries).map(playerFinalScore => {
    const playerScoreSummary = summary.finalScoresSummaries[playerFinalScore];
    return getFinalScoreRow(playerFinalScore, playerScoreSummary);
  });

  const summaryRow = getSummaryRow(summary);

  return getTable(headers, [...finalScoreRows, summaryRow]);
};

export const getInitialScoresTable = (consequences: InitialPairsConsequences) => {
  const headers = overallRow([
    'Score',
    'Final Probabilities',
    ...getOutcomesLabels(),
    getBetMultiplierLabel(),
    ...getResultsLabels(),
  ]);

  const rows = Object.keys(consequences).map(playerScoreLabel => {
    const consequence = consequences[playerScoreLabel];
    const { finalProbabilities, outcomes, betMultiplier, results } = consequence;
    return overallRow([
      playerScoreLabel,
      stringifyFinalProbabilities(finalProbabilities).join(' / '),
      ...outcomesToValues(outcomes),
      formatBetMultiplier(betMultiplier),
      ...resultsToValues(results),
    ]);
  });
  return getTable(headers, rows);
};

const getResultColor = (result: Result) => {
  return result === Result.win ? '#284E13' : result === Result.lose ? '#660000' : '#7F6001';
};

export const getFinalScoresMatrix = ({ dealerFinalScores, summary }: StrategyBase) => {
  const headers = ['', ...getNumericKeys(dealerFinalScores)];

  const rows = getApplicableKeys(summary.finalScoresSummaries).map(playerFinalScore => {
    const playerFinal = summary.finalScoresSummaries[playerFinalScore];
    return [
      `<b>${getScoresLabel([playerFinalScore])}</b>`,
      ...getNumericKeys(playerFinal.dealerFinals).map(dealerFinal => {
        const dealerFinalSummary = playerFinal.dealerFinals[dealerFinal];
        const probability = dealerFinalSummary.probability * playerFinal.probability;

        return `<span style="color: ${getResultColor(dealerFinalSummary.result)}">${toPercentage(
          probability,
        )}</span>`;
      }),
    ];
  });

  return getTable(headers, rows);
};

export type StrategyTableResolvers = {
  actionsHeaders: Card[];
  actionsRowGetter: PlayerScoresRowGetter;
};

export const printStrategyTable = (
  outputFile: [string, string],
  strategy: StrategyBase,
  resolvers: StrategyTableResolvers,
) => {
  const actionsTable = getActionsTable(
    resolvers.actionsHeaders,
    resolvers.actionsRowGetter,
    strategy.options,
  );

  const overallFinalProbabilitiesTable = getOverallFinalProbabilitiesTable(strategy.summary);

  const finalScoresMatrix = getFinalScoresMatrix(strategy);

  const finalScoresTable = getFinalScoresTable(strategy.summary);

  const initialScoresTable = getInitialScoresTable(strategy.summary.initialPairsConsequences);

  const [directory, fileName] = outputFile;
  const path = resolve('output', 'strategies', directory);
  const combinationsOutputName = `${fileName}.combinations.md`;

  const output = `${actionsTable}\n
${overallFinalProbabilitiesTable}
*See all the combinations in [${combinationsOutputName}](./${combinationsOutputName})*\n
${finalScoresMatrix}\n
${finalScoresTable}\n
${initialScoresTable}`;

  const outputPath = resolve(path, `${fileName}.md`);
  writeFileSync(outputPath, output);

  const combinationsTree = printCardsCombinations(strategy.summary.combinations.tree || [], true);
  const combinationsOutputPath = resolve(path, combinationsOutputName);
  writeFileSync(combinationsOutputPath, combinationsTree);
};

export const printSelfAwareStrategyTables = (
  outputFile: [string, string],
  strategy: SelfAwareStrategy,
) => {
  return printStrategyTable(outputFile, strategy, {
    actionsHeaders: ['Score', 'Action'],
    actionsRowGetter: playerScoresLabel => [
      playerScoresLabel,
      strategy.decisions[playerScoresLabel].action,
    ],
  });
};

export const printDealerAwareStrategyTables = (
  outputFile: [string, string],
  strategy: DealerAwareStrategy,
) => {
  return printStrategyTable(outputFile, strategy, {
    actionsHeaders: ['', ...cards],
    actionsRowGetter: playerScoresLabel => {
      const actions = cards.map(dealerCard => {
        return getAbbreviatedAction(
          strategy.dealerCards[dealerCard].decisions[playerScoresLabel].action,
        );
      });
      return [playerScoresLabel, ...actions];
    },
  });
};

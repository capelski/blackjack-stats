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
  PlayerFinalSummary,
  StrategySummary,
} from '../types/strategy-summary.type';
import { printCardsCombinations } from './cards-combination.logic';
import { cards } from './cards.logic';
import { stringifyFinalProbabilities } from './final-probabilities.logic';
import { getPlayerHandsSorted } from './hands.logic';
import { getAbbreviatedAction, getScoresLabel } from './labels.logic';
import { getNumericKeys, toDecimal, toPercentage } from './numbers.logic';
import { getOutcomesLabels, outcomesToValues } from './outcomes.logic';

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

export const getOverallFinalProbabilitiesTable = (summary: StrategySummary) => {
  const headers = ['Final score', 'Combinations', 'Probability'];

  const finalScoreRows = getNumericKeys(summary.finalScoresSummaries)
    .filter(finalScore => {
      const finalScoreSummary = summary.finalScoresSummaries[finalScore];
      return finalScoreSummary.probability > 0;
    })
    .map(finalScore => {
      const finalScoreSummary = summary.finalScoresSummaries[finalScore];

      return [
        getScoresLabel([finalScore]),
        finalScoreSummary.combinations,
        toPercentage(finalScoreSummary.probability),
      ];
    });

  const totalsRow = [
    'Total',
    summary.combinations.number,
    toPercentage(summary.combinations.probability),
  ];

  return getTable(headers, [...finalScoreRows, totalsRow]);
};

const twoLinesCell = (firstValue: Card, secondValue: string) => {
  return `${firstValue}<br /><i>${secondValue}</i>`;
};

const percentagesCell = (percentage: number, factor: number) => {
  return percentage
    ? twoLinesCell(toPercentage(percentage), toPercentage(percentage * factor))
    : '-';
};

export const betReturnsCell = (betReturns: number, factor: number) => {
  return betReturns && toDecimal(betReturns) !== '0'
    ? twoLinesCell(toDecimal(betReturns), toDecimal(betReturns * factor, 3))
    : '0';
};

/** Helper to validate that all rows have the same length */
export const overallRow = (values: [string, string, string, string, string, string]) => {
  return values;
};

const getFinalScoreRow = (finalScore: number, playerScoreSummary: PlayerFinalSummary) => {
  const { outcomes, probability } = playerScoreSummary;
  const playerScoreRow = overallRow([
    twoLinesCell(getScoresLabel([finalScore]), toPercentage(probability)),
    percentagesCell(outcomes.win, probability),
    percentagesCell(outcomes.push, probability),
    percentagesCell(outcomes.lose, probability),
    percentagesCell(outcomes.edge, probability),
    betReturnsCell(outcomes.roi, probability),
  ]);
  return playerScoreRow;
};

const getSummaryRow = (summary: StrategySummary) => {
  const { outcomes } = summary;
  const summaryRow = overallRow([
    '<b>Total</b>',
    `<b>${toPercentage(outcomes.win)}</b>`,
    `<b>${toPercentage(outcomes.push)}</b>`,
    `<b>${toPercentage(outcomes.lose)}</b>`,
    `<b>${toPercentage(outcomes.roi - 1)}</b>`,
    `<b>${toDecimal(outcomes.roi, 3)}</b>`,
  ]);
  return summaryRow;
};

export const getFinalScoresTable = (summary: StrategySummary) => {
  const headers = overallRow(['Final score', ...getOutcomesLabels()]);

  const playerFinalScores = getNumericKeys(summary.finalScoresSummaries);
  const finalScoreRows = playerFinalScores.map(playerFinalScore => {
    const playerScoreSummary = summary.finalScoresSummaries[playerFinalScore];
    const headerRow = getFinalScoreRow(playerFinalScore, playerScoreSummary);
    return headerRow;
  });

  const summaryRow = getSummaryRow(summary);

  return getTable(headers, [...finalScoreRows, summaryRow]);
};

export const getInitialScoresTable = (consequences: InitialPairsConsequences) => {
  const headers = ['Score', 'Final Probabilities', ...getOutcomesLabels()];
  const rows = Object.keys(consequences).map(playerScoreLabel => {
    const consequence = consequences[playerScoreLabel];
    const { finalProbabilities, outcomes } = consequence;
    return [
      playerScoreLabel,
      stringifyFinalProbabilities(finalProbabilities).join(' / '),
      ...outcomesToValues(outcomes),
    ];
  });
  return getTable(headers, rows);
};

const getResultColor = (result: Result) => {
  return result === Result.win ? '#284E13' : result === Result.lose ? '#660000' : '#7F6001';
};

export const getFinalScoresMatrix = ({ dealerFinalScores, summary }: StrategyBase) => {
  const headers = ['', ...getNumericKeys(dealerFinalScores)];

  const rows = getNumericKeys(summary.finalScoresSummaries)
    .filter(finalScore => {
      const finalScoreSummary = summary.finalScoresSummaries[finalScore];
      return finalScoreSummary.probability > 0;
    })
    .map(playerFinalScore => {
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

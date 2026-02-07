import { Result } from '../enums/result.enum';
import { Card } from '../types/card.type';
import { DealerCardStrategy } from '../types/dealer-card-strategy.type';
import { FinalProbabilities } from '../types/final-probabilities.type';
import { PlayerDecisionStrategy } from '../types/player-decision-strategy.type';
import { StrategyBase } from '../types/strategy-base.type';
import { StrategyOptions } from '../types/strategy-options.type';
import { ConsequencesByInitialPairs, StrategySummary } from '../types/strategy-summary.type';
import { cards } from './cards.logic';
import { stringifyFinalProbabilities } from './final-probabilities.logic';
import { getPlayerHandsSorted } from './hands.logic';
import { getAbbreviatedAction, getScoresLabel } from './labels.logic';
import { getNumericKeys, toPercentage } from './numbers.logic';
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

export const getOverallOutcomesTable = (strategySummary: StrategySummary) => {
  const overallHeaders = getOutcomesLabels();
  const overallRows = [outcomesToValues(strategySummary.outcomes)];

  return getTable(overallHeaders, overallRows);
};

export const getBreakdownByInitialPairsTable = (consequences: ConsequencesByInitialPairs) => {
  const headers = ['Score', 'Final Probabilities', ...getOutcomesLabels()];
  const rows = Object.keys(consequences).map(playerScoresLabel => {
    const { finalProbabilities, outcomes } = consequences[playerScoresLabel];
    return [
      playerScoresLabel,
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

export const printStrategyTable = (strategy: StrategyBase, resolvers: StrategyTableResolvers) => {
  const actionsTable = getActionsTable(
    resolvers.actionsHeaders,
    resolvers.actionsRowGetter,
    strategy.options,
  );

  const overallFinalProbabilitiesTable = getOverallFinalProbabilitiesTable(strategy.summary);

  const finalScoresMatrix = getFinalScoresMatrix(strategy);

  const overallOutcomesTable = getOverallOutcomesTable(strategy.summary);

  const breakdownByInitialPairsTable = getBreakdownByInitialPairsTable(
    strategy.summary.consequencesByInitialPairs,
  );

  console.log(
    `${actionsTable}\n
${overallFinalProbabilitiesTable}\n
${finalScoresMatrix}\n
${overallOutcomesTable}\n
${breakdownByInitialPairsTable}`,
  );
};

export const printPlayerDecisionStrategyTables = (strategy: PlayerDecisionStrategy) => {
  return printStrategyTable(strategy, {
    actionsHeaders: ['Score', 'Action'],
    actionsRowGetter: playerScoresLabel => [
      playerScoresLabel,
      strategy.decisions[playerScoresLabel].action,
    ],
  });
};

export const printDealerCardStrategyTables = (strategy: DealerCardStrategy) => {
  return printStrategyTable(strategy, {
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

import { Card } from '../types/card.type';
import { DealerCardStrategy } from '../types/dealer-card-strategy.type';
import { FinalProbabilities } from '../types/final-scores.type';
import { Outcomes } from '../types/outcomes.type';
import { PlayerDecisionStrategy } from '../types/player-decision-strategy.type';
import { StrategyOptions } from '../types/strategy-options.type';
import { ConsequencesByInitialPairs, StrategySummary } from '../types/strategy-summary.type';
import { cards } from './cards.logic';
import {
  mergeFinalProbabilities,
  multiplyFinalProbabilities,
  stringifyFinalProbabilities,
} from './final-probabilities.logic';
import { getInitialPairs } from './initial-pairs.logic';
import { getAbbreviatedAction, getInitialPairLabels } from './labels.logic';
import {
  getOutcomesLabels,
  mergeOutcomes,
  multiplyOutcomes,
  outcomesToValues,
} from './outcomes.logic';

export const tableFormat: 'csv' | 'markdown' = 'markdown';

export type PlayerScoresRowGetter = (playerScoresLabel: string) => string[];
export type FinalProbabilitiesRowGetter = (playerScoresLabel: string) => FinalProbabilities;
export type OutcomesRowGetter = (playerScoresLabel: string) => Outcomes;

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
  strategyOptions: StrategyOptions = {},
) => {
  const actionsRows = getInitialPairLabels({ excludeFinalHands: true, ...strategyOptions }).map(
    playerScoresLabel => {
      return getRow(playerScoresLabel);
    },
  );

  return getTable(headers, actionsRows);
};

export const getOverallFinalProbabilitiesTable = (
  getFinalProbabilities: FinalProbabilitiesRowGetter,
  strategyOptions: StrategyOptions = {},
) => {
  const initialPairs = getInitialPairs(strategyOptions.splitting);
  const initialPairLabels = getInitialPairLabels(strategyOptions);

  const overallHeaders = ['Final Probabilities'];
  const overallFinalProbabilities = initialPairLabels.reduce<FinalProbabilities>(
    (reduced, playerScoresLabel) => {
      const initialProbability = initialPairs[playerScoresLabel].probability;
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

export const getOverallOutcomesTable = (
  getOutcomes: OutcomesRowGetter,
  strategyOptions: StrategyOptions = {},
) => {
  const initialPairs = getInitialPairs(strategyOptions.splitting);
  const initialPairLabels = getInitialPairLabels(strategyOptions);

  const overallHeaders = getOutcomesLabels();
  const overallOutcomes = mergeOutcomes(
    initialPairLabels.map(playerScoresLabel => {
      const initialProbability = initialPairs[playerScoresLabel].probability;

      return multiplyOutcomes(getOutcomes(playerScoresLabel), initialProbability);
    }),
  );
  const overallRows = [outcomesToValues(overallOutcomes)];

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

export type StrategyTableResolvers = {
  actionsHeaders: Card[];
  actionsRowGetter: PlayerScoresRowGetter;
  overallFinalProbabilitiesRowGetter: FinalProbabilitiesRowGetter;
  overallOutcomesRowGetter: OutcomesRowGetter;
};

export const printStrategyTable = (
  resolvers: StrategyTableResolvers,
  strategyOptions: StrategyOptions = {},
  strategySummary: StrategySummary,
) => {
  const actionsTable = getActionsTable(
    resolvers.actionsHeaders,
    resolvers.actionsRowGetter,
    strategyOptions,
  );

  const overallFinalProbabilitiesTable = getOverallFinalProbabilitiesTable(
    resolvers.overallFinalProbabilitiesRowGetter,
    strategyOptions,
  );

  const overallOutcomesTable = getOverallOutcomesTable(
    resolvers.overallOutcomesRowGetter,
    strategyOptions,
  );

  const individualFinalProbabilitiesTable = getBreakdownByInitialPairsTable(
    strategySummary.consequencesByInitialPairs,
  );

  console.log(
    `${actionsTable}\n
${overallFinalProbabilitiesTable}\n
${overallOutcomesTable}\n
${individualFinalProbabilitiesTable}`,
  );
};

export const printPlayerDecisionStrategyTables = (strategy: PlayerDecisionStrategy) => {
  return printStrategyTable(
    {
      actionsHeaders: ['Score', 'Action'],
      actionsRowGetter: playerScoresLabel => [
        playerScoresLabel,
        strategy.decisions[playerScoresLabel].action,
      ],
      overallFinalProbabilitiesRowGetter: playerScoresLabel =>
        strategy.decisions[playerScoresLabel].selectedConsequence.finalProbabilities,
      overallOutcomesRowGetter: playerScoresLabel =>
        strategy.decisions[playerScoresLabel].selectedConsequence.outcomes,
    },
    strategy.options,
    strategy.summary,
  );
};

export const printDealerCardStrategyTables = (strategy: DealerCardStrategy) => {
  return printStrategyTable(
    {
      actionsHeaders: ['', ...cards],
      actionsRowGetter: playerScoresLabel => {
        const actions = cards.map(dealerCard => {
          return getAbbreviatedAction(
            strategy.dealerCards[dealerCard].decisions[playerScoresLabel].action,
          );
        });
        return [playerScoresLabel, ...actions];
      },
      overallFinalProbabilitiesRowGetter: playerScoresLabel => {
        const allProbabilities = cards.map(dealerCard => {
          const decision = strategy.dealerCards[dealerCard].decisions[playerScoresLabel];
          return multiplyFinalProbabilities(
            decision.selectedConsequence.finalProbabilities,
            1 / cards.length,
          );
        });
        return allProbabilities.reduce<FinalProbabilities>(mergeFinalProbabilities, {});
      },
      overallOutcomesRowGetter: playerScoresLabel => {
        const allOutcomes = cards.map(dealerCard => {
          const decision = strategy.dealerCards[dealerCard].decisions[playerScoresLabel];
          return decision.selectedConsequence.outcomes;
        });
        const aggregatedOutcomes = mergeOutcomes(allOutcomes);
        return multiplyOutcomes(aggregatedOutcomes, 1 / allOutcomes.length);
      },
    },
    strategy.options,
    strategy.summary,
  );
};

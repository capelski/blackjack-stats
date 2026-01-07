import { Card } from '../types/card.type';
import { DealerCardStrategy } from '../types/dealer-card-strategy.type';
import { FinalProbabilities } from '../types/final-scores.type';
import { Outcomes } from '../types/outcomes.type';
import { PlayerDecisionStrategy } from '../types/player-decision-strategy.type';
import { StrategyOptions } from '../types/strategy-options.type';
import { cards } from './cards.logic';
import { getInitialPairs } from './initial-pairs.logic';
import { getAbbreviatedAction, getInitialPairLabels } from './labels.logic';
import {
  getOutcomesLabels,
  mergeOutcomes,
  multiplyOutcomes,
  outcomesToValues,
} from './outcomes.logic';
import { toPercentage } from './percentages.logic';
import {
  mergeFinalProbabilities,
  multiplyFinalProbabilities,
  stringifyFinalProbabilities,
} from './player-finals.logic';

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

export const getIndividualFinalProbabilitiesTable = (
  headers: (string | number)[],
  getRow: PlayerScoresRowGetter,
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

export const getIndividualOutcomesTable = (
  headers: (string | number)[],
  getRow: PlayerScoresRowGetter,
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

export type StrategyTableResolvers = {
  actionsHeaders: Card[];
  actionsRowGetter: PlayerScoresRowGetter;
  overallFinalProbabilitiesRowGetter: FinalProbabilitiesRowGetter;
  overallOutcomesRowGetter: OutcomesRowGetter;
  individualFinalProbabilitiesHeaders: Card[];
  individualFinalProbabilitiesRowGetter: PlayerScoresRowGetter;
  individualOutcomesHeaders: Card[];
  individualOutcomesRowGetter: PlayerScoresRowGetter;
};

export const printStrategyTable = (
  resolvers: StrategyTableResolvers,
  strategyOptions: StrategyOptions = {},
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

  const individualFinalProbabilitiesTable = getIndividualFinalProbabilitiesTable(
    resolvers.individualFinalProbabilitiesHeaders,
    resolvers.individualFinalProbabilitiesRowGetter,
    strategyOptions,
  );

  const individualOutcomesTable = getIndividualOutcomesTable(
    resolvers.individualOutcomesHeaders,
    resolvers.individualOutcomesRowGetter,
    strategyOptions,
  );

  console.log(
    `${actionsTable}\n
${overallFinalProbabilitiesTable}\n
${overallOutcomesTable}\n
${individualFinalProbabilitiesTable}\n
${individualOutcomesTable}`,
  );
};

export const printPlayerDecisionStrategyTables = (
  strategy: PlayerDecisionStrategy,
  strategyOptions: StrategyOptions = {},
) => {
  return printStrategyTable(
    {
      actionsHeaders: ['Score', 'Action'],
      actionsRowGetter: playerScoresLabel => [
        playerScoresLabel,
        strategy[playerScoresLabel].action,
      ],
      overallFinalProbabilitiesRowGetter: playerScoresLabel =>
        strategy[playerScoresLabel].selectedOutcomes.finalProbabilities,
      overallOutcomesRowGetter: playerScoresLabel => strategy[playerScoresLabel].selectedOutcomes,
      individualFinalProbabilitiesHeaders: ['Score', 'Final Probabilities'],
      individualFinalProbabilitiesRowGetter: playerScoresLabel => {
        const finalProbabilities = strategy[playerScoresLabel].selectedOutcomes.finalProbabilities;
        return [playerScoresLabel, stringifyFinalProbabilities(finalProbabilities).join(' / ')];
      },
      individualOutcomesHeaders: ['Score', ...getOutcomesLabels()],
      individualOutcomesRowGetter: playerScoresLabel => {
        const outcomes = strategy[playerScoresLabel].selectedOutcomes;
        return [playerScoresLabel, ...outcomesToValues(outcomes)];
      },
    },
    strategyOptions,
  );
};

export const printDealerCardStrategyTables = (
  strategy: DealerCardStrategy,
  strategyOptions: StrategyOptions = {},
) => {
  return printStrategyTable(
    {
      actionsHeaders: ['', ...cards],
      actionsRowGetter: playerScoresLabel => {
        const actions = cards.map(dealerCard => {
          return getAbbreviatedAction(strategy[playerScoresLabel][dealerCard].action);
        });
        return [playerScoresLabel, ...actions];
      },
      overallFinalProbabilitiesRowGetter: playerScoresLabel => {
        const allProbabilities = cards.map(dealerCard => {
          const decision = strategy[playerScoresLabel][dealerCard];
          return multiplyFinalProbabilities(
            decision.selectedOutcomes.finalProbabilities,
            1 / cards.length,
          );
        });
        return allProbabilities.reduce<FinalProbabilities>(mergeFinalProbabilities, {});
      },
      overallOutcomesRowGetter: playerScoresLabel => {
        const allOutcomes = cards.map(dealerCard => {
          const decision = strategy[playerScoresLabel][dealerCard];
          return decision.selectedOutcomes;
        });
        const aggregatedOutcomes = mergeOutcomes(allOutcomes);
        return multiplyOutcomes(aggregatedOutcomes, 1 / allOutcomes.length);
      },
      individualFinalProbabilitiesHeaders: ['', ...cards],
      individualFinalProbabilitiesRowGetter: playerScoresLabel => {
        const allFinalProbabilities = cards.map(dealerCard => {
          const finalProbabilities =
            strategy[playerScoresLabel][dealerCard].selectedOutcomes.finalProbabilities;
          return Object.keys(finalProbabilities)
            .map(finalScoreLabel => {
              return `${finalScoreLabel}: ${toPercentage(finalProbabilities[finalScoreLabel])}`;
            })
            .join(' / ');
        });

        return [playerScoresLabel, ...allFinalProbabilities];
      },
      individualOutcomesHeaders: ['', ...cards],
      individualOutcomesRowGetter: playerScoresLabel => {
        const outcomesLabels = getOutcomesLabels();
        const allReturns = cards.map(dealerCard => {
          const decision = strategy[playerScoresLabel][dealerCard];
          const outcomes = outcomesToValues(decision.selectedOutcomes);
          return outcomesLabels.map((label, index) => `${label}: ${outcomes[index]}`).join(' / ');
        });

        return [playerScoresLabel, ...allReturns];
      },
    },
    strategyOptions,
  );
};

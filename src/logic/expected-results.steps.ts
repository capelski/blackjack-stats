import { DataTable, Then } from '@cucumber/cucumber';
import { lose, push, Result, win } from '../models/result.model';
import { FinalScore } from '../types/final-score.type';
import { EdgeContribution } from '../types/outcomes.type';
import { Rules } from '../types/rules.type';
import { dealerFinalScores } from './dealer-data.logic';
import { getExpectedResult, getExpectedResults } from './expected-results.logic';
import {
  findFinalScore,
  getFinalScoresListForOptimalActions,
  getFinalScoresListForStandThreshold,
} from './final-scores-list.steps';

const assertEqual = (actual: unknown, expected: unknown, message: string): void => {
  if (actual !== expected) {
    throw new Error(`${message}: expected "${expected}", got "${actual}"`);
  }
};

const getFinalScoresFromResolver = (rules: Rules, resolver: string): FinalScore[] => {
  if (resolver === 'Optimal actions') {
    return getFinalScoresListForOptimalActions(rules);
  }

  const thresholdMatch = resolver.match(/^(\d+) stand threshold$/);
  if (thresholdMatch) {
    return getFinalScoresListForStandThreshold(rules, Number(thresholdMatch[1]));
  }

  throw new Error(`Unknown hand resolver: "${resolver}"`);
};

export const formatProbabilityByBetMultiplier = (
  edgeContributions: EdgeContribution[],
  result: Result,
): string => {
  return edgeContributions
    .filter((contribution) => contribution.result === result)
    .map((contribution) => `${contribution.betMultiplier}=${contribution.probability}`)
    .join(',');
};

Then(
  'the following individual expected result scenarios are considered',
  function (table: DataTable) {
    for (const row of table.hashes()) {
      const resolver = row['Hand resolver'].trim();
      const rules: Rules = JSON.parse(row['Rules'].trim());
      const finalScores = getFinalScoresFromResolver(rules, resolver);
      const finalScore = findFinalScore(
        finalScores,
        row['Score'].trim(),
        JSON.parse(row['Modifiers'].trim()),
      );
      const result = getExpectedResult(finalScore, dealerFinalScores);

      assertEqual(String(result.outcomes.win), row['Win'].trim(), 'Win mismatch');
      assertEqual(String(result.outcomes.push), row['Push'].trim(), 'Push mismatch');
      assertEqual(String(result.outcomes.lose), row['Lose'].trim(), 'Lose mismatch');
    }
  },
);

Then(
  'the following overall expected results scenarios are considered',
  function (table: DataTable) {
    for (const row of table.hashes()) {
      const resolver = row['Hand resolver'].trim();
      const rules: Rules = JSON.parse(row['Rules'].trim());
      const finalScores = getFinalScoresFromResolver(rules, resolver);
      const results = getExpectedResults(finalScores, dealerFinalScores);

      assertEqual(results.probability, Number(row['Probability'].trim()), 'Probability mismatch');
      assertEqual(
        formatProbabilityByBetMultiplier(results.edgeContributions, win),
        row['Win'].trim(),
        'Win mismatch',
      );
      assertEqual(
        formatProbabilityByBetMultiplier(results.edgeContributions, push),
        row['Push'].trim(),
        'Push mismatch',
      );
      assertEqual(
        formatProbabilityByBetMultiplier(results.edgeContributions, lose),
        row['Lose'].trim(),
        'Lose mismatch',
      );
      assertEqual(results.edge, Number(row['Edge'].trim()), 'Edge mismatch');
    }
  },
);

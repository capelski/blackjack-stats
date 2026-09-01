import { DataTable, Then } from '@cucumber/cucumber';
import { FinalScore } from '../types/final-score.type';
import { Rules } from '../types/rules.type';
import { dealerFinalScores } from './dealer-data.logic';
import { getExpectedResult, getExpectedResults } from './expected-results.logic';
import {
  findFinalScore,
  formatProbabilityByBetMultiplier,
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

Then('the following individual expected result scenarios are considered', function(
  table: DataTable,
) {
  for (const row of table.hashes()) {
    const resolver = row['Hand resolver'].trim();
    const rules: Rules = JSON.parse(row['Rules'].trim());
    const finalScores = getFinalScoresFromResolver(rules, resolver);
    const finalScore = findFinalScore(
      finalScores,
      row['Score'].trim(),
      Number(row['Bet multiplier'].trim()),
    );
    const result = getExpectedResult(finalScore, dealerFinalScores);

    assertEqual(
      formatProbabilityByBetMultiplier(result.outcomesByBetMultiplier.win),
      row['Win'].trim(),
      'Win mismatch',
    );
    assertEqual(
      formatProbabilityByBetMultiplier(result.outcomesByBetMultiplier.push),
      row['Push'].trim(),
      'Push mismatch',
    );
    assertEqual(
      formatProbabilityByBetMultiplier(result.outcomesByBetMultiplier.lose),
      row['Lose'].trim(),
      'Lose mismatch',
    );
    assertEqual(result.edge, Number(row['Edge'].trim()), 'Edge mismatch');
  }
});

Then('the following overall expected results scenarios are considered', function(table: DataTable) {
  for (const row of table.hashes()) {
    const resolver = row['Hand resolver'].trim();
    const rules: Rules = JSON.parse(row['Rules'].trim());
    const finalScores = getFinalScoresFromResolver(rules, resolver);
    const results = getExpectedResults(finalScores, dealerFinalScores);

    assertEqual(results.probability, Number(row['Probability'].trim()), 'Probability mismatch');
    assertEqual(
      formatProbabilityByBetMultiplier(results.outcomesByBetMultiplier.win),
      row['Win'].trim(),
      'Win mismatch',
    );
    assertEqual(
      formatProbabilityByBetMultiplier(results.outcomesByBetMultiplier.push),
      row['Push'].trim(),
      'Push mismatch',
    );
    assertEqual(
      formatProbabilityByBetMultiplier(results.outcomesByBetMultiplier.lose),
      row['Lose'].trim(),
      'Lose mismatch',
    );
    assertEqual(results.edge, Number(row['Edge'].trim()), 'Edge mismatch');
  }
});

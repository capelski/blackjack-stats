import { DataTable, Then } from '@cucumber/cucumber';
import { FinalScore } from '../types/final-score.type';
import { Rules } from '../types/rules.type';
import { getExpectedResult, getExpectedResults } from './expected-results.logic';
import { getProbabilityByBetMultiplier } from './final-scores-list.logic';
import {
  formatProbabilityByBetMultiplier,
  getFinalScoresListForOptimalActions,
  getFinalScoresListForStandThreshold,
} from './final-scores-list.steps';
import { parseScore } from './result.steps';

const assertEqual = (actual: unknown, expected: unknown, message: string): void => {
  if (actual !== expected) {
    throw new Error(`${message}: expected "${expected}", got "${actual}"`);
  }
};

const findFinalScore = (finalScores: FinalScore[], scoreLabel: string): FinalScore => {
  const score = parseScore(scoreLabel);
  const finalScore = finalScores.find(item => item.score === score);

  if (!finalScore) {
    throw new Error(`Could not find final score for label "${scoreLabel}"`);
  }

  return finalScore;
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
    const finalScore = findFinalScore(finalScores, row['Score'].trim());
    const probabilityByBetMultiplier = getProbabilityByBetMultiplier(finalScore);
    const result = getExpectedResult(finalScore, probabilityByBetMultiplier);

    assertEqual(String(result.probability), row['Probability'].trim(), 'Probability mismatch');
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
    assertEqual(String(result.edge), row['Edge'].trim(), 'Edge mismatch');
  }
});

Then('the following overall expected results scenarios are considered', function(table: DataTable) {
  for (const row of table.hashes()) {
    const resolver = row['Hand resolver'].trim();
    const rules: Rules = JSON.parse(row['Rules'].trim());
    const finalScores = getFinalScoresFromResolver(rules, resolver);
    const results = getExpectedResults(finalScores);

    assertEqual(String(results.probability), row['Probability'].trim(), 'Probability mismatch');
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
    assertEqual(String(results.edge), row['Edge'].trim(), 'Edge mismatch');
  }
});
